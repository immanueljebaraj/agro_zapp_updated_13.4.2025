import React, { useState } from 'react';
import './Intermediate.css';
import { useNavigate } from 'react-router-dom';

function Intermediate() {
    let navigate = useNavigate()
    const [alldata,setAlldata] = useState([])

    const data=(e)=>{
        const { value, checked } = e.target;
        if (checked) {
            setAlldata((prev) => [...prev, value]); 
        } else {
            setAlldata((prev) => prev.filter((item) => item !== value)); 
        }
    }

    const purchase=()=>{
        navigate('/payment', { state: { alldata } })
    }

    const rent=()=>{
        navigate('/rent')
    }
  return (
    <div className='app-container-inter'>
      <div className='container-inter'>
        <div>
        <div className='check-inter'>
          <div><u>Purchase Devices</u></div>
          <div className='check-options'>
            <label><input type='checkbox' value="Sensors" onChange={data} /> Sensors</label>
            <label><input type='checkbox' value="Basic Kit" onChange={data}  /> Basic Kit</label>
            <label><input type='checkbox' value="Premium Kit" onChange={data}/> Premium Kit</label>
            <label><input type='checkbox' value="Miscellaneous" onChange={data}/> Miscellaneous</label>
          </div>
          
          </div>
          <div className='button-div-inter'>
          <button className='buttons-inter' onClick={purchase}>Next ▶</button>
          </div>
        </div>

        <div>
        <div className='check-inter'>
          <div><u>Rent Device</u></div>
          <div className='check-options'>
            <label><input type='checkbox' /> Basic Kit</label>
            <label><input type='checkbox' /> Premium Kit</label>
            <label><input type='checkbox' /> Subscription</label>
          </div>
          </div>
          <div className='button-div-inter'>
          <button className='buttons-inter'onClick={rent}>Next ▶</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Intermediate;
