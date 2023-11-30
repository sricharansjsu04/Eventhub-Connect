import React, { useState, useEffect, useRef, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Row, Col, Form, Navbar } from 'react-bootstrap';
import './App.css';
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import LoginForm from './components/Auth/LoginForm';
import RegistrationForm from './components/Auth/RegistrationForm';
import EmailVerificationForm from './components/Auth/EmailVerificationForm';
import PlayerHome from './components/Events/PlayerHome';
import PlayOwner from './components/Play_area';
import AdminDashboard from './components/Admin/AdminDashboard';
import { AuthProvider } from './contexts/AuthContext';
import { AuthContext } from './contexts/AuthContext';
import PlayareaDetails from './components/Admin/PlayareaDetails';
import ProtectedRoute from './components/Auth/ProtectedRoute'
import apiConfig from './config/apiConfig';
import userPool from './config/cognitoConfig';
import { Amplify } from '@aws-amplify/core';


function AppWrapper() {
  return (
    <AuthProvider>
    <Router>
      <App />
    </Router>
    </AuthProvider>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [activeTab, setActiveTab] = useState('login');
  const [venuesData, setVenuesData] = useState(null);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const apiCalled = useRef(false);
  const [showSignIn, setShowSignIn] = useState(true);
  const [isVerificationRequired, setIsVerificationRequired] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: ''
  });
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false);
  const toggleForms = () => setShowSignIn(!showSignIn);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const { login } = useContext(AuthContext);



  // Call this function upon successful registration
  const handleRegistrationComplete = (username) => {
    setIsVerificationRequired(true);
    setCurrentUser(username);
  };


  // Call this function after the user has successfully verified their email
  const handleVerificationComplete = async () => {
    setIsVerificationRequired(true);
    setShowVerificationSuccess(true);

    try {
      const response = await fetch(apiConfig.registerUser, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
  
      const data = await response.json();
      console.log('User created in database:', data);
      // Handle success - maybe navigate to the home page or show a success message


      // Fetch sports data here and store it in state

    } catch (error) {
      console.error('Error:', error);
      // Handle error - show error message to user
    }
  };

  const navigate = useNavigate();
  const onUserSignIn = (username, roleType) => {
    // Assume roleType comes from the sign-in response
    //setIsAuthenticated(true);
    console.log('in onUserSignIn method with roleType: ',roleType);
    login(username, roleType);
  
    if (roleType === 'player') {
      console.log('player login navigating');
      navigate('/playerHome');
    } else if (roleType === 'owner') {
      navigate('/ownerHome'); // You need to define the route for this as well
    }
    else if(roleType === 'admin'){
      console.log('navigating to admin');
      navigate('/admin');
    }
  };
  

  const LoginComp = () => {
    return(
      <div>
              {!isVerificationRequired && (
        <div className="form-container">
          {showSignIn ? (
            <div className="form-card">
              <img src="/playpal_logo.png" alt="Playpal Logo" className="logo" />
              <LoginForm onLogin={onUserSignIn} />
              <button onClick={() => setShowSignIn(false)}>Sign Up</button>
            </div>
          ) : (
            <div className="form-card">
              <img src="/playpal_logo.png" alt="Playpal Logo" className="logo" />
              <RegistrationForm onRegistrationComplete={handleRegistrationComplete} setUserData={setUserData}/>
              <button onClick={() => setShowSignIn(true)}>Sign In</button>
            </div>
          )}
        </div>
      )}
      {isVerificationRequired && !showVerificationSuccess && (
        <EmailVerificationForm 
          username={currentUser} 
          userPool={userPool} 
          onVerified={handleVerificationComplete} 
        />
      )}
      {showVerificationSuccess && (
        <div className="form-container">
          <div className="form-card">
            <img src="/playpal_logo.png" alt="Playpal Logo" className="logo" />
            <p className="confirmation-message">We have confirmed your email.<br />
            {welcomeMessage}</p>
            <button onClick={() => {
                setShowVerificationSuccess(false);
                setShowSignIn(true);
                setIsVerificationRequired(false);
              }}>Sign In
            </button>
          </div>
        </div>
      )}
 
      </div>
    )
  }

const welcomeMessage = userData.role === 'player' ? 'Happy Playing!' : 'Happy Hosting!';
return (
  <>
  <div className="background-blur"></div>
    <div className="app-background">
     <Routes>
      <Route path="/" element={<LoginComp/>}/>
      <Route path="/playerHome/*" element={
        <ProtectedRoute requiredRole="player">
          <PlayerHome/>
        </ProtectedRoute>
      }/>
      <Route path="/admin/*" element={
       <ProtectedRoute requiredRole="admin"> 
          <AdminDashboard />
        </ProtectedRoute>
      }/>
      <Route path="/ownerHome/*" element={
        <ProtectedRoute requiredRole="owner">
          <PlayOwner/>
          {/* <Route path="/createPlayArea" element={<PlayOwner/>}/> */}
        </ProtectedRoute>
      }/>
    </Routes>
    </div>
  </>
    
);       
}
export default AppWrapper;