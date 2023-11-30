// PlayareaFilter.js
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const PlayareaFilter = ({ onFiltersChange, statusFilters = {}, setStatusFilters }) => {
  const [sportType, setSportType] = useState('');
  const [city, setCity] = useState('');
  const [playareaName, setPlayareaName] = useState('');

  const handleSportTypeChange = (e) => setSportType(e.target.value);
  const handleCityChange = (e) => setCity(e.target.value);
  const handlePlayareaNameChange = (e) => setPlayareaName(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFiltersChange({ sportType, city, playareaName });
  };

  const handleStatusChange = (status) => {
    setStatusFilters(prevFilters => ({
      ...prevFilters,
      [status]: !prevFilters[status],
    }));
  };

  return (
    <Form className="sticky-top bg-light p-3" onSubmit={handleSubmit}>
      <h5>Playarea Filters</h5>
      {/* <Form.Group controlId="sportTypeFilter">
        <Form.Label>Sport Type</Form.Label>
        <Form.Control as="select" value={sportType} onChange={handleSportTypeChange}>
          <option value="">All</option>
          <option value="Football">Football</option>
          <option value="Basketball">Basketball</option>
        </Form.Control>
      </Form.Group> */}
      <Form.Group controlId="playareaNameFilter">
        <Form.Label>Playarea Name</Form.Label>
        <Form.Control
          type="text"
          value={playareaName}
          placeholder="Enter playarea name"
          onChange={handlePlayareaNameChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Status</Form.Label>
        <div className="mb-3">
          {['Accepted', 'Rejected', 'Banned'].map((status) => (
            <Form.Check 
              key={status}
              type="checkbox"
              id={`status-${status}`}
              label={status}
              checked={statusFilters[status]}
              onChange={() => handleStatusChange(status)}
            />
          ))}
        </div>
      </Form.Group>
      <Form.Group controlId="cityFilter">
        <Form.Label>City</Form.Label>
        <Form.Control
          type="text"
          value={city}
          placeholder="Enter city"
          onChange={handleCityChange}
        />
      </Form.Group>
      
      <Button variant="primary" type="submit" className="mt-3 w-100">
        Apply Filters
       </Button>

    </Form>
  );
};

export default PlayareaFilter;
