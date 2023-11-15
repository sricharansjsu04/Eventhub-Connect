import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import VenueModal from './VenueModal';

const venuesData = [
  {
    id: 1,
    name: 'Venue 1',
    sportType: 'Football',
    poolSize: 11,
    location: 'Location 1',
    photoUrl: ['https://picsum.photos/id/96/200/300'],
  },
  {
    id: 2,
    name: 'Venue 2',
    sportType: 'Basketball',
    poolSize: 5,
    location: 'Location 2',
    photoUrl: ['https://picsum.photos/id/96/200/300'],
  },
  // Add more venues as needed
];

const EventForm = () => {
  const [formData, setFormData] = useState({
    sportType: '',
    poolSize: '',
    slotTime: '',
    location: '',
    date: '', // Add date field
  });

  const [filteredVenues, setFilteredVenues] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // console.log('Updated FormData:', { ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Filter venues based on form data
    const filteredResults = venuesData.filter((venue) => {
      return (
        (formData.sportType === '' || venue.sportType === formData.sportType) &&
        (formData.poolSize === '' || venue.poolSize >= parseInt(formData.poolSize)) &&
        (formData.location === '' || venue.location === formData.location)
      );
    });
    setFilteredVenues(filteredResults);
  };

  const handleVenueClick = (venue) => {
    setSelectedVenue(venue);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVenue(null);
  };

  const availableSportsTypes = Array.from(new Set(venuesData.map((venue) => venue.sportType)));
  const availableLocations = Array.from(new Set(venuesData.map((venue) => venue.location)));

  return (
    <Container fluid className="mt-4">
      <h2>Host an Event</h2>
      <Form onSubmit={handleFormSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="sportType">
              <Form.Label>Sport Type</Form.Label>
              <Form.Control as="select" name="sportType" onChange={handleFormChange}>
                <option value="">All</option>
                {availableSportsTypes.map((sportType) => (
                  <option key={sportType} value={sportType}>
                    {sportType}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control as="select" name="location" onChange={handleFormChange}>
                <option value="">All</option>
                {availableLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="date" style={{ width: '49.5%', marginBottom: '10px' }}>
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" name="date" onChange={handleFormChange} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Find Venues
        </Button>
      </Form>

      <Row className="mt-4">
        {filteredVenues.map((venue) => (
          <Col key={venue.id} md={4}>
            <Card onClick={() => handleVenueClick(venue)} style={{ padding: '20px' }}>
              <Card.Body>
                <Card.Title>{venue.name}</Card.Title>
                <Card.Text>
                  Sport Type: {venue.sportType}
                  <br />
                  Pool Size: {venue.poolSize}
                  <br />
                  Location: {venue.location}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <VenueModal showModal={showModal} formData={formData} selectedVenue={selectedVenue} closeModal={closeModal} />
    </Container>
  );
};

export default EventForm;
