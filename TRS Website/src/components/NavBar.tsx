import DropdownInput from "./DropInput";
import { useSelector, useDispatch } from "react-redux";
import { logout, getCategoriesAction } from "../actions/userActions";
import { useEffect, useState } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  
  
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





  return (
    <nav className="fixed top-24 left-0 w-full h-16 bg-blue-800  z-10 shadow-md flex items-center justify-between text-white p-4">
      <a
        href="/"
      >
        <img src="../public/image-removebg-preview (3).png" className="h-36 w-36"></img>
      </a>

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
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
