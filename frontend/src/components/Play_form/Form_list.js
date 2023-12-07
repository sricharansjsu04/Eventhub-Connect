import React, { useEffect, useState, useContext } from 'react';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import "./Play_form.css";
import { Link, useNavigate } from 'react-router-dom';
import { deleteApi, getApi ,getRequestsApi} from '../../Utils/api.service';
import { AuthContext } from '../../contexts/AuthContext';

function Form_list(props) {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout(); // Call logout from AuthContext
    navigate('/'); // Navigate back to the login page
  };
  let { user } = useContext(AuthContext);

  const [dataList, setDatalist] = useState([]);

  // useEffect(() => {
  //   console.log(user)
  //   getApi(user)
  //     .then(res => {
  //       const { data } = res;
  //       console.log(data);
  //       setDatalist([...data]);
  //     })
  //     .catch(err => console.log(err));
  // }, []);


useEffect(() => {
  console.log("User for API call:", user);

  getRequestsApi(user)
    .then(response => {
      console.log("Response from getApi:", response);

      // Directly using the response as it's already the data array
      setDatalist(response);

      console.log("Updated dataList state:", response);
    })
    .catch(err => {
      console.log("Error in getApi call:", err);
    });
}, []);



  // console.log("dataList"+dataList);
  const deleteHandler = (id) => {
    deleteApi(id)
      .then(res => console.log("deleted", res))
      .catch(err => console.log(err));
  };
  console.log(dataList)

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
        <div className='form' style={{ background: "none", backgroundColor: "white" }}>
          <div className='pb-2 border-bottom'>
            <h1 className='text-center py-2'>Welcome</h1>
            <p className='text-center py-3'>"Ready to host? Go ahead and apply"</p>
            <div className='d-flex justify-content-center'>
              <Link to="form">
                <button className='btn btn-primary' style={{ width: "70px" }}>Apply</button>
              </Link>
            </div>
          </div>

          {/* Conditional rendering based on dataList length */}

          {dataList.length > 0 ? (
            <div>
              <div className="py-3">
                <h2 className="text-center">Your Registered Play Areas</h2>
              </div>
              <div className='row py-3'>
                {dataList.map((data) => (
                  <div key={data?.id} className='col-lg-4 col-md-6 col-12 playCard' style={{marginLeft:"15px"}}>
                    <div className='p-3'>
                      <h2 className='py-1'>{data.name}</h2>
                      {/* <h3>{data?.owner}</h3> */}
                      <h4>Address</h4>
                      <p>{data.address1}</p>
                      {/* <>Address2</h4> */}
                      <p>{data?.address2}</p>
                      <div className='d-flex'>
                        <p>{data?.city},</p>
                        <p>{data?.country},</p>
                        <p>{data?.zipcode}</p>
                      </div>
                      <div className='d-flex'>
                        <button
                          className='btn btn-primary rounded-pill px-4'
                          onClick={() => { navigate(`/ownerHome/form/${data?.id}`) }}
                        >
                          Edit
                        </button>
                        <button className='btn btn-danger mx-4 rounded-pill' onClick={() => deleteHandler(data.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='py-5 my-4 d-flex justify-content-center'>
              <h4>No play areas are registered yet</h4>
            </div>
          )}
        </div>
      </Container>
    </>
  );
}



export default Form_list;
