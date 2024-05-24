import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../actions/userActions";
import { getuserPostDetails } from "../actions/postActions";
import { useSearch } from "../context/SearchContext";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
import Loader from "./Loader.tsx";

export const Dashboard = () => {
  const { searchQuery } = useSearch();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [aor, setAOR] = useState("");
  const [aff, setAff] = useState("");
  const [catg, setCatg] = useState("");
  const [cp, setCp] = useState("");
  const [roles, setRoles] = useState("");
  const [upload_verified, setUploadVerified] = useState(false);
  const [data, setData] = useState([]);
  const baseDir = import.meta.env.BACKEND_URL;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { authToken } = userLogin; //the person who logged in

  const userDetails = useSelector((state) => state.userDetails);
  const { error, loading, user } = userDetails;

  const userPosts=useSelector((state) => state.getuserPosts);
  const {error:errorPosts,loading:loadingPosts,user_posts}=userPosts


  const handleOnClick = () => {
    navigate("/upload");
  };

  const handleChangePassword = () => {
    navigate("/change_pass/" + user.id);
  };

  const handleResetEmail = () => {
    navigate("/forgot-password");
  };






  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    } else {
      if (!user || !user.username) {
        //to check whether the user information has been loaded or not
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        console.log("Fetching user details...");
        dispatch(getUserDetails("profile")); //sending profile as parameter to complete the url for making get request(api/users/profile)
        dispatch(getuserPostDetails(authToken.id))
      } else {
        dispatch({ type: USER_UPDATE_PROFILE_RESET });
        setUserName(user.username);
        setEmail(user.email);
        setAOR(user.area_of_research);
        setAff(user.affiliation);
        setCatg(user.default_category);
        setCp(user.current_position);
        setRoles(user.roles);
        setImage(import.meta.env.BACKEND_URL + user.image);
      setUploadVerified(user.upload_verified);
    
      setData(user_posts)
      console.log(data)
      }
    }
  }, [dispatch, authToken,user_posts, user, navigate]); // Empty dependency array to run only once when component mounts

  const handleEditProfile = () => {
    navigate("/edit_profile"); // Redirect to edit_profile page
  };

    const truncate = (s: string) => {
    if (s.length > 200) {
      return s.substring(0, 200) + "...";
    } else {
      return s;
    }
  };



  return (
     <div className="flex flex-col h-screen">
    <div className="flex-grow flex flex-row">
      {/* Profile Section */}
      <div className="w-1/2 p-4">
      <div className="mt-80">
      <div className="flex flex-col items-center justify-center">
        {loading && loadingPosts && <Loader />}
        {upload_verified !== true ? (
          <div className="border border-black bg-gray-300">
            Your Account isnt verified.
          </div>
        ) : (
          <></>
        )}

        <div className="text-center border border-black bg-gray-500 p-4 text-white rounded-xl">
          <h1 className="text-4xl font-bold text-blue-500">
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
            <div className="flex flex-row gap-2 justify-evenly">
              <button
                onClick={handleChangePassword}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Change Password
              </button>
              <button
                onClick={handleEditProfile}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Edit Profile
              </button>
              <button
                onClick={handleResetEmail}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Forgot Password
              </button>
            </div>
          </div>
        </div>
        {upload_verified === true ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-1"
            onClick={handleOnClick}
          >
            Start New Submission
          </button>
        ) : (
          <div className="">Your Account isnt verified for Upload.</div>
        )}

         </div>
        </div>
      </div>

         {/* Posts Section */}
      <div className="w-1/2 p-4 mt-80">
          <ul className="w-full">
          { data && data.length > 0 ?(
          data.map((item, index) => (
            <li
              key={index}
              className="flex flex-col w-[90%] border border-black shadow-md p-2 rounded-md mb-2 shadow-red-500"
            >
              <div className="mb-2 border-b border-b-black">
                <strong>{item.title}</strong>
              </div>
              <div className="mb-2">
                <p>{truncate(item.body)}</p>
              </div>
              <div className="flex flex-row justify-between">
                <a
                  href={baseDir + item.document}
                  target="_blank"
                  // onClick={() => console.log(`Clicked ${index} link`)}
                >
                  PDF
                </a>
  
                <p>{item.status}</p>
              </div>
            </li>
          )))
          :(
            <li className="text-center">No data available</li>
          )
  } 
          
        </ul>

        </div>
      </div>        
    </div>

  );
};
