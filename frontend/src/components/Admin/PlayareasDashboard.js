// PlayareasDashboard.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, Outlet } from 'react-router-dom';
import { Button, Card, Container, Row, Col, Form, Navbar, ButtonGroup } from 'react-bootstrap';
import AllPlayareas from './AllPlayareas';
import PlayareaRequests from './PlayareaRequests';
import PlayareaFilter from './PlayareaFilter';

const PlayareasDashboard = ({ applyFilters, filteredPlayareas, activeTab, setActiveTab, statusFilters,  setStatusFilters}) => {
    const displayedPlayareas = activeTab === 'allPlayareas' 
    ? filteredPlayareas.filter(p => p.status.toLowerCase() !== 'requested')
    : filteredPlayareas.filter(p => p.status.toLowerCase() === 'requested');
    console.log('filtered playareas',filteredPlayareas);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md={3}>
          <PlayareaFilter
            onFiltersChange={applyFilters}
            statusFilters={statusFilters}
            setStatusFilters={setStatusFilters}
          />
          </Col>
          <Col md={9}>

          {/* <div className="headingnButton">
            <div className='ButtonLeftMargin'>
                <Button
                    variant={activeTab === 'allPlayareas' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('allPlayareas')}>
                    All Playareas
                </Button>
                <Button
                    variant={activeTab === 'requests' ? 'primary' : 'secondary'}
                    onClick={() => setActiveTab('requests')}>
                    Requests
                </Button>
             </div>
            </div> */}



          <ButtonGroup className="mb-3" style={{gap: "10px"}}>
              <Button
                variant={activeTab === 'allPlayareas' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('allPlayareas')}>
                All Playareas
              </Button>
              <Button
                variant={activeTab === 'requests' ? 'primary' : 'secondary'}
                onClick={() => setActiveTab('requests')}>
                Requests
              </Button>
            </ButtonGroup>

            <Routes>
              <Route index element={
                <>
                  {activeTab === 'allPlayareas' && (
                    <AllPlayareas playareas={displayedPlayareas} />
                  )}
                  {activeTab === 'requests' && (
                    <PlayareaRequests playareas={displayedPlayareas.filter(p => p.status === 'Requested')} />
                  )}
                </>
              } />
             
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PlayareasDashboard;
