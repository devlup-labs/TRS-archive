import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import DropdownInput from "./DropInput";

const Navbar = () => {
  const { logoutUser } = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleClick = () => {
    console.log("Logged out");
    logoutUser();
    setIsAuthenticated(false);
  };
  useEffect(() => {
    if (localStorage.getItem("loggedIn") === "true") {
      setIsAuthenticated(true);
    }
  }, [isAuthenticated]);
  return (
    <nav className="fixed top-24 left-0 w-full h-16 bg-red-500 shadow-md flex items-center justify-between text-white p-4">
      <a href="/" className="text-xl font-bold">
        The Robotics Society
      </a>

      <div className="flex items-center flex-grow mx-4">
        <DropdownInput />
      </div>

      <div className="flex items-center">
        {!isAuthenticated ? (
          <a
            href="/login"
            className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
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

