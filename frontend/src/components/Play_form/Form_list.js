import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import "./Play_form.css";
import { Link, useNavigate } from 'react-router-dom';
import { deleteApi, getApi } from '../../Utils/api.service';

function Form_list(props) {
  const navigate = useNavigate();
  const [dataList, setDatalist] = useState([])
  // const { playData, deleteData } = usePlayFormStore();
  useEffect(()=>{
    getApi()
    .then(res=> {
      const {data} = res
      console.log(data)
      setDatalist([...data])
    })
    .catch(err=>console.log(err))
  },[])

console.log(dataList)
const deleteHandler = (id)=>{
  deleteApi(id)
  .then(res=> console.log("deleted",res))
  .catch(err=>console.log(err))
}
  return (
    <Container>
            {/* booking slots*/}
            <div className='form' style={{background:"none", backgroundColor:"white"}}>
      <div className='pb-2 border-bottom'>
        <h1 className='text-center py-2'>Level Up Your Fun</h1>
        <p className='text-center py-3'>"Game On: Snag Your Gaming Slot Now for a Thrilling Experience!"</p>
        <div className='d-flex justify-content-center'>
          <Link to="form">
            <button className='btn btn-primary'>Book your New Slot</button>
          </Link>
        </div>
      </div>

      {/* if there is data */}

      <div>
      <div className='row py-3'>
        {dataList.length >0 &&  dataList.map((data)=>{
          return (
            <div key={data?.id} className='col-lg-4 col-md-6 col-12 playCard'>
            <div className='p-3'>
              <h2 className='py-1'>{data.name}</h2>
              <h3>{data?.owner}</h3>
              <h4>Address1</h4>
              <p>{data.address1}</p>
              <h4>Address2</h4>
              <p>{data?.address2}</p>
              <div className='d-flex'>
                <p>{data?.city},</p>
                <p>{data?.country},</p>
                <p>{data?.zipcode}</p>
              </div>
              {/* <h4>AvailableTimeSlots</h4>
              <div>
                {data?.availableTimeSlots && data?.availableTimeSlots.label ? <p>{data?.availableTimeSlots.label}</p> : 'N/A'}
              </div>
              <h4>Sports</h4>
              <div>
                {data.sports && Array.isArray(data?.sports)
                  ? data.sports.map((sport, sindex) => (
                      <p key={sindex}>{sport.label}</p>
                    ))
                  : (data?.sports && data?.sports?.label ? <p>{data?.sports?.label}</p> : 'N/A')}
              </div>
              <h4>Courts</h4>
              <div>
                {data?.courts && Array.isArray(data?.courts)
                  ? data.courts.map((court, cindex) => (
                      <p key={cindex}>{court.label}</p>
                    ))
                  : (data?.courts && data?.courts ? <p>{data?.courts}</p> : 'N/A')}
              </div> */}
              <div className='d-flex'>
                <button
                  className='btn btn-primary rounded-pill px-4'
                  onClick={()=>{ navigate(`/ownerHome/form/${data?.id}`) }}
                >
                  Edit
                </button>
                <button className='btn btn-danger mx-4 rounded-pill' onClick={() => deleteHandler(data.id)}>Delete</button>
              </div>
            </div>
          </div>
          )
        })}
        </div>
      </div>
      <div>
        {dataList?.length === 0 && (
          <div className='py-5 my-4 d-flex justify-content-center'>
            <h4>No Play Areas are booked</h4>
          </div>
        )}
      </div>
      {/* <div className='row py-3'>
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
      </div> */}
      </div>
    </Container>
  );
}

export default Form_list;