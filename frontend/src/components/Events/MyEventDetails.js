import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col, Carousel, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const MyEventDetails = ({ venues,loggedInUser }) => {

  const { id } = useParams();
  const [events, setEvents] = useState(venues);

  useEffect(() => {
    if (venues) {
      setEvents(venues);
    }
  }, [venues]);

  if (!events) {
    return <div>Error loading data</div>;
  }
  
  const event = events.find((venue) => venue.id === parseInt(id, 10));

  return (
    <Container fluid className="mt-4">
      <Container className="main-container rounded p-4 bg-light" style={{ maxWidth: '80%', margin: 'auto' }}>
        <h2 className="mb-4">Event Details</h2>
        <Row>

          <Col md={6} className="mb-4">
          <div className="details-container p-4 rounded bg-light">
          
    <h3>{event.name}</h3>
    <dl className="row mt-4">
      <dt className="col-sm-4">Event Name:</dt>
      <dd className="col-sm-8">{event.event_name}</dd>

      <dt className="col-sm-4">Sport Type:</dt>
      <dd className="col-sm-8">{event.sportType}</dd>

      <dt className="col-sm-4">Pool Size:</dt>
      <dd className="col-sm-8">{event.pool_size} players</dd>

      <dt className="col-sm-4">Venue:</dt>
      <dd className="col-sm-8">{event.name}</dd>

      <dt className="col-sm-4">Address:</dt>
      <dd className="col-sm-8">{event.address1}</dd>

      <dt className="col-sm-4">Country:</dt>
      <dd className="col-sm-8">{event.country}</dd>

      <dt className="col-sm-4">Court ID:</dt>
      <dd className="col-sm-8">{event.court_id}</dd>

      <dt className="col-sm-4">Created By:</dt>
      <dd className="col-sm-8">{event.created_user}</dd>

      <dt className="col-sm-4">Current Pool Size:</dt>
      <dd className="col-sm-8">{event.current_pool_size}</dd>

      <dt className="col-sm-4">Players:</dt>
      <dd className="col-sm-8">{event.players.join(', ')}</dd>

      {/* Add more details as needed */}
    </dl>

    
  </div>
          </Col>
          <Col md={6}>
            <div style={{ width: '400px', height: '400px', overflow: 'hidden', borderRadius: '10px' }}>
              <Carousel interval={null} style={{ width: '100%', height: '100%' }}>
                {event.photoUrl.map((url, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100 img-fluid rounded"
                      src={url}
                      alt={`Photo ${index + 1}`}
                      style={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '10px' }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default MyEventDetails;
