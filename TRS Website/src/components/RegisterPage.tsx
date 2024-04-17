import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import {useDispatch,useSelector} from 'react-redux'
import {Link, redirect,useNavigate,useLocation} from 'react-router-dom'
import Message from './Message'
import { send_email,register } from "../actions/userActions";
import Loader from './Loader.tsx'




export const Register = () => {
  const [email, setEmail] = useState("");
  const [message,setMessage] = useState('')
  const [buttonClicked, setButtonClicked] = useState(false);
  
  const location=useLocation()
  const navigate=useNavigate()
  const dispatch=useDispatch()
  

  const userVerify=useSelector(state=>state.userVerify)
  const {error,loading,esent,success}=userVerify

  
  
  const handleSubmit = (e) =>{
    e.preventDefault()
     dispatch(send_email(email)) 
     setButtonClicked(true);
    }
  
  return (
    <>
      <div className="mt-48 text-green-500"></div>
      {!esent && buttonClicked && !error && <Loader></Loader>}

      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 w-1/3 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-md shadow-md"
      >
        {error && <Message variant="danger">{error}</Message>}
        <label className="block mb-2">Email:</label>
        <div className="relative mb-4">
          <input
            type="text"
            className="w-full p-2 bg-gray-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
          />
          <div className="absolute w-full left-0 bottom-0 h-1 bg-gray-900 transition-colors"></div>
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Submit
        </button>
        <p>
          Already Have an account?{" "}
          <a href="/login" className="hover:text-gray-400">
            Login
          </a>
        </p>
      </form>
    </>
  );
};
