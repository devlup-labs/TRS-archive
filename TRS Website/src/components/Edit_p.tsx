import React, { useState,useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {useDispatch,useSelector} from 'react-redux'
import {getUserDetails,updateUserProfile} from '../actions/userActions'
import {USER_UPDATE_PROFILE_RESET} from '../constants/userConstants'
import Loader from './Loader.tsx'

export default function Edit_p() {
    // const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    // const [image, setImage] = useState("");
    const [aor,setAOR]=useState("");
    // const [catg,setCatg]=useState("");
    const [cp,setCp]=useState("");
    const [roles,setRoles]=useState("")

    const navigate = useNavigate();
    const dispatch=useDispatch()

    const userLogin = useSelector(state=>state.userLogin)
    const {authToken} = userLogin //the person who logged in

    const userDetails = useSelector(state=>state.userDetails)
    const {error,loading,user} = userDetails

    
    useEffect(() => {
    if(!authToken){
      navigate('/login')
    }
    else{
      if(!user || !user.username){  //to check whether the user information has been loaded or not
                console.log('Fetching user details...');
                dispatch(getUserDetails('profile'))  //sending profile as parameter to complete the url for making get request(api/users/profile)
            }
      else{
        setUserName(user.username)
        setEmail(user.email)
        setAOR(user.area_of_research)
        setCp(user.current_position)
        setRoles(user.roles)
        // setImage(user.image)
      }
      

    }
  }, [dispatch,authToken,user,navigate]); // Empty dependency array to run only once when component mounts
    
    
    const handleSubmit = (e) =>{
        
        e.preventDefault()
        
        
        console.log('Updating....')
        dispatch(updateUserProfile({
            'id':user._id,
            'name':userName,
            'email':email,
            'aor':aor,
            // 'category':catg,
            'current_postn':cp,
            'roles':roles,

        }))
        
        
        // dispatch(getUserDetails('profile'))  

        navigate('/dashboard')
        

            
        
    }

    // const handleSubmit = async (event) => {
    //     event.preventDefault();

    //     const token = JSON.parse(localStorage.getItem('authTokens')).access;
        
    //     try {
    //         const response = await fetch('http://127.0.0.1:8000/api/profile/edit/', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             },
    //             body: JSON.stringify({
    //                 username: fullName,
    //             })
    //         });

    //         if (response.ok) {
    //             navigate("/dashboard");
    //             Swal.fire({
    //                 title: "Profile updated succesfully",
    //                 icon: "success",
    //                 toast: true,
    //                 timer: 3000,
    //                 position: "top-right",
    //                 timerProgressBar: true,
    //                 showConfirmButton: false,
    //               });
    //             // Profile update successful
    //             // Redirect the user to the dashboard or display a success message
    //         } else {
    //             console.log("some error")
    //             // Profile update failed
    //             // Handle error response from the server
    //         }
    //     } catch (error) {
    //         // Handle network errors or other exceptions
    //         console.error('Error updating profile:', error);
    //     }
    // };

    return (
            <div className="relative top-44 md:w-1/3 mx-auto w-full">
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}
            className="mx-auto mt-16 bg-gradient-to-r from-red-600 to-red-800 p-8 rounded-md shadow-md">
              
            
            
            <label className="block mb-2">Name:</label>
            <input
            type="text"
            value={userName} 
            onChange={(e) => setUserName(e.target.value)}
             placeholder="Your Name"
            required
            className="w-full p-2 bg-red-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            />

            
            <label className="block mb-2">Email:</label>
            <input
            type="text"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
             placeholder="Your Email"
            required
            className="w-full p-2 bg-red-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            />

            <label className="block mb-2">Area of Research:</label>
            <input
            type="text"
            value={aor} 
            onChange={(e) => setAOR(e.target.value)}
            placeholder="Your Area of Research"
            required
            className="w-full p-2 bg-red-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            />
            

          
            

            {/* <label className="block mb-2">Category:</label>
            <input
            type="text"
            value={catg} 
            onChange={(e) => setCatg(e.target.value)}
             placeholder="Your Email"
            required
            className="w-full p-2 bg-red-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            /> */}

            <label className="block mb-2">Current Position:</label>
            <input
            type="text"
            value={cp} 
            onChange={(e) => setCp(e.target.value)}
             placeholder="Your current position"
            required
            className="w-full p-2 bg-red-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            />
         
         
            
            




            
    
            <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Save Changes
        </button>
        </form>
        </div>

    );
}
