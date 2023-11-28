import React, { useEffect, useState } from 'react';
import { Container, Form } from "react-bootstrap";
import Select from "react-select";
import "./Play_form.css"
import Axios from 'axios'
import usePlayFormStore from '../Zustand/PlayFormStore';
import { Link, useNavigate } from 'react-router-dom';
import {CreateData} from "../../Utils/Data"
function Play_form(props) {
  const navigate = useNavigate()
  const [update,setUpdate] = useState(false)  
  const [sports,setSports] = useState();
  const [fileData,setFileData] = useState(null)
  const initialFormData = {
    name: '',
    address1: '',
    address2: '',
    owner:'',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    availableTimeSlots: '',
    sports: [],
    courts: '',
    file: '',
  };


  const [formData, setFormData] = useState(initialFormData);
  useEffect(()=>{
    if(props.dataIndex){
        setFormData(playData[props.dataIndex])
        console.log("worked")
        setUpdate(true)
    }
    if(props.dataIndex===0){
        setFormData(playData[props.dataIndex])
        console.log("worked")
        setUpdate(true)
    }
    if(playData.length ===0 ){
        setUpdate(false)
    }
    
},[props.dataIndex])
  const form = [
    { name: 'name', type: 'text', value: formData.name, required: true },
    { name: 'address1', type: 'text', value: formData.address1, required: true },
    { name: 'address2', type: 'text', value: formData.address2, required: false },
    { name: 'owner', type: 'text', value: formData.owner, required: true },
    { name: 'city', type: 'text', value: formData.city, required: true },
    { name: 'state', type: 'text', value: formData.state, required: true },
    { name: 'country', type: 'text', value: formData.country, required: true },
    { name: 'zipcode', type: 'text', value: formData.zipcode, required: true }
    

  ];

  const playTime = [
    { value: 'Monday 8:00 to 19:00', label: 'Monday 8:00 to 19:00' },
    { value: 'Tuesday 9:00 to 20:00', label: 'Tuesday 9:00 to 20:00' },
    { value: 'Wednesday 10:00 to 18:00', label: 'Wednesday 10:00 to 18:00' },
    { value: 'Thursday 05:00 to 16:00', label: 'Thursday 05:00 to 16:00' },
    { value: 'Friday 10:00 to 23:00', label: 'Friday 10:00 to 23:00' },
    { value: 'Saturday 06:00 to 20:00', label: 'Saturday 06:00 to 20:00' },
    { value: 'Sunday 10:00 to 20:00', label: 'Sunday 10:00 to 20:00' },

  ];

  const sportsList = [
    { value: "Cricket", label: "Cricket" },
    { value: "Football", label: "Football" },
    { value: "Tennis", label: "Tennis" },
    { value: "Volleyball", label: "Volleyball" },
    { value: "golf", label: "golf" },
    { value: "Squash", label: "Squash" },
    { value: "Soft ball", label: "Soft ball" },
    { value: "Pickle ball", label: "Pickle ball" },
    { value: "Baseball", label: "Baseball" },
    { value: "Badminton", label: "Badminton" },
  ];

  
  
  const {addData,playData,editData} = usePlayFormStore(); 

  const formHandler = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // const handleTimeChange = (selectedTimes) => {
  //   const timeValues = selectedTimes.map((time) => time.value);
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     availableTimeSlots: selectedTimes,
  //   }));
  // };

  const handleTimeChange = (selectedTimes) => {
    // Convert selected times to a comma-separated string
    const timeString = selectedTimes;
    console.log(selectedTimes.value)
    setFormData((prevFormData) => ({
      ...prevFormData,
      availableTimeSlots: timeString,
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

  const handleCourt = (selectedCourts) => {
    const courtValues = selectedCourts.map((court) => court.value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      courts: selectedCourts,
    }));
  };
  const fileHandler = (event) => {
    const file = event.target.files[0];
    const newFileData = new FormData();
    newFileData.append("file", file);
    setFileData(newFileData);
    setFormData((prevFormData) => ({
      ...prevFormData,
      file: file,
    }));
  };
  

  
const playFormHandler = (event) => {
  event.preventDefault();

  const data = {
    ...CreateData,
    name: formData.name,
    city: formData.city,
    owner: formData.owner,
    address1: formData.address1,
    address2: formData.address2,
    state: formData.state,
    country: formData.country,
    zipcode: formData.zipcode,
    courts: formData.courts,
    sports: sports,
    timings: formData.availableTimeSlots.value,
  };
  console.log(data)

  if (update) {
    const updatedData = { ...formData };
    const indexToUpdate = props.dataIndex;
    editData(indexToUpdate, updatedData);
    setFormData(initialFormData);
    setUpdate(false);
    props.removeindx(false);
    navigate("/");

    // write for update api 

    const apiUrl = "https://0a5b-2601-646-9801-51f0-f4c8-c16e-a4bc-6800.ngrok.io/api/updatePlayArea";

    Axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: fileData,
    })
      .then(res =>{
    addData(formData);
    setFormData(initialFormData);
    setFileData(null); 
    navigate("/");
      })
      .catch(error => console.error('AxiosError:', error));

  } else {

    // write for create api code  
    // create api is done
    const apiUrl = "https://0a5b-2601-646-9801-51f0-f4c8-c16e-a4bc-6800.ngrok.io/api/createPlayArea";

    Axios.post(apiUrl, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      params: fileData,
    })
      .then(res =>{
        console.log(res)
    addData(formData);
    setFormData(initialFormData);
    setFileData(null); 
    navigate("/");
      })
      .catch(error => console.error('AxiosError:', error));
  }
};

  return (
    <Container>
    <div className='py-2 border-bottom'>
        <div className='d-flex justify-content-end'>
          <Link to="/"><button className='btn btn-primary'>My slots</button></Link>
        </div>
      </div>
    <div className='d-flex justify-content-center'>
      
      <form onSubmit={playFormHandler}>
        <h2 className='text-center py-3'>Book your Slot</h2>
        <div className='row'>
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
              />
            </Form.Group>
          );
        })}
        </div>
       <div className='row'>
       <Form.Group className='form_size col-md-6 col-12 py-2'>
          <Form.Label>AvailableTimeSlots</Form.Label>
          <Select
            value={formData.availableTimeSlots}
            name="availableTimeSlots"
            options={playTime}
            onChange={handleTimeChange}
            isSearchable={true}
          
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
         <Form.Label>Court</Form.Label>
           <Form.Control
            type="number"  // Use type "number" for numeric input
            name="courts"
            value={formData.courts}
            onChange={formHandler}
             required
          />
         </Form.Group>

        
        <Form.Group className='form_size col-md-6 col-12 py-2' >
            <Form.Label>File</Form.Label>
            <Form.Control
            type="file"
            name="file"
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
    </Container>
  );
}

export default Play_form;
