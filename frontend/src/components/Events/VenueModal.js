import React, { useState, useEffect } from 'react';
import { Button, Modal, Carousel, Row, Col, Dropdown, Form  } from 'react-bootstrap';
import Spinner from './spinner';
import { useNavigate } from 'react-router-dom';
import * as urls from './config';

const VenueModal = ({ showModal, formData, selectedVenue, closeModal, loggedInUser}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedPoolSize, setSelectedPoolSize] = useState('');
  const [poolSizeError, setPoolSizeError] = useState('');
  const [eventName, setEventName] = useState(''); 

  const [selectedCourt, setSelectedCourt] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [eventId, seteventId] = useState('');

  // console.log(selectedVenue)
  useEffect(() => {
    const bookVenue = () => {
      if (selectedVenue != null && selectedCourt !== '') {
        setLoading(true);
        console.log(selectedVenue,selectedCourt)
        var api = 'https://pbh79m29ck.execute-api.us-east-2.amazonaws.com/Dev/api/getSlotsByPlayAreaAndCourt?playAreaId='+selectedVenue.id+'&courtId='+selectedCourt+'&inputDate='+formData.date+'';
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


  const handleSlotChange = (value) => {
    setSelectedSlot((prevSelectedSlot) => {
      if (prevSelectedSlot.includes(value)) {
        return prevSelectedSlot.filter((slot) => slot !== value);
      } else {
        return [...prevSelectedSlot, value];
      }
    });
  };

  const handleEventNameChange = (event) => {
    setEventName(event.target.value);
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
        eventName: eventName, 
        username: loggedInUser,
        court: selectedCourt
      };
      console.log(requestData);

      fetch(urls.createEvent, {
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

        if (data.message && data.message.toLowerCase().includes('created')) {
          setSuccessMessage('Event has been created, and venue is booked! ');
          seteventId(data.event_id);
          setErrorMessage('');
        } else {
          setErrorMessage(data.message || 'An error occurred. Please try again.');
          setSuccessMessage('');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage('An error occurred. Please try again.');
        setSuccessMessage('');
      });
  };
  const handleAClick = () =>{
    navigate(`/playerHome/myHostedEvent/${eventId}`);
  }
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
      {successMessage && (
        <div>
          <p style={{ fontWeight: 'bold', color: 'green' }}>{successMessage}</p>
        </div>
      )}
        {errorMessage && <p style={{ fontWeight: 'bold', color: 'red' }}>{errorMessage}</p>}
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
                <Form.Group controlId="selectCourt">
                  <Form.Label>Select a court:</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedCourt}
                    onChange={(e) => setSelectedCourt(e.target.value)}
                  >
                    <option value="">Select a court</option>
                    {selectedVenue.courts.map((court, index) => (
                      <option key={index} value={court.id}>
                        {court.name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                {selectedCourt && (
                  <div>
                    <Form.Group controlId="selectSlots">
                      <Form.Label>Select slots:</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="slotDropdown">
                          Select slots
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {slots.map((slot, index) => (
                            <div className="form-check" key={index}>
                              <Form.Check
                                type="checkbox"
                                label={`${slot.startTime} - ${slot.endTime}`}
                                checked={selectedSlot.includes(slot.startTime)}
                                onChange={() => handleSlotChange(slot.startTime)}
                              />
                            </div>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                    <br/>
                <label>Enter Pool Size:</label>
                <input
                  type="number"
                  value={selectedPoolSize}
                  onChange={handlePoolSizeChange}
                  placeholder={`Pool Size`}
                />
                <br/>
                <label>Enter Event Name:</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={handleEventNameChange}
                  placeholder={`Event Name`}
                />            

                  </div>
                )}
              </div>
            ) : (
              <p>No courts available</p>
            )}
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
