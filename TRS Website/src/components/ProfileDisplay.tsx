import { useEffect, useState } from "react";
import { useNavigate,useParams,useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET,USER_DETAILS_RESET } from "../constants/userConstants";
import Loader from "./Loader.tsx";

export const ProfileView = () => {
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [profile,setProfile]=useState(null)
  const { user_name } = useParams();
  const baseDir = import.meta.env.BACKEND_URL;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location=useLocation();

  const userLogin = useSelector((state) => state.userLogin);
  const { authToken } = userLogin; //the person who logged in




  useEffect(() => { 

      console.log("heelo")
      getProfile();    
  },[location]);

  const getProfile=async()=>{
        try {
      console.log(user_name)
      

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken.access}`,
      },
    };

     const response = await fetch(`/api/users/getUser/${user_name}/`, {
        method: "GET",
        headers: config.headers,
      });
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data1 = await response.json();
      
      if (data1) {
        setProfile(data1);
        console.log(data1);
      } 
      
      else {
        setError("Profile not found");
        console.log(`error`);
      }

    } 
    
    catch (err) {
       setError(err.message);
  } finally {
      setLoading(false);
    }
  };
  


  if (loading) {
    // return <div className="mt-48">Loading...</div>;
    return <Loader></Loader>
  }

  if (!profile) {
    return <div className="mt-48">{error}</div>;
  }




// ['id','username','full_name','email','area_of_research','affiliation','default_category','current_position','roles','image','upload_verified']
  return (
    <>
    {/* {loading && <Loader />}  */}
    <div className="flex flex-col h-screen">
        {/* Profile Section */}
        
          <div className="mt-44">
            <div className="flex flex-col items-center justify-center">
              {loading && <Loader />}

              <div className="text-center border border-black bg-gray-500 p-4 text-white rounded-xl">
                <div className="mt-4">
                  <img
                    className="w-[100px] h-[100px] mx-auto items-center"
                    alt="Image"
                    src={baseDir+profile.image}
                  />
                </div>
                <div className="mt-4">
                  <p>Username: {profile.username}</p>
                  <p>Email: {profile.email}</p>
                  <p>Area_Of_Research: {profile.area_of_research}</p>
                  <p>Affilation: {profile.affiliation}</p>
                  <p>Default_Category: {profile.default_category}</p>
                  <p>Current_Position: {profile.current_position}</p>
                  <p>Roles:{profile.roles}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        {/* <div className="w-1/2 p-4 mt-44 overflow-y-scroll">
          <ul className="w-full">
            {data && data.length > 0 ? (
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
              ))
            ) : (
              <li className="text-center">No data available</li>
            )}
          </ul>
        </div> */}
    </>
  );
};
