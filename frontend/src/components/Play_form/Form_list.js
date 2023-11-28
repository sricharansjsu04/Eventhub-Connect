import React from 'react';
import { Container } from 'react-bootstrap';
import usePlayFormStore from '../Zustand/PlayFormStore';
import "./Play_form.css";
import { Link, useNavigate } from 'react-router-dom';

function Form_list(props) {
  const navigate = useNavigate();
  const { playData, deleteData } = usePlayFormStore();

  return (
    <Container>
      <div className='pb-2 border-bottom'>
        <h1 className='text-center py-2'>Level Up Your Fun</h1>
        <p className='text-center py-3'>"Game On: Snag Your Gaming Slot Now for a Thrilling Experience!"</p>
        <div className='d-flex justify-content-center'>
          <Link to="form">
            <button className='btn btn-primary'>Book your New Slot</button>
          </Link>
        </div>
      </div>
      <div>
        {playData.length === 0 && (
          <div className='py-5 my-4 d-flex justify-content-center'>
            <h4>No slots are Booked</h4>
          </div>
        )}
      </div>
      <div className='row py-3'>
        {playData.map((data, index) => (
          <div key={index} className='col-lg-4 col-md-6 col-12 playCard'>
            <div className='p-3'>
              <h2 className='py-1'>{data.name}</h2>
              <h4>Address</h4>
              <p>{data.address1}</p>
              <div className='d-flex'>
                <p>{data.city},</p>
                <p>{data.country},</p>
                <p>{data.zipcode}</p>
              </div>
              <h4>AvailableTimeSlots</h4>
              <div>
                {data.availableTimeSlots && data.availableTimeSlots.label ? <p>{data.availableTimeSlots.label}</p> : 'N/A'}
              </div>
              <h4>Sports</h4>
              <div>
                {data.sports && Array.isArray(data.sports)
                  ? data.sports.map((sport, sindex) => (
                      <p key={sindex}>{sport.label}</p>
                    ))
                  : (data.sports && data.sports.label ? <p>{data.sports.label}</p> : 'N/A')}
              </div>
              <h4>Courts</h4>
              <div>
                {data.courts && Array.isArray(data.courts)
                  ? data.courts.map((court, cindex) => (
                      <p key={cindex}>{court.label}</p>
                    ))
                  : (data.courts && data.courts ? <p>{data.courts}</p> : 'N/A')}
              </div>
              <div className='d-flex'>
                <button
                  className='btn btn-primary rounded-pill px-4'
                  onClick={()=>{
                    props.editHand(index);
                    navigate("/form")
                  }}
                >
                  Edit
                </button>
                <button className='btn btn-danger mx-4 rounded-pill' onClick={() => deleteData(index)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default Form_list;
