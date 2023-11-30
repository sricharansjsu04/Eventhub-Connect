import React, { useEffect, useState } from 'react';
import { Container, Button, Row, Col, Carousel, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import * as urls from './config';

const MyEventDetails = ({ venues,loggedInUser }) => {

  const { id } = useParams();
  const [events, setEvents] = useState(venues);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [waitlistRequests, setWaitlistRequests] = useState([]);

  useEffect(() => {
    if (venues) {
      setEvents(venues);
    }
  }, [venues]);

  useEffect(() => {
    console.log('Waitlist requests changed:', waitlistRequests);
  }, [waitlistRequests]);

  useEffect(() => {
  fetch(`${urls.getWaitlist}${id}`)
  .then((response) => response.json())
  .then((data) => setWaitlistRequests(data))
  .catch((error) => console.error('Error fetching waitlist requests:', error));
}, [id]);

  if (!events) {
    return <div>Error loading data</div>;
  }
  
  const event = events.find((venue) => venue.id === parseInt(id, 10));

  if (!events) {
    // Reload the page if events is null or undefined
    window.location.reload();
    return null; // This line might not be necessary, but included for clarity
  }

  const handleRefresh = () => {
    console.log(urls.getWaitlist+id)
    fetch(`${urls.getWaitlist}${id}`)
      .then((response) => response.json())
      .then((data) => setWaitlistRequests(data))
      .catch((error) => console.error('Error fetching waitlist requests:', error));
  };

  const handleAccept = async (user) => {
    try {
        const response = await fetch(urls.acceptReq, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_id: id,
            // Add user_id and status as needed, you might need to get the user_id from your authentication system
            user_id: user.id, // Replace with the actual user_id
          }),
        });
        if (response.ok) {
            // Update the waitlistRequests state by removing the accepted user
            setWaitlistRequests((prevRequests) => prevRequests.filter((u) => u.id !== user.id));
          } else {
            // Handle other response statuses if needed
            console.error('Error joining the event:', response.statusText);
          }

      } catch (error) {
        console.error('Error joining the event:', error);
      }
    console.log(`Accepting request from user: ${user.id}`);
  };

  const handleReject = async (user) => {
    try {
        const response = await fetch(urls.rejectReq, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event_id: id,
            user_id: user.id, 
          }),
        });
        if (response.ok) {
            // Update the waitlistRequests state by removing the accepted user
            setWaitlistRequests((prevRequests) => prevRequests.filter((u) => u.id !== user.id));
          } else {
            // Handle other response statuses if needed
            console.error('Error removing from waitlist for the event:', response.statusText);
          }

      } catch (error) {
        console.error('Error removing from waitlist for the event:', error);
      }

  };

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

      <dt className="col-sm-4">Date:</dt>
      <dd className="col-sm-8">{new Date(event.event_slot_date).toISOString().split('T')[0]}</dd>

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
      <dd className="col-sm-8" style={{ color: event.current_pool_size < event.pool_size * 0.5 ? 'green' : 'red' }}>
        {event.current_pool_size} / {event.pool_size}
      </dd>

      <dt className="col-sm-4">Players:</dt>
      <dd className="col-sm-8">{event.players.join(', ')}</dd>

      {/* Add more details as needed */}
    </dl>

    
  </div>
          </Col>
          <Col md={6}>
          <div className="requests-container p-4 rounded bg-light" style={{ height: '400px', overflowY: 'auto', borderRadius: '10px', border: '1px solid #ccc' }}>
          <div className="d-flex justify-content-between mb-3">
                <div className="col-9">
                  <h4 className="mb-0">Player Requests</h4>
                </div>
                <div className="col-3">
                  <Button variant="primary" size="sm" onClick={handleRefresh}>
                    Refresh
                  </Button>
                </div>
              </div>
          {waitlistRequests.length > 0 ? (
                <ul className="list-group">
                  {waitlistRequests.map((user, index) => (
                    <li key={index} className={`list-group-item ${selectedRequest === user.id ? 'active' : ''}`}>
                      {user.username}
                      <div className="float-end">
                        <Button variant="success" onClick={() => handleAccept(user)}>
                          Accept
                        </Button>
                        <Button variant="danger" onClick={() => handleReject(user)}>
                          Reject
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No requests</p>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default MyEventDetails;
