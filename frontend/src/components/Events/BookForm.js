import React, { useEffect, useState } from 'react';
import * as urls from './config';

const BookForm = ({ slotsData, formData, selectedVenue }) => {
  const [slots, setSlots] = useState(slotsData);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedPoolSize, setSelectedPoolSize] = useState('');
  const [poolSizeError, setPoolSizeError] = useState('');

  console.log(slotsData, formData, selectedVenue);

  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
  };

  const handlePoolSizeChange = (event) => {
    const newPoolSize = event.target.value;
    setSelectedPoolSize(newPoolSize);

    // Validate if selected pool size is less than or equal to formData pool size
    if (newPoolSize > selectedVenue.poolSize) {
      setPoolSizeError(`Max Pool Size is ${selectedVenue.poolSize}`);
    } else {
      setPoolSizeError('');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate if selected pool size is less than or equal to formData pool size
    if (parseInt(selectedPoolSize) <= parseInt(selectedVenue.poolSize)) {
      // Prepare data for the POST request
      const requestData = {
        formData,
        selectedVenue,
        selectedSlot,
        selectedPoolSize: parseInt(selectedPoolSize),
      };

      // Send POST request to the backend
      fetch(urls.HOST_EVENT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from the server
          console.log('Server Response:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      // Handle validation error (e.g., show an alert)
      alert('Selected Pool Size cannot be greater than the available Pool Size.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Select a slot:</label>
        <select value={selectedSlot} onChange={handleSlotChange}>
          <option value="">Select a slot</option>
          {slots.map((slot, index) => (
            <option key={index} value={slot.startTime} disabled={!slot.vacant}>
              {slot.label}
            </option>
          ))}
        </select>
        <p></p>
        <label>Enter Pool Size:</label>
        <input
          type="number"
          value={selectedPoolSize}
          onChange={handlePoolSizeChange}
          placeholder={`Maximum ${selectedVenue.poolSize}`}
        />

        {poolSizeError && <div className="error-message" style={{color:"red"}}>{poolSizeError}</div>}


      </form>
    </div>
  );
};

export default BookForm;
