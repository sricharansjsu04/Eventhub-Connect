import React, { useState } from 'react'
import Play_form from './components/Play_form/Play_form'
import Form_list from './components/Play_form/Form_list'
import usePlayFormStore from './components/Zustand/PlayFormStore'
import { BrowserRouter, Route,  Routes } from 'react-router-dom'

function App() {
  const {playData} =usePlayFormStore()
  const [editindex, setEditIndex] = useState(null)
  const editHandler =(index)=>{
    console.log(index,playData[index])
    setEditIndex(index)
  }
  const removeIndex = (data)=>{
    setEditIndex(data)
  }
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Form_list editHand={editHandler}/>} />
      <Route path="form"  element={<Play_form dataIndex={editindex} removeindx={removeIndex} />} />
    </Routes>
    {/* <Play_form dataIndex={editindex} removeindx={removeIndex} />
    <Form_list editHand={editHandler}/> */}
    </BrowserRouter>
    
  )
}

export default App