import React, { useState, useEffect, useRef, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Container, Row, Col, Form, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Outlet } from 'react-router-dom';
import './PlayerHome.css';
import "../../App.css"
import CreatedEvents from "./CreatedEvents";
import MyEvents from "./MyEvents";
import MyEventDetails from "./MyEventDetails";
import EventHosted from "./EventHosted";
import EventDetails from "./EventDetails";
import HostEvent from "./HostEvent";
import * as urls from './config';
import { AuthContext } from '../../contexts/AuthContext';
import ChatRoom from "../ChatRoom/ChatRoom"


const VenueCard = ({ venue, isCreatedByUser, recData}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {

      navigate(`../event/${venue.id}`);
   
  };



  return (
    <Col md={12} className="mb-4">
      <Card onClick={handleCardClick}>
        <Card.Body className="d-flex align-items-center" style={{ padding: "0px !important" }}>
          <div className="mr-3">
            <Card.Img
              variant="left"
              src={venue.photoUrl[0]}
              style={{ width: '150px', height: '150px' ,borderRadius:"6px"}}
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
              <br />
              Date: {new Date(venue.event_slot_date).toISOString().split('T')[0]}
            </Card.Text>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

const VenueList = ({ venues, isCreatedByUser, recData }) => {
  const navigate = useNavigate();

  const handleCardClick = (redData) => {
      // console.log("This what u are looking for: ",redData.body[0].event_id)
      navigate(`../event/${redData.event_id}`);
   
  };
  return(
  <Row>
    <Col md={12} className="mb-4">
    {console.log('recData:', recData)}
    {recData && (
      <Card onClick={() => handleCardClick(recData)} className="mb-4" style={{ padding: "10px" }}>
      <Card.Body style={{ padding: "0px !important" }}>
        
          <div>
            <h4>{recData.event_name}</h4>
            {/* Add more details as needed */}
            {/* <p>Sport Type: {recData.body[0].sportType}</p> */}
            <p>Pool Size: {recData.current_pool_size} players out of {recData.pool_size}</p>
            {/* <p>Venue: {recData.body[0].name}</p>
            <p>Date: {new Date(recData.body[0].event_slot_date).toISOString().split('T')[0]}</p> */}
          </div>
      

      </Card.Body>
      <Card.Footer className="text-end">

    <small className="text-muted">Recommended Event</small>
    </Card.Footer>
    </Card>
    )}
    
    {/* {console.log(venues)} */}
    {venues != null &&
      venues.map((venue) => (
        <VenueCard
          key={venue.id}
          venue={venue}
          isCreatedByUser={isCreatedByUser}
          recData={recData}
        />
      ))}
      </Col>
  </Row>
  );
};



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
    navigate('../myEvents'); // Update the URL as needed
  };


  const handleMyCreatedEventsClick = () => {
    // Set the URL and render the component
    navigate('../myHostedEvents'); // Update the URL as needed
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
        Hosted Events
      </Button>
    </div>
    <div>
      <Button className="btn btn-success" onClick={() => navigate('../host-event')}>
        Host an event
      </Button>
    </div>
  </div>
  );
};


const VenueFilter = ({ onSportTypeChange, onPoolSizeChange, onApplyFilters, onEventNameChange, sportFilter, onDateChange}) => (
 
  <Form className="sticky-top bg-light p-3" style={{borderRadius:"16px"}}>
    <h5>Event Filters</h5>
    <Form.Group controlId="sportTypeFilter">
      <Form.Label>Sport Type</Form.Label>
      <Form.Control as="select" onChange={onSportTypeChange}>
        <option value="">All</option>
        {console.log(sportFilter)}
        {sportFilter &&
          sportFilter.map((sport) => (
            <option key={sport.name} value={sport.name}>
              {sport.name}
            </option>
          ))}
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
    <Form.Group controlId="dateFilter">
      <Form.Label>Date</Form.Label>
      <Form.Control
        type="date"
        onChange={onDateChange}
      />
    </Form.Group>
    <Form.Group controlId="eventNameFilter">
      <Form.Label>Event Name</Form.Label>
      <Form.Control
        type="text"
        placeholder="Enter event name"
        onChange={onEventNameChange}
      />
    </Form.Group>
    <Button className='d-flex' variant="primary" onClick={onApplyFilters} id="FilterSubmit">
      Apply filters
    </Button>
  </Form>
);



