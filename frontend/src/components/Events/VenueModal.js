import React, { useState, useEffect } from 'react';
import { Button, Modal, Carousel, Row, Col } from 'react-bootstrap';
import Spinner from './spinner';

const VenueModal = ({ showModal, formData, selectedVenue, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedPoolSize, setSelectedPoolSize] = useState('');
  const [poolSizeError, setPoolSizeError] = useState('');

  const [selectedCourt, setSelectedCourt] = useState('');

  // console.log(selectedVenue)
  useEffect(() => {
    const bookVenue = () => {
      if (selectedVenue != null && selectedCourt !== '') {
        setLoading(true);
        console.log(selectedVenue,selectedCourt)
        var api = 'https://pbh79m29ck.execute-api.us-east-2.amazonaws.com/Test/api/getSlotsByPlayAreaAndCourt?playAreaId='+selectedVenue.id+'&courtId='+selectedCourt+'&inputDate='+formData.date+'';
        console.log(api);
        fetch(api)
          .then((response) => response.json())
          .then((data) => {
            setResponse(data);
            setSlots(data); // Assuming data contains slots
            setLoading(false);
          })
          .catch((error) => {
            console.error('Error:', error);
            setLoading(false);
          });
      }
    };

    bookVenue();
  }, [selectedVenue, selectedCourt]);

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

  const handleBookVenue = () => {

      // Prepare data for the POST request
      const requestData = {
        formData,
        selectedVenue,
        selectedSlot,
        selectedPoolSize: parseInt(selectedPoolSize),
      };
      console.log(requestData);
      // Send POST request to the backend
      fetch('http://localhost:3500/hostEvent', {
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
   
  };

  const modalStyle = {
    maxWidth: '100%',
    width: '80%',
    marginLeft: '10%',
    minHeight: '50vh', // Adjust this value based on your needs
    maxHeight: '100vh', // Increase maxHeight to fit content
    overflowY: 'hidden', // Add scroll if content exceeds the max height
  };

  const carouselStyle = {
    width: '100%',
    height: '100%', // Adjust this value as needed
    margin: 'auto',
  };

  const imageStyle = {
    maxHeight: '60%', // Adjust this value as needed
    width: '100%', // Set width to '100%' to ensure responsiveness
    objectFit: 'cover', // Maintain aspect ratio and cover the container
    margin: 'auto', // Center the image horizontally
    display: 'block', // Ensure the image is treated as a block element
  };

  return (
    <Modal show={showModal} onHide={closeModal} size="lg" style={modalStyle}>
      <Modal.Header closeButton>
        <Modal.Title>Venue Slot Booking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Row>
            <Col xs={6}>
            {selectedVenue && selectedVenue.photoUrl && selectedVenue.photoUrl.length > 0 && (
            <div style={{ width: '380px', height: '400px', overflow: 'hidden', borderRadius: '10px' }}>
              <Carousel style={carouselStyle} className="test">
                {selectedVenue.photoUrl.map((photo, index) => (
                  <Carousel.Item key={index}>
                    <img src={photo} alt={`Venue ${index + 1}`} style={imageStyle} className="d-block w-100" />
                  </Carousel.Item>
                ))}
              </Carousel>
              </div>
              )}
            </Col>
            <Col xs={6}>
            {selectedVenue && selectedVenue.courts ? (
              <div>

              {console.log("This is the selected venue",selectedVenue)}
              <label>Select a court:</label>
                <select value={selectedCourt}  onChange={(e) => setSelectedCourt(e.target.value)}>
                  <option value="">Select a court</option>
                  {selectedVenue.courts.map((court, index) => (
                    <option key={index} value={court}>
                      {court}
                    </option>
                  ))}
                </select>
                <br />
                {selectedCourt && (
                  <div>
                <label>Select a slot:</label>
                <select value={selectedSlot} onChange={handleSlotChange}>
                  <option value="">Select a slot</option>
                  {slots.map((slot, index) => (
                    <option key={index} value={slot.startTime}>
                      {slot.startTime} - {slot.endTime}
                    </option>
                  ))}
                </select>
                
              
                <br/>
                <label>Enter Pool Size:</label>
                <input
                  type="number"
                  value={selectedPoolSize}
                  onChange={handlePoolSizeChange}
                  placeholder={`Maximum ${selectedVenue.poolSize}`}
                />
                </div>
                )}
               

              </div>):<p>No courts available</p>}
            </Col>
          </Row>
        
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleBookVenue}>
                  Book Venue
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VenueModal;
