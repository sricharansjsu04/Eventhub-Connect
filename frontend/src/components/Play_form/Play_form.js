import React, { useEffect, useState, useContext } from 'react';
import { Container, Form, Navbar, Nav, Button } from "react-bootstrap";
import Select from "react-select";
import "./Play_form.css"
import { Link, useNavigate, useParams } from 'react-router-dom';
import {CreateData} from "../../Utils/Data"
import { createUpdateApi, getApi,getRequestsApi } from '../../Utils/api.service';
import { AuthContext } from '../../contexts/AuthContext';

function Play_form(props) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout(); // Call logout from AuthContext
    navigate('/'); // Navigate back to the login page
  };
  const [update,setUpdate] = useState(false)  
  // const [updateData,setUpdateData] = useState(false)
  const [sports,setSports] = useState('');
  // const { user } = useContext(AuthContext);
  const initialFormData = {
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    sports: [],
    courts: '',
    startTime: '', 
    endTime: '',  
  };
 
  const [files, setFiles] = useState([]);


  const [formData, setFormData] = useState(initialFormData);
  let { playId } = useParams();
  let {user}=useContext(AuthContext);

  
  // useEffect(() => {
  //   if (playId) {
  //     getApi(user)
  //       .then(res => {
  //         const { data } = res;
  //         const updateObj = data.filter((obj) => obj.id === Number(playId))[0];
  //         setFormData({ ...updateObj, owner: user }); // Set the owner to user
  //       })
  //   } else {
  //     setFormData({ ...initialFormData, owner: user }); // Initialize with user as owner
  //   }
  // }, [playId, user])



  useEffect(() => {
    if (playId) {
        getRequestsApi(user)
            .then(res => {
                if (res) {
                    const updateObj = res.filter((obj) => obj.id === Number(playId))[0];
                    if (updateObj) {
                      console.log("updateOBj",updateObj);
                        setFormData({ ...updateObj, owner: user }); // Set the owner to user
                    }
                }
            })
            .catch(err => {
                console.error('Error fetching data:', err);
            });
    } else {
        setFormData({ ...initialFormData, owner: user }); // Initialize with user as owner
    }
}, [playId, user]);

console.log("formData"+formData);





  

  const form = [
    { name: 'name', type: 'text', value: formData.name, required: true },
    { name: 'address1', type: 'text', value: formData.address1, required: true },
    { name: 'address2', type: 'text', value: formData.address2, required: false },
    { name: 'city', type: 'text', value: formData.city, required: true },
    { name: 'state', type: 'text', value: formData.state, required: true },
    { name: 'owner', type: 'text', value: user, readOnly: true },
    { name: 'country', type: 'text', value: formData.country, required: true },
    { name: 'zipcode', type: 'text', value: formData.zipcode, required: true },
    { name: 'startTime', type: 'text', value: formData.startTime, required: true },
    { name: 'endTime', type: 'text', value: formData.endTime, required: true }


    

  ];

  const sportsList = [
    { value: "Cricket", label: "Cricket" },
    { value: "Football", label: "Football" },
    { value: "Tennis", label: "Tennis" },
    { value: "Volleyball", label: "Volleyball" },
    { value: "Squash", label: "Squash" },
    { value: "Soft ball", label: "Soft ball" },
    { value: "Pickle ball", label: "Pickle ball" },
    { value: "Basketball", label: "Basketball" },
    { value: "Badminton", label: "Badminton" },
    { value: "Baseball", label: "Baseball" },
  ];


  const formHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };


  const handleTimeChange = (selectedTimes) => {
    // Convert selected times to a comma-separated string
    const timeString = selectedTimes;
    console.log(selectedTimes.value)
    setFormData((prevFormData) => ({
      ...prevFormData,
      timings: timeString.value,
    }));
  };

  const handleSport = (selectedSports) => {
    const sportValues = selectedSports.map((sport) => sport.value);
    setSports(sportValues)
    setFormData((prevFormData) => ({
      ...prevFormData,
      sports: selectedSports,
    }));
  };

  // const handleCourt = (selectedCourts) => {
  //   // const courtValues = selectedCourts.map((court) => court.value);
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     courts: selectedCourts,setSports
  //   }));
  // };
  const fileHandler = (event) => {
    event.preventDefault()

    // Validation for start and end times
    if (parseInt(formData.endTime) <= parseInt(formData.startTime)) {
      alert("End time must be after start time.");
      return; // Stop the form submission
    }

    setFiles(event.target.files[0]);
  };

  const playFormHandler = (event) => {
    
    event.preventDefault();
    console.log("****")
    const data = {
      ...formData, // use formData state
      sports: sports,
      owner: user
       // Include sports as you're managing it separately
    };
    console.log(data);
  
    const formPayload = new FormData(); // Renamed from formData to formPayload
    formPayload.append("playAreaRequest", JSON.stringify(data));
    formPayload.append('files', files);
  
    if (playId) {
      formPayload.append("playAreaId", playId);
    }

    createUpdateApi(formPayload, playId ? playId : '')
      .then(res => {
        console.log(res)
        setFormData(initialFormData);
        navigate("/ownerHome/");
      })
      .catch(error => console.error('axiosError:', error));
  };
  
  
  

  
