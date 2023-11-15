import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const EventDetails = () => {
  const { id } = useParams();
  const [venues, setVenues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3500/home');
        const result = await response.json();
        setVenues(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // The empty dependency array ensures that this effect runs only once, similar to componentDidMount

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or any other loading indicator
  }

  if (!venues) {
    return <div>Error loading data</div>; // You can handle the error state appropriately
  }

  const event = venues.find((venue) => venue.id === parseInt(id, 10));

  return (
    <Container fluid className="mt-4">
      <h2 className="mb-4">Event Details</h2>
      <Row>
        <Col md={6} className="mb-4">
          <div className="details-container">
            <h3>{event.name}</h3>
            <p>
              Sport Type: {event.sportType}
              <br />
              Pool Size: {event.poolSize} players
              <br />
              Venue: {event.venueName}
            </p>
            <Button variant="primary">Request to Join the Event</Button>
          </div>
        </Col>
        <Col md={6}>
          <img
            src={event.photoUrl[0] || 'https://picsum.photos/id/96/400/300'}
            alt={`Venue ${event.id}`}
            className="img-fluid rounded"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default EventDetails;
