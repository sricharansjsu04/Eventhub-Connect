import React, { useState } from 'react'
import Play_form from './Play_form/Play_form'
import Form_list from './Play_form/Form_list'
import './Play_form/Play_form.css'; // Add this line to import your CSS

import usePlayFormStore from './Zustand/PlayFormStore'
import { BrowserRouter, Route,  Routes } from 'react-router-dom'

function PlayerArea() {
  // const {playData} =usePlayFormStore()
  // const [editindex, setEditIndex] = useState(null)
  // const editHandler =(index)=>{
  //   console.log(index,playData[index])
  //   setEditIndex(index)
  // }
  // const removeIndex = (data)=>{
  //   setEditIndex(data)
  // }
  return (
    // <BrowserRouter>
    <Routes>
      <Route path="/" element={<Form_list />} />
      <Route path="form"  element={<Play_form  />} />
      <Route path="form/:playId"  element={<Play_form  />} />

    </Routes>
    // </BrowserRouter>
    
  )
}

export default PlayerArea;