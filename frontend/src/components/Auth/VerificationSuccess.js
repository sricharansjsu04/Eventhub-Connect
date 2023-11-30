import React, { useState, useEffect } from 'react';
import './VerificationSuccess.css';


function VerificationSuccess({ selectedSports, setSelectedSports, onDone }) {
  const [sports, setSports] = useState([]);

  useEffect(() => {
    // Fetch sports data from backend
    // Replace URL with your actual API endpoint
    fetch('http://localhost:3001/api/sports')
      .then(response => response.json())
      .then(data => setSports(data))
      .catch(error => console.error('Error fetching sports:', error));
  }, []);

  const toggleSportSelection = (sportId) => {
    setSelectedSports(prevSelectedSports =>
      prevSelectedSports.includes(sportId)
        ? prevSelectedSports.filter(id => id !== sportId)
        : [...prevSelectedSports, sportId]
    );
  };

  return (
    <div className="verification-container">
      <div className="verification-card">
        <div className="verification-tick">
          <div className="tick-container">
            <div className="tick-animation">✓</div>
          </div>
        </div>
        <h2>Verification Successful!</h2>
        <p>Select your sports interests (optional):</p>
        <div className="sports-tags">
          {sports.map(sport => (
            <div 
              key={sport.id} 
              className={`sport-tag ${selectedSports.includes(sport.id) ? 'selected' : ''}`}
              onClick={() => toggleSportSelection(sport.id)}
            >
              {sport.name}
            </div>
          ))}
        </div>
        <button className="done-button" onClick={onDone}>Done</button>
      </div>
    </div>
  );
}

export default VerificationSuccess;
