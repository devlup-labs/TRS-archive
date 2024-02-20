import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import DropdownInput from "./DropInput";

const Navbar = () => {
  const { logoutUser } = useContext(AuthContext);
  const handleClick = () => {
    console.log("Logged out");
    logoutUser();
  };
  const loggedIn = localStorage.getItem("loggedIn");
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
        {loggedIn == "false" ? (
          <a
            href="/login"
            className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white hover:no-underline"
          >
            Login
          </a>
        ) : ( 
          
          <button
            className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
            onClick={handleClick}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
