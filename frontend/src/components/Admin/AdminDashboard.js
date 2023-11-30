// AdminDashboard.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Card, Container, Row, Col, Form, Navbar, ButtonGroup, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Outlet } from 'react-router-dom';
import '../../App.css';
import { AuthContext } from '../../contexts/AuthContext';
import apiConfig from '../../config/apiConfig';

// Admin-specific components
import AllPlayareas from "./AllPlayareas";
import PlayareaRequests from "./PlayareaRequests";
import PlayareaDetails from "./PlayareaDetails";
import PlayareaFilter from "./PlayareaFilter";
import PlayareasDashboard from "./PlayareasDashboard";

function AdminDashboard() {
  console.log('AdminDashboard rendering...');
   const [playareasData, setPlayareasData] = useState([]);
   const [filteredPlayareas, setFilteredPlayareas] = useState(playareasData);

   useEffect(() => {
    fetch(apiConfig.getPlayAreas)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setPlayareasData(data);
        setFilteredPlayareas(data);
      })
      .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
      });
  }, []);
  

  // useEffect(() => {
  //   console.log("AdminDashboard is mounted");
   
  //   fetch(apiConfig.getPlayAreas)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error('Network response was not ok');
  //       }
  //       console.log('response fetched', response);
  //       return response.json();
  //     })
  //     .then(data => setPlayareasData(data))
  //     .catch(error => {
  //       console.error('There has been a problem with your fetch operation:', error);
  //     });
  // }, []);

  // useEffect(() => {
  //   setFilteredPlayareas(playareasData);
  // }, [playareasData]);

  // const playareasData = [
  //   {
  //     "id": 5,
  //     "name": "john_doe",
  //     "owner": 2,
  //     "address1": "sdghb",
  //     "address2": "dcbhn",
  //     "city": "gurgaon",
  //     "state": "Delhi",
  //     "country": "india",
  //     "zipcode": null,
  //     "status": "Rejected",
  //     "comments": null,
  //     "docUrls": [
  //       "https://picsum.photos/id/96/200/300",
  //       "https://picsum.photos/id/94/2133/1200"]
  //   },
  //   {
  //     "id": 7,
  //     "name": "john_doe",
  //     "owner": 2,
  //     "address1": "sdc",
  //     "address2": "dcbhn",
  //     "city": "gurgaon",
  //     "state": "Delhi",
  //     "country": "india",
  //     "zipcode": null,
  //     "status": "Requested",
  //     "comments": null,
  //     "docUrls": [
  //       "https://picsum.photos/id/96/200/300",
  //       "https://picsum.photos/id/94/2133/1200"]
  //   },
  //   {
  //     "id": 8,
  //     "name": "john_doe",
  //     "owner": 2,
  //     "address1": "sdc",
  //     "address2": "dcbhn",
  //     "city": "gurgaon",
  //     "state": "Delhi",
  //     "country": "india",
  //     "zipcode": null,
  //     "status": "Requested",
  //     "comments": null,
  //     "docUrls": [
  //       "https://picsum.photos/id/96/200/300",
  //       "https://picsum.photos/id/94/2133/1200"]
  //   },
  //   {
  //     "id": 9,
  //     "name": "p2",
  //     "owner": 3,
  //     "address1": "Address 1",
  //     "address2": "Address 2",
  //     "city": "san jose",
  //     "state": "CA",
  //     "country": "USA",
  //     "zipcode": "12345",
  //     "status": "Requested",
  //     "comments": null,
  //     "docUrls": [
  //       "https://picsum.photos/id/96/200/300",
  //       "https://picsum.photos/id/94/2133/1200"]
  //   },
  //   {
  //     "id": 10,
  //     "name": "john_doe",
  //     "owner": 2,
  //     "address1": "sdc",
  //     "address2": "dcbhn",
  //     "city": "gurgaon",
  //     "state": "Delhi",
  //     "country": "india",
  //     "zipcode": null,
  //     "status": "Requested",
  //     "comments": null,
  //     "docUrls": [
  //       "https://picsum.photos/id/96/200/300",
  //       "https://picsum.photos/id/94/2133/1200"]
      
  //   }
  //   ];
    
    
 
  const [playareas, setPlayareas] = useState(playareasData);
  const [activeTab, setActiveTab] = useState('allPlayareas');

  const { user } = useContext(AuthContext);

  const [statusFilters, setStatusFilters] = useState({
    Accepted: false,
    Rejected: false,
    Banned: false,
  });

  const { logout } = useContext(AuthContext);
  

  // Function to apply filters based on sport type, city, and playarea name
  // const applyFilters = (filters) => {
  //   const filteredResults = playareas.filter((playarea) => {
  //     console.log('playarea list', playarea);
  //     console.log(filters);
  //     const filterBySportType = filters.sportType ? playarea.sportType === filters.sportType : true;
  //     const filterByCity = filters.city ? playarea.city.toLowerCase().includes(filters.city.toLowerCase()) : true;
  //     const filterByPlayareaName = filters.playareaName ? playarea.name.toLowerCase().includes(filters.playareaName.toLowerCase()) : true;
  //     const matchStatus = Object.entries(statusFilters).some(([status, checked]) => 
  //       checked && playarea.status.toLowerCase() === status.toLowerCase()
  //     );
  
  //     // Exclude playareas with 'Requested' status for 'All Playareas' tab
  //     console.log(playarea.name, playarea.status);
  //     const isNotRequested = activeTab !== 'requests' ? playarea.status.toLowerCase() !== 'requested' : true;
  
  //     return filterBySportType && filterByCity && filterByPlayareaName && (matchStatus || Object.values(statusFilters).every(val => !val)) && isNotRequested;
  //   });
  //   setFilteredPlayareas(filteredResults);
  // };

  const applyFilters = (filters) => {
    const filteredResults = playareasData.filter(playarea => {
      const filterBySportType = filters.sportType ? playarea.sportType === filters.sportType : true;
      const filterByCity = filters.city ? playarea.city.toLowerCase().includes(filters.city.toLowerCase()) : true;
      const filterByPlayareaName = filters.playareaName ? playarea.name.toLowerCase().includes(filters.playareaName.toLowerCase()) : true;
      const matchStatus = Object.entries(statusFilters).some(([status, checked]) => 
        checked && playarea.status.toLowerCase() === status.toLowerCase()
      );
  
      const isNotRequested = activeTab !== 'requests' ? playarea.status.toLowerCase() !== 'requested' : true;
  
      return filterBySportType && filterByCity && filterByPlayareaName && (matchStatus || Object.values(statusFilters).every(val => !val)) && isNotRequested;
    });
    setFilteredPlayareas(filteredResults);
  };
  

  // Function to handle tab changes
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleFiltersChange = (filters) => {
    // Logic to filter playareas based on the filters object
    // This will need to be replaced with actual API call logic later
    const filteredResults = playareasData.filter(playarea => {
      return (!filters.sportType || playarea.sportType === filters.sportType) &&
             (!filters.city || playarea.city.toLowerCase().includes(filters.city.toLowerCase())) &&
             (!filters.playareaName || playarea.name.toLowerCase().includes(filters.playareaName.toLowerCase()));
    });
    setFilteredPlayareas(filteredResults);
  };

  const handlePlayareaDelete = (playareaId) => {
    // Simulated delete function
    const updatedPlayareas = playareas.map(playarea =>
      playarea.id === playareaId ? { ...playarea, status: 'Banned' } : playarea
    );
    setPlayareas(updatedPlayareas);
    setFilteredPlayareas(updatedPlayareas);
  };

  const handleAcceptRequest = (playareaId) => {
    // Simulated accept function
    const updatedPlayareas = playareas.map(playarea =>
      playarea.id === playareaId ? { ...playarea, status: 'Accepted' } : playarea
    );
    setPlayareas(updatedPlayareas);
    setFilteredPlayareas(updatedPlayareas);
  };

  const handleRejectRequest = (playareaId) => {
    // Simulated reject function
    const updatedPlayareas = playareas.map(playarea =>
      playarea.id === playareaId ? { ...playarea, status: 'Rejected' } : playarea
    );
    setPlayareas(updatedPlayareas);
    setFilteredPlayareas(updatedPlayareas);
  };

  const navigate = useNavigate();

  const handlePlayareaClick = (playareaId) => {
    navigate(`details/${playareaId}`); // Use a relative path here
  };

  // Handle logout action
  const handleLogout = () => {
    logout(); // Call logout from AuthContext
    navigate('/'); // Navigate back to the login page
  };

  return (
    <>
<Navbar bg="dark" variant="dark" expand="lg">
  <Container fluid>
    <Navbar.Brand as={Link} to="/admin">
      PlayPal
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="navbar-dark-example" />
    <Navbar.Collapse id="navbar-dark-example">
      <Nav className="ms-auto">
        <Navbar.Text className="me-3">
          Logged in as: {user}
        </Navbar.Text>
        <Button variant="outline-danger" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>



      <Routes>
      <Route index element={
        <PlayareasDashboard
          applyFilters={applyFilters}
          filteredPlayareas={filteredPlayareas}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          statusFilters={statusFilters}
          setStatusFilters={setStatusFilters}
        />
      } />
      <Route path="details/:id" element={<PlayareaDetails playareas={filteredPlayareas} />} />
    </Routes>
    </>
  );


}

export default AdminDashboard;
