import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import VenueModal from './VenueModal';

// const venuesData = [
//   {
//     id: 5,
//     name: 'test',
//     owner: 1,
//     address1: 'welcome',
//     address2: 'welcome',
//     city: 'w',
//     state: 'w',
//     country: 'w',
//     zipcode: 12312,
//     status: 'Approved',
//     comments: null,
//     sports: [ 'Bad minton', 'Football' ]
//   }

// ];


const EventForm = ({loggedInUser}) => {
  const [venuesData, setVenuesData] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [sports,setSports] = useState([]);
  const [locations,setLocations] = useState([]);

  const [formData, setFormData] = useState({
    sportType: '',
    poolSize: '',
    slotTime: '',
    location: '',
    date: '',
  });

  useEffect(() => {
    fetch(`http://localhost:3500/venues/getSports`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setSports(data.sports);
        setLocations(data.cities);
      })
      .catch((error) => console.error('Error fetching venues:', error));
  }, []);

  useEffect(() => {
    // Filter venues based on form data
    if (Array.isArray(venuesData)) {
      const filteredResults = venuesData.filter((venue) => {
        return (
          (formData.sportType === '' || venue.sports.includes(formData.sportType)) &&
          (formData.location === '' || venue.city === formData.location)
        );
      });
      console.log("Filtering venues:", filteredResults);
      setFilteredVenues(filteredResults);
      console.log(filteredResults)
    }
  }, [venuesData, formData]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Check if all form fields are filled
    const { sportType, poolSize, location, date } = formData;
    
      // Perform POST request to fetch matching venues from the backend
      fetch('http://localhost:3500/venues/getVenues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data)
          setVenuesData(data);
        })
        .catch((error) => console.error('Error fetching venues:', error));
    
  };

  const handleVenueClick = (venue) => {
    setSelectedVenue(venue);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVenue(null);
  };
  const contentBoxStyles = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    /* Add any other styles as needed */
  };
  return (
    <Container fluid className="mt-4">
      
      <div style={contentBoxStyles}>
      <h2>Host an Event</h2>
      <Form onSubmit={handleFormSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="sportType">
              <Form.Label>Sport Type</Form.Label>
              <Form.Control as="select" name="sportType" onChange={handleFormChange}>
                <option value="">All</option>
                {sports.map((sportType) => (
                  <option key={sportType.name} value={sportType.name}>
                    {sportType.name}
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
                {locations.map((location) => (
                  <option key={location.city} value={location.city}>
                    {location.city}
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
      </div>
      {filteredVenues.length > 0 && (
      <Row className="mt-4">
        {filteredVenues.map((venue) => (
          <Col key={venue.id} md={4}>
            <Card onClick={() => handleVenueClick(venue)} style={{ padding: '20px', margin: '5px' }}>
              <Card.Body>
                <Card.Title>{venue.name}</Card.Title>
                <Card.Text>
                  Sport Type: {venue.sports.join(', ')}
                  <br />
                  Location: {venue.city}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      )}
      <VenueModal showModal={showModal} formData={formData} selectedVenue={selectedVenue} closeModal={closeModal} loggedInUser={loggedInUser} />
    </Container>
  );
};

export default EventForm;