function PlayerHome() {
  const [venuesData, setVenuesData] = useState(null);
  const [recData, setRecData] = useState(null);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const [showMyCreatedEvents, setShowMyCreatedEvents] = useState(false); // Add state for My Created Events
  const [sportFilter, setSportFilter] = useState([]);  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout(); // Call logout from AuthContext
    navigate('/'); // Navigate back to the login page
  };
  const { user } = useContext(AuthContext);
  const [loggedInUser, setLoggedInUser] = useState(user);


  const apiCalled = useRef(false);
  useEffect(() => {
    if (!apiCalled.current) {
      async function fetchData() {
        try {
          const response = await fetch(`${urls.getAllEvents}${loggedInUser}`);
          const result = await response.json();
          console.log(result)
          setVenuesData(result.result);
          setRecData(result.temp);
          setSportFilter(result.sports);
          console.log(result.temp)
          console.log("Here Look here",recData)
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
  const [eventNameFilter, setEventNameFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    setFilteredVenues(venuesData);
},[venuesData])

  const applyFilters = () => {
    const filteredResults = venuesData.filter((venue) => {
      const passSportTypeFilter = !sportTypeFilter || venue.sportType === sportTypeFilter;
      const passPoolSizeFilter = !poolSizeFilter || venue.current_pool_size.toString() >= poolSizeFilter;
      const passEventNameFilter = !eventNameFilter || venue.event_name.toLowerCase().includes(eventNameFilter.toLowerCase());
      const passDateFilter = !dateFilter || new Date(venue.event_slot_date).toISOString().split('T')[0] === dateFilter;
      return passSportTypeFilter && passPoolSizeFilter && passEventNameFilter && passDateFilter;
    });
    setFilteredVenues(filteredResults);
  };
//const loggedInUser = "shireesh20";
// shireesh20
// john_doe

  return (

      <div>
   
   <Navbar bg="dark" variant="dark" expand="lg">
  <Container fluid>
    <Navbar.Brand as={Link} to="/playerHome">
      PlayPal
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="navbar-dark-example" />
    <Navbar.Collapse id="navbar-dark-example">
      <Nav className="ms-auto">
        <Navbar.Text className="me-3">
          Logged in as: {loggedInUser}
        </Navbar.Text>
        <Button variant="outline-danger" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </Nav>
    </Navbar.Collapse>
  </Container>
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
                        onEventNameChange={(e) => setEventNameFilter(e.target.value)}
                        onDateChange={(e) => setDateFilter(e.target.value)}
                        onApplyFilters={() => applyFilters()}
                        sportFilter = {sportFilter}
                      />
                    </Col>
                    <Col md={9}>
                    <VenueList venues={filteredVenues} isCreatedByUser={showMyCreatedEvents} recData={recData} />
                    </Col>
                  </Row>
                </div>
              }
            />
             <Route path="/event/:id" element={<EventDetails venues={venuesData} loggedInUser={loggedInUser}/>} />
             <Route
            path="/host-event"
            element={<HostEvent loggedInUser={loggedInUser}/>}
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
          path="/myEvent/:id/chatRoom/:chatRoomId"
          element={<ChatRoom loggedInUser={loggedInUser}/>} />
            <Route
          path="/myEvent/:id"
          element={<MyEventDetails venues={venuesData} loggedInUser={loggedInUser}/>} />
          <Route
          path="/myHostedEvent/:id"
          element={<EventHosted venues={venuesData} loggedInUser={loggedInUser}/>} />
          <Route
          path="/myEvent/:id/chatRoom/:chatRoomId"
          element={<ChatRoom loggedInUser={loggedInUser}/>} />
          </Routes>
          
        </Container>
      </div>
  );
}

export default PlayerHome;
