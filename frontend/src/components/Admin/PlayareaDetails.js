import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Container, ListGroup, ListGroupItem, Form, Image, Row, Col, Alert, Carousel } from 'react-bootstrap';
import { updatePlayareaStatus } from './api'; // Adjust the path to where your api.js file is located


const PlayareaDetails = ({ playareas, documents = [], onSaveComment, onBan, onAccept, onReject }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const playarea = playareas?.find(p => p.id.toString() === id);
  const [comments, setComments] = useState(playarea?.comments || '');

  const location = useLocation();
  const fromRequestsPage = location.state?.fromRequestsPage;


  const handleCommentChange = (e) => {
    setComments(e.target.value);
  };

  const handleCommentSave = () => {
    onSaveComment(id, comments);
    // This function should make an API call to save the comments
  };

  const [confirmMessage, setconfirmMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleStatusChange = (newStatus) => {
    // console.log('before sending id:', id);
    // console.log('before sending status:', newStatus);
    // console.log('before sending comments:', comments);
  
    updatePlayareaStatus(id, newStatus, comments)
      .then(response => {
        console.log('Raw Response:', response); // Log the raw response
        return response; 
      })
      .then(data => {
        console.log('Updated status to: ', data.message);
        setconfirmMessage(data.message);
      })
      .catch(error => {
        console.error('Error:', error);
        setErrorMessage(`Failed to update status: ${error.message}`);
        setTimeout(() => setErrorMessage(''), 5000);
      });
  };
  


  let actionButtons;

if (confirmMessage || errorMessage) {
  actionButtons = (
    <Button variant="secondary" onClick={() => navigate('/admin')}>Back to Dashboard</Button>
  );
} else if (fromRequestsPage) {
  actionButtons = (
    <>
      <Button variant="success" onClick={() => handleStatusChange('Accepted')}>Accept</Button>
      <Button variant="danger" onClick={() => handleStatusChange('Rejected')}>Reject</Button>
    </>
  );
} else {
  if (playarea?.status === 'Accepted') {
    actionButtons = <Button variant="danger" onClick={() => handleStatusChange('Banned')}>Ban Playarea</Button>;
  } else if (playarea?.status === 'Rejected' || playarea?.status === 'Banned') {
    actionButtons = <Button variant="success" onClick={() => handleStatusChange('Accepted')}>Accept Playarea</Button>;
  }
}


  if (!playarea) {
    return <div>Playarea not found.</div>;
  }

  return (

<Container fluid className="mt-4">
<Container className="main-container rounded p-4 bg-light" style={{ maxWidth: '80%', margin: 'auto' }}>
  <h2 className="mb-4">Playarea Details</h2>
    {/* <Card>
    <Card.Body>
    <Card.Text style={{ fontSize: '1.5rem', textAlign: 'center' }}>
      </Card.Text>
      <Button variant="primary" onClick={() => navigate('/admin')}>Back to Dashboard</Button>
    </Card.Body>
  </Card> */}
  <Row>
  {confirmMessage && <Alert variant="success">{confirmMessage}</Alert>}
  {/* {error && <Alert variant="danger">{error}</Alert>} */}
    <Col md={6} className="mb-4">
    <div className="details-container p-4 rounded bg-light">
    
<h3 style={{ textTransform: 'uppercase'}}>{playarea.name}</h3>
<dl className="row mt-4">


<dt className="col-sm-4">Owner:</dt>
<dd className="col-sm-8">{playarea.owner}</dd>

<dt className="col-sm-4">Address Line 1:</dt>
<dd className="col-sm-8">{playarea.address1} players</dd>

<dt className="col-sm-4">Address Line 2:</dt>
<dd className="col-sm-8">{playarea.address2}</dd>

<dt className="col-sm-4">City:</dt>
<dd className="col-sm-8">{playarea.city}</dd>

<dt className="col-sm-4">State:</dt>
<dd className="col-sm-8">{playarea.state}</dd>

<dt className="col-sm-4">Country:</dt>
<dd className="col-sm-8">{playarea.country}</dd>
</dl>
<Form.Group className="my-3">
    <Form.Label>Comments</Form.Label>
    <Form.Control as="textarea" rows={3} value={comments} onChange={handleCommentChange} />
</Form.Group>

{actionButtons}
</div>
    </Col>
    <Col md={6}>
      <div style={{ width: '400px', height: '400px', overflow: 'hidden', borderRadius: '10px' }}>
        <Carousel interval={null} style={{ width: '100%', height: '100%' }}>
          {playarea.docUrls.map((url, index) => (
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

export default PlayareaDetails;

