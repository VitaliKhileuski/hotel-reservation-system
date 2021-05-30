import {React, useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import {Redirect} from 'react-router-dom'


export default function HotelTable(){
    const role = useSelector((state) => state.role)

    if(role==='User'){
        return <Redirect to='/home'></Redirect>
      }
      else{

      
    return (
        <div>
            hotel table
        </div>
    )
      }
}