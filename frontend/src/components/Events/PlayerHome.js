import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Container, Row, Col, Form, Navbar } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import '../../App.css';
import CreatedEvents from "./CreatedEvents";
import MyEvents from "./MyEvents";
import MyEventDetails from "./MyEventDetails";
import EventHosted from "./EventHosted";



const VenueCard = ({ venue, isCreatedByUser }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {

      navigate(`/event/${venue.id}`);
   
  };

  return (
    <Col md={12} className="mb-4">
      <Card onClick={handleCardClick}>
        <Card.Body className="d-flex align-items-center" style={{ padding: "0px !important" }}>
          <div className="mr-3">
            <Card.Img
              variant="left"
              src={venue.photoUrl[0]}
              style={{ width: '150px', height: '150px' }}
              alt={`Venue ${venue.event_name}`}
            />
          </div>
          <div id="card-body-details">
            <Card.Title>{venue.event_name}</Card.Title>
            <Card.Text>
              Sport Type: {venue.sportType}
              <br />
              Pool Size: {venue.current_pool_size} players out of {venue.pool_size}
              <br />
              Venue: {venue.name}
            </Card.Text>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

const VenueList = ({ venues, isCreatedByUser }) => (
  <Row>
    {venues != null &&
      venues.map((venue) => (
        <VenueCard
          key={venue.id}
          venue={venue}
          isCreatedByUser={isCreatedByUser}
        />
      ))}
  </Row>
);



const HostButton = ({ loggedInUser, venuesData, setFilteredVenues, showMyCreatedEvents }) => {
  const navigate = useNavigate();
  const [showLiveEvents, setShowLiveEvents] = useState(true);
  const [showMyEvents, setShowMyEvents] = useState(false);
  // Remove the local state for showMyCreatedEvents here

  const toggleEvents = (showLive, showMy, showMyCreated) => {
    setShowLiveEvents(showLive);
    setShowMyEvents(showMy);
    // Remove the setShowMyCreatedEvents line
    applyFilters(showLive, showMy, showMyCreated);
  };

  const handleMyEventsClick = () => {
    // Set the URL and render the component
    navigate('/myEvents'); // Update the URL as needed
  };


  const handleMyCreatedEventsClick = () => {
    // Set the URL and render the component
    navigate('/myHostedEvents'); // Update the URL as needed
  };

  const applyFilters = (showLive, showMy, showMyCreated) => {
    let filteredResults;

    if (showLive) {
      filteredResults = venuesData;
    } else if (showMy) {
      filteredResults = venuesData.filter((venue) =>
        venue.players && venue.players.includes(loggedInUser)
      );
    } else if (showMyCreated) {
      filteredResults = venuesData.filter((venue) => venue.created_user === loggedInUser);
    }

    console.log("Filtered Results:", filteredResults);

    setFilteredVenues(filteredResults);
  };

  return (
    <div className="headingnButton">
      <div className='ButtonLeftMargin'>
        <Button
          variant={showLiveEvents ? 'primary' : 'secondary'}
          onClick={() => toggleEvents(true, false, false)}
        >
          Live Events
        </Button>
        <Button
          variant={showMyEvents ? 'primary' : 'secondary'}
          onClick={() => handleMyEventsClick()}
        >
          My Events
        </Button>
        <Button
          variant={showMyCreatedEvents ? 'primary' : 'secondary'}
          onClick={() => handleMyCreatedEventsClick()}
        >
          My Created Events
        </Button>
      </div>
      <div>
        <Button className="btn btn-success" onClick={() => navigate('/host-event')}>
          Host an event
        </Button>
      </div>
    </div>
  );
};

const VenueFilter = ({ onSportTypeChange, onPoolSizeChange, onApplyFilters }) => (

  <Form className="sticky-top bg-light p-3">
    <h5>Event Filters</h5>
    <Form.Group controlId="sportTypeFilter">
      <Form.Label>Sport Type</Form.Label>
      <Form.Control as="select" onChange={onSportTypeChange}>
        <option value="">All</option>
        <option value="Football">Football</option>
        <option value="Bad minton">Badminton</option>
        {/* Add more sport types as needed */}
      </Form.Control>
    </Form.Group>
    <Form.Group controlId="poolSizeFilter">
      <Form.Label>Pool Size</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter number of players"
        onChange={onPoolSizeChange}
      />
    </Form.Group>
    
    <Button className='d-flex' variant="primary" onClick={onApplyFilters} id="FilterSubmit">
      Apply filters
    </Button>
  </Form>
);



function PlayerHome() {
  const [venuesData, setVenuesData] = useState(null);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [showMyCreatedEvents, setShowMyCreatedEvents] = useState(false); // Add state for My Created Events


  const apiCalled = useRef(false);
  useEffect(() => {
    if (!apiCalled.current) {
      async function fetchData() {
        try {
          const response = await fetch('http://localhost:3500/home/getAllEvents');
          const result = await response.json();
          setVenuesData(result);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
        apiCalled.current = true;
      }
      fetchData();
    }
  }, []);

     
  const [sportTypeFilter, setSportTypeFilter] = useState('');
  const [poolSizeFilter, setPoolSizeFilter] = useState('');

  useEffect(() => {
    setFilteredVenues(venuesData);
},[venuesData])

  const applyFilters = () => {
    const filteredResults = venuesData.filter((venue) => {
      const passSportTypeFilter = !sportTypeFilter || venue.sportType === sportTypeFilter;
      const passPoolSizeFilter = !poolSizeFilter || venue.current_pool_size.toString() >= poolSizeFilter;
      return passSportTypeFilter && passPoolSizeFilter;
    });
    setFilteredVenues(filteredResults);
  };
const loggedInUser = "john_doe";

  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/" style={{marginLeft:"20px"}}>
            PlayPals
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text style={{marginRight:"20px"}}>
              Logged in as: {loggedInUser}
            </Navbar.Text>
          </Navbar.Collapse>
        </Navbar>
        <Container fluid className="mt-4">
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <HostButton
                    loggedInUser={loggedInUser}
                    venuesData={venuesData}
                    setFilteredVenues={setFilteredVenues}
                    showMyCreatedEvents={showMyCreatedEvents}
                  />
                  <Row>
                    <Col md={3}>
                      <VenueFilter
                        onSportTypeChange={(e) => setSportTypeFilter(e.target.value)}
                        onPoolSizeChange={(e) => setPoolSizeFilter(e.target.value)}
                        onApplyFilters={() => applyFilters()}
                      />
                    </Col>
                    <Col md={9}>
                    <VenueList venues={filteredVenues} isCreatedByUser={showMyCreatedEvents} />
                    </Col>
                  </Row>
                </div>
              }
            />
             <Route path="/event/:id" element={<EventDetails venues={venuesData} loggedInUser={loggedInUser}/>} />
             <Route
            path="/host-event"
            element={<HostEvent />}
          />
            <Route
              path="/myHostedEvents/"
              element={<CreatedEvents loggedInUser={loggedInUser}/>}
            />
            <Route
            path="/myEvents"
            element={<MyEvents loggedInUser={loggedInUser}/>}
            />
            <Route
          path="/myEvent/:id"
          element={<MyEventDetails venues={venuesData} loggedInUser={loggedInUser}/>} />
          <Route
          path="/myHostedEvent/:id"
          element={<EventHosted venues={venuesData} loggedInUser={loggedInUser}/>} />
          </Routes>
          
        </Container>
      </div>
    </Router>
  );
}

export default PlayerHome;
