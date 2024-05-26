import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, redirect, useNavigate, useLocation } from "react-router-dom";
import Message from "./Message";
import { profile_Setup } from "../actions/userActions";
import { getCategoriesAction} from "../actions/postActions"
import Loader from "./Loader";
import DropdownInput from "./DropInput";

export const ProfileSetup = () => {
  const [fullname, setFullName] = useState("");
  const [aor, setAOR] = useState("");
  const [affil, setAffil] = useState("");
  const [cp, setCp] = useState("");
  const [cat, setCat] = useState("");
  const [message, setMessage] = useState("");
  const [cats, setCats] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { error, loading, success, userInfo } = userRegister;
  const getCategories = useSelector((state) => state.getCategories);
  const { loadingCat, successCat, categoriesInfo } = getCategories;

  const handleOptionSelect = (option) => {
    setCat(option);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(profile_Setup(userInfo.email, fullname, aor, affil, cp, cat));
  };

  const userCreateProfile = useSelector((state) => state.userProfile);
  const {
    error: profile_error,
    loading: loading_profile,
    success: success_profile,
    userProfile,
  } = userCreateProfile;

  useEffect(() => {
    console.log(userInfo.affiliation);
    setAffil(userInfo.affiliation); //setting email which has being verified
    if (userProfile) {
      navigate("/login");
    } else if (!success) {
      //if user tries to access it with having verfied email
      navigate("/register");
    } else {
      dispatch(getCategoriesAction());
      console.log(categoriesInfo);
      setCats(categoriesInfo.map((category) => category.name));
    }
  }, [userInfo, loading_profile, dispatch]);
  return (
    <>
      <div className="mt-48 text-green-500"></div>
      {(loading || loadingCat) && <Loader />}
      {success && successCat && (
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-16 w-1/3 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-md shadow-md"
        >
          <h1> Register for the first time(step 2 of 2)</h1>
          {message && <Message variant="danger">{message}</Message>}
          <label className="block mb-2">FullName:</label>
          <div className="relative mb-4">
            <input
              type="text"
              className="w-full p-2 bg-gray-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="set FullName"
            />
            <div className="absolute w-full left-0 bottom-0 h-1 bg-gray-900 transition-colors"></div>
          </div>

          <label className="block mb-2">
            Affilation:(users who donot have current affilation can enter
            "Unaffilated" or "Independant Researcher")
          </label>
          <div className="relative mb-4">
            <input
              type="text"
              className="w-full p-2 bg-gray-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              value={affil}
              disabled={affil !== ""}
              onChange={(e) => setAffil(e.target.value)}
              placeholder="set Affiliation"
            />
            <div className="absolute w-full left-0 bottom-0 h-1 bg-gray-900 transition-colors"></div>
          </div>

          <label className="block mb-2">Area of Research: </label>
          <div className="relative mb-4">
            <input
              type="text"
              className="w-full p-2 bg-gray-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              required
              value={aor}
              onChange={(e) => setAOR(e.target.value)}
              placeholder="Area of Research"
            />
            <div className="absolute w-full left-0 bottom-0 h-1 bg-gray-900 transition-colors"></div>
          </div>

          <label className="block mb-2">Your Default Category:</label>
          <div className="relative mb-4">
            <DropdownInput
              options={cats}
              onOptionSelect={handleOptionSelect}
              style="h-full w-full bg-gray-800 rounded-md"
              b_bar={true}
            />
          </div>
          <label className="block mb-2">Current Position:</label>
          <div className="relative mb-4">
            <input
              type="text"
              className="w-full p-2 bg-gray-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              required
              value={cp}
              onChange={(e) => setCp(e.target.value)}
              placeholder="Enter your current position"
            />
            <div className="absolute w-full left-0 bottom-0 h-1 bg-gray-900 transition-colors"></div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            Submit
          </button>
        </form>
      )}
    </>
  );
};
