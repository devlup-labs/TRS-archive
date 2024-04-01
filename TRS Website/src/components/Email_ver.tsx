import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import {useDispatch,useSelector} from 'react-redux'
import {Link, redirect,useNavigate,useLocation, useParams} from 'react-router-dom'
import Message from './Message'
import { verify,register } from "../actions/userActions";

function Email_ver() {

  const userVerify=useSelector(state=>state.userVerify)
  const {error,loading,esent,success}=userVerify
  const navigate=useNavigate()
  const dispatch=useDispatch()

  const {key} = useParams()

  useEffect(()=>{
    if (!success){
        dispatch(verify(key))
    }
    else{
        navigate('/register2')
    }
  },[dispatch,success])

  
 return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl mb-8">Your Email has been verified.</h1>
            <p className="text-lg mb-4">Now you can go back and login with the same email.</p>
        </div>
    );
};

export default Email_ver
