// PlayareaRequests.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Row, Col } from 'react-bootstrap';

const PlayareaRequestCard = ({ playarea }) => {
  const navigate = useNavigate();

  // Navigate to the detailed view of the playarea request
  const handleDetailsClick = () => {
    navigate(`details/${playarea.id}`, { state: { fromRequestsPage: true } });
  };

  return (
    <Col md={12} className="mb-3">
      <Card onClick={handleDetailsClick} style={{ cursor: 'pointer' }}>
        {/* <Card.Body>
          <Card.Title>{playarea.name}</Card.Title>
          <Card.Text>
            Owner: {playarea.owner}
            <br />
            City: {playarea.city}
          </Card.Text>
        </Card.Body> */}
        <Card.Body className="d-flex align-items-center" style={{ padding: "0px !important" }}>
          <div className="mr-3">
            <Card.Img
              variant="left"
              src={playarea.docUrls[0]}
              style={{ width: '150px', height: '150px' }}
              alt={playarea.name}
            />
          </div>
          <div id="card-body-details">
          <Card.Title style={{ textTransform: 'uppercase', fontSize: '1.25rem' }}>{playarea.name}</Card.Title>
            <Card.Text>
              Owner: {playarea.owner}
              <br />
              City: {playarea.city}
            </Card.Text>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

const PlayareaRequests = ({ playareas }) => {
  const navigate = useNavigate();

  // Handler for the Accept and Reject actions, assuming you have a method to call the API
  const handleAccept = (playareaId) => {
    // Call the API to accept the request
    // Then navigate back to the list or update the state accordingly
  };

  const handleReject = (playareaId) => {
    // Call the API to reject the request
    // Then navigate back to the list or update the state accordingly
  };

  // Filter the playareas to only show those with a 'Requested' status
  const requestedPlayareas = playareas.filter(p => p.status === 'Requested');

  return (
    <>
      {requestedPlayareas.length > 0 ? (
        <Row>
          {requestedPlayareas.map(playarea => (
            <PlayareaRequestCard key={playarea.id} playarea={playarea} />
          ))}
        </Row>
      ) : (
        <div>No Play area requests available</div>
      )}
    </>
  );
};

export default PlayareaRequests;
