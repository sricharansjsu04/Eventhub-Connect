// AllPlayareas.js
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PlayareaCard = ({ playarea }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Use relative path for navigation
    navigate(`details/${playarea.id}`);
  };

  return (
    <Col md={12} className="mb-3">
      <Card onClick={handleCardClick} style={{ cursor: 'pointer' }}>
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
              src="https://www.eye.co.jp/projects/examples/img/sports/spb15/1_l.jpg"
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

const AllPlayareas = ({ playareas }) => {
  return (
    <Row>
      {playareas.map(playarea => (
        <PlayareaCard key={playarea.id} playarea={playarea} />
      ))}
    </Row>
  );
};

export default AllPlayareas;
