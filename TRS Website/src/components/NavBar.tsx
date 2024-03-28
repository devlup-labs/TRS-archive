import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import DropdownInput from "./DropInput";
import { useSelector} from "react-redux";
import {logout} from '../actions/userActions'
import {useDispatch} from 'react-redux'


const Navbar = () => {
  // const { logoutUser } = useContext(AuthContext);
  const dispatch = useDispatch()

  
  const handleClick = () => {
    console.log("Logged out");
    dispatch(logout())
    
  };

  const userLogin=useSelector(state=>state.userLogin)
  const {authToken} = userLogin
  // const loggedIn = userInfo !== null;;
  return (
    
    
    <nav className="fixed top-24 left-0 w-full h-16 bg-red-500  z-10 shadow-md flex items-center justify-between text-white p-4">
      <a
        href="/"
        className="text-xl font-bold hover:text-white no-underline hover:no-underline"
      >
        The Robotics Society
      </a>

      <div className="flex items-center flex-grow mx-4">
        <DropdownInput />
      </div>

      <div className="flex items-center">
        {!authToken ? (
          <a
            href="/login"
            className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white hover:no-underline"
          >
            Login
          </a>
        ) : (
          <div className="flex flex-row-reverse items-start justify-between">
            <button
              className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white ml-2"
              onClick={handleClick}
            >
              Logout
            </button>
            {location.pathname !== "/dashboard" ? (
              <a
                href="/dashboard"
                className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white hover:no-underline"
              >
                Dashboard
              </a>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