// const playFormHandler = (event) => {
//   event.preventDefault();
//   const data = {
//     ...CreateData
//   };
//   console.log(data)
// const formData = new FormData();
// formData.append("playAreaRequest", JSON.stringify(data));
// formData.append('files', files);
// if (playId) {
//   formData.append("playAreaId", playId);
// }

//     createUpdateApi((formData), playId ? playId : '')
//       .then(res =>{
//         console.log(res)
//     setFormData(initialFormData);
//     navigate("/");
//       })
//       .catch(error => console.error('axiosError:', error));
// };



  return (
    <>
      {/* Navbar component */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/ownerHome">
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
    <Container>
      <div style={{background:"none", backgroundColor:"white", padding:"0px 20px"}}>
    <div className='py-2 border-bottom'>
        <div className='d-flex justify-content-end'>
          <Link to="./../"><button className='btn btn-primary'>View Play Areas</button></Link>
        </div>
      </div>
    <div className='d-flex justify-content-center'>
      
      <form onSubmit={playFormHandler}>

        <h2 className='text-center py-3'>Application Form</h2>
        {/* <div className='row'>
        {form.map((label, index) => {
          return (
            <Form.Group className='form_size col-md-6 col-12 py-2' key={index} >
              <Form.Label>{label.name}</Form.Label>
              <Form.Control
                type={label.type}
                name={label.name}
                value={formData[label.name]}
                onChange={formHandler}
                required={label.required}
                readOnly={label.readOnly}
              />
            </Form.Group>
          );
        })}
        </div> */}
       <div className='row'>

        <Form.Group className='form_size col-md-6 col-12 py-2' >
          <Form.Label>Playarea Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={formHandler}
            required="true"
          />
        </Form.Group>
        <Form.Group className='form_size col-md-6 col-12 py-2' >
          <Form.Label>Address Line-1</Form.Label>
          <Form.Control
            type="text"
            name="address1"
            value={formData.address1}
            onChange={formHandler}
            required="true"
          />
        </Form.Group>
        <Form.Group className='form_size col-md-6 col-12 py-2' >
          <Form.Label>Address Line-2</Form.Label>
          <Form.Control
            type="text"
            name="address2"
            value={formData.address2}
            onChange={formHandler}
          />
        </Form.Group>
        <Form.Group className='form_size col-md-6 col-12 py-2' >
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={formData.city}
            onChange={formHandler}
            required
          />
        </Form.Group>
        <Form.Group className='form_size col-md-6 col-12 py-2' >
          <Form.Label>State</Form.Label>
          <Form.Control
            type="text"
            name="state"
            value={formData.state}
            onChange={formHandler}
            required
          />
        </Form.Group>
        <Form.Group className='form_size col-md-6 col-12 py-2' >
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            name="country"
            value={formData.country}
            onChange={formHandler}
            required
          />
        </Form.Group>
        <Form.Group className='form_size col-md-6 col-12 py-2' >
          <Form.Label>Zipcode</Form.Label>
          <Form.Control
            type="text"
            name="zipcode"
            value={formData.zipcode}
            onChange={formHandler}
            required
          />
        </Form.Group>
        <Form.Group className='form_size col-md-6 col-12 py-2'>
          <Form.Label>Start Time (Hour - 24H)</Form.Label>
          <Form.Control
            type="number"
            name="startTime"
            min="0"
            max="23"
            value={formData.startTime}
            onChange={formHandler}
            required
          />
        </Form.Group>

        <Form.Group className='form_size col-md-6 col-12 py-2'>
          <Form.Label>End Time (Hour - 24H)</Form.Label>
          <Form.Control
            type="number"
            name="endTime"
            min="0"
            max="23"
            value={formData.endTime}
            onChange={formHandler}
            required
          />
        </Form.Group>

        <Form.Group className='form_size col-md-6 col-12 py-2'>
          <Form.Label>Sports</Form.Label>
          <Select
            value={formData.sports}
            name="sports"
            options={sportsList}
            onChange={(e) => handleSport(e)}
            isSearchable={true}
            isMulti={true}
            required
          />
        </Form.Group>
        <Form.Group className='form_size col-md-6 col-12 py-2'>
         <Form.Label>No. of courts</Form.Label>
           <Form.Control
            type="number"  // Use type "number" for numeric input
            name="courts"
            value={formData.courts}
            onChange={formHandler}
             required
          />
         </Form.Group>

        
        <Form.Group className='form_size col-md-6 col-12 py-2' >
            <Form.Label>Playarea Photos</Form.Label>
            <Form.Control
            type="file"
            name="file"
            multiple="multiple"
            value={formData.value}
            onChange={fileHandler}
          />
          </Form.Group>
       </div>
          {update && <button type="submit"  className='btn btn-primary my-4 py-2 mx-2'>Update</button> }
          {update && <button type="submit" onClick={()=>setUpdate(false)} className='btn btn-primary my-4 py-2'>cancel</button> }
           {!update && <button type="submit" className='btn btn-primary my-4 py-2'>Submit</button>}
      </form>
    </div>
    </div>
    </Container>
    </>
  );
}

export default Play_form;