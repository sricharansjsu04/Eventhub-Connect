import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Row, Col, Form, Navbar } from 'react-bootstrap';
import './App.css';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import LoginForm from './components/Auth/LoginForm';
import RegistrationForm from './components/Auth/RegistrationForm';
import EventDetails from './components/Events/EventDetails';
import HostEvent from './components/Events/HostEvent';
// Other imports if necessary

const userPool = new CognitoUserPool({
  UserPoolId: 'us-east-1_nq7u4nqww', // Replace with your User Pool Id
  ClientId: '41tv9idcmda9nen7v33tsfbhhj', // Replace with your Client Id
});

const VenueCard = ({ venue }) => {
    const navigate = useNavigate(); // Hook to navigate programmatically

    const handleCardClick = () => {
      navigate(`/event/${venue.id}`); // Redirect to event details page with the corresponding id
    };
    return(
    <Col md={12} className="mb-4">
    <Card onClick={handleCardClick}>
      <Card.Body className="d-flex align-items-center" style={{padding:"0px !important"}} >
        <div className="mr-3">
          <Card.Img
            variant="left"
            src={venue.photoUrl[1] }
            style={{ width: '150px', height: '150px' }}
            alt={`Venue ${venue.id}`}
          />
        </div>
        <div id="card-body-details">
          <Card.Title>{venue.name}</Card.Title>
          <Card.Text> 
            Sport Type: {venue.sportType}
            <br />
            Pool Size: {venue.poolSize} players
            <br />
            Venue: {venue.venueName}
          </Card.Text>
        </div>
      </Card.Body>
    </Card>
  </Col>
  );
    
};
  
const VenueList = ({ venues }) => (
  <Row>

    {venues!=null && venues.map((venue) => (
      <VenueCard key={venue.id} venue={venue} />
    ))}
  </Row>
);

const HostButton = ({ loggedInUser, venuesData, setFilteredVenues }) => {
  const navigate = useNavigate();
  const [showLiveEvents, setShowLiveEvents] = useState(true);
  const [sportTypeFilter, setSportTypeFilter] = useState('');
  const [poolSizeFilter, setPoolSizeFilter] = useState('');

  const toggleEvents = (showLive) => {
    setShowLiveEvents(showLive);
    setSportTypeFilter('');
    setPoolSizeFilter('');
    applyFilters(showLive); // Call applyFilters to update filteredVenues
  };

  const applyFilters = (showLive) => {
    let filteredResults;
    if (showLive) {
      // Display all events for "Live Events"
      filteredResults = venuesData;
    } else {
      // Display events where the logged-in user is present for "My Events"
      filteredResults = venuesData.filter((venue) =>
        venue.players && venue.players.includes(loggedInUser)
      );
    }
  
    console.log("Filtered Results:", filteredResults);
  
    setFilteredVenues(filteredResults);
  };
  return (
    <div className="headingnButton">
      <div className='ButtonLeftMargin'>
        <Button
          variant={showLiveEvents ? 'primary' : 'secondary'}
          onClick={() => toggleEvents(true)}
        >
          Live Events
        </Button>
        <Button
          variant={!showLiveEvents ? 'primary' : 'secondary'}
          onClick={() => toggleEvents(false)}
        >
          My Events
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
        <option value="Basketball">Basketball</option>
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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [activeTab, setActiveTab] = useState('login');
  const [venuesData, setVenuesData] = useState(null);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const apiCalled = useRef(false);
  const [showSignIn, setShowSignIn] = useState(true);

  // Function to handle login
  const handleLogin = (username, password) => {
    const user = new CognitoUser({ Username: username, Pool: userPool });
    const authenticationDetails = new AuthenticationDetails({ Username: username, Password: password });

    user.authenticateUser(authenticationDetails, {
      onSuccess: (session) => {
        console.log('Authentication Successful!', session);
        setIsAuthenticated(true);
        setUserType('playpal user'); // Determine and set user type based on Cognito groups or other criteria
      },
      onFailure: (err) => {
        console.error('Authentication Failed!', err);
      }
    });
  };

  // Function to switch between login and register tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Fetch data logic from your friend's code
  useEffect(() => {
    if (!apiCalled.current) {
      async function fetchData() {
        try {
          const response = await fetch('http://localhost:3500/home');
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

  const toggleForms = () => setShowSignIn(!showSignIn);

  useEffect(() => {
    setFilteredVenues(venuesData);
  },[venuesData])

  const applyFilters = () => {
    const filteredResults = venuesData.filter((venue) => {
      const passSportTypeFilter = !sportTypeFilter || venue.sportType === sportTypeFilter;
      const passPoolSizeFilter = !poolSizeFilter || venue.poolSize.toString() === poolSizeFilter;
      return passSportTypeFilter && passPoolSizeFilter;
    });
    setFilteredVenues(filteredResults);
  };
const loggedInUser = "me1";

return (
  <div className="app-background">
    <Router>
      {!isAuthenticated ? (
        <div className="form-container">
          {showSignIn ? (
            // Sign In Form
            <div className="form-card">
              <img src="/playpal_logo.png" alt="Playpal Logo" className="logo" />
              <LoginForm onLogin={handleLogin} />
              <button onClick={toggleForms}>Sign Up</button>
            </div>
          ) : (
            // Sign Up Form
            <div className="form-card">
              <img src="/playpal_logo.png" alt="Playpal Logo" className="logo" />
              <RegistrationForm />
              <button onClick={toggleForms}>Sign In</button>
            </div>
          )}
        </div>
      ) : (
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
                        <VenueList venues={filteredVenues} />
                      </Col>
                    </Row>
                  </div>
                }
              />
               <Route path="/event/:id" element={<EventDetails venues={venuesData} />} />
               <Route
              path="/host-event"
              element={<HostEvent />}
            />
            </Routes>
          </Container>
        </div>
      )}
    </Router>
  </div>
);
}
export default App;

