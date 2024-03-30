import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {useDispatch,useSelector} from 'react-redux'
import {getUserDetails} from '../actions/userActions'
import {USER_UPDATE_PROFILE_RESET} from '../constants/userConstants'
import Loader from './Loader.tsx'



export const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [aor,setAOR]=useState("");
  const [aff,setAff]=useState("");
  const [catg,setCatg]=useState("");
  const [cp,setCp]=useState("");
  const [roles,setRoles]=useState("")
  const [upload_verified, setUploadVerified] = useState(false);
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
                dispatch({ type:USER_UPDATE_PROFILE_RESET})
                console.log('Fetching user details...');
                dispatch(getUserDetails('profile'))  //sending profile as parameter to complete the url for making get request(api/users/profile)
            }
      else{

        dispatch({ type:USER_UPDATE_PROFILE_RESET})
        setUserName(user.username)
        setEmail(user.email)
        setAOR(user.area_of_research)
        setAff(user.affiliation)
        setCatg(user.default_category)
        setCp(user.current_position)
        setRoles(user.roles)
        setImage(user.image)
        setUploadVerified(user.upload_verified)
      
      }

    }
  }, [dispatch,authToken,user,navigate]); // Empty dependency array to run only once when component mounts

  const handleEditProfile = () => {
    navigate("/edit_profile"); // Redirect to edit_profile page
  };



  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {loading && <Loader></Loader>}
      {upload_verified!== true ? (
        <div className="border border-black bg-gray-300">
          Your Account isnt verified.
        </div>
      ) : (
        <></>
      )}

      <div className="text-center border border-black bg-gray-300">
        <h1 className="text-4xl font-bold text-red-500">
          Welcome to the Your Account
        </h1>
        <div className="mt-4">
          <img
            className="w-[100px] h-[100px] mx-auto items-center"
            alt="Image"
            src={image}
          />

        </div>
        <div className="mt-4">
          <p>Username: {userName}</p>
          <p>Email: {email}</p>
          <p>Area_Of_Research: {aor}</p>
          <p>Affilation: {aff}</p>
          <p>Default_Category: {catg}</p>
          <p>Current_Position: {cp}</p>
          <p>Roles:{roles}</p>
          <button
            onClick={handleEditProfile}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Edit Profile
          </button>
        </div>
      </div>
      {upload_verified === true ? (
        <a className="" href="/upload">
          Start New Submission
        </a>
      ) : (
        <div className="">Your Account isnt verified for Upload.</div>
      )}
    </div>
  );
};
