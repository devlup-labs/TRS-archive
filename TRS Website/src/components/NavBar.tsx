import DropdownInput from "./DropInput";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../actions/userActions";
import {getCategoriesAction} from "../actions/postActions"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [cat, setCat] = useState("");

  const handleClick = () => {
    console.log("Logged out");
    dispatch(logout());
    
  };
  const handleOptionSelect = (option) => {
    setCat(option);
  };

  const getCategories = useSelector((state) => state.getCategories);
  const { loadingCat, successCat, categoriesInfo } = getCategories;
  const userLogin = useSelector((state) => state.userLogin);
  const { authToken } = userLogin;

  useEffect(() => {
    if (!categoriesInfo) {
      dispatch(getCategoriesAction());
    } else {
      console.log(categoriesInfo);
      setCats(categoriesInfo.map((category) => category.name));
    }
  }, [dispatch, categoriesInfo]);
  const handleNavigation = () => {
    if (authToken) {
      if (authToken.roles === "admin") {
        navigate("/admin");
      } else if (authToken.roles === "editor") {
        navigate("/editor");
      } else if (authToken.roles === "reviewer") {
        navigate("/reviewer");
      } else {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  };
  return (
    <nav className="fixed top-24 left-0 w-full h-16 bg-blue-800  z-10 shadow-md flex items-center justify-between text-white p-4">
      <div onClick={handleNavigation}>
        <img src="/image-removebg-preview (3).png" className="h-36 w-36"></img>
      </div>

      {!loadingCat && successCat && (
        <div className="flex items-center flex-grow mx-4">
          <DropdownInput
            options={cats}
            style="bg-gray-900"
            b_bar={false}
            onOptionSelect={handleOptionSelect}
          />
        </div>
      )}

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

            {location.pathname !== "/editor/dashboard" && authToken.roles=='editor' ? (
              <a
                href="/editor/dashboard"
                className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white hover:no-underline mr-2"
              >
                Assigned Posts
              </a>
            ) : (
              <></>
            )}

            {location.pathname !== "/editor" && authToken.roles=='editor' ? (
              <a
                href="/editor"
                className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white hover:no-underline mr-2"
              >
                Assign Post
              </a>
            ) : (
              <></>
            )}

            {location.pathname !== "/reviewer" && location.pathname.startsWith("/reviewer/") && authToken.roles=='reviewer' ? (
              <a
                href="/reviewer"
                className="px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white hover:no-underline mr-2"
              >
                My Reviews
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
