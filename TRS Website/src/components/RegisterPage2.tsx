import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Message from "./Message";
import { getCategoriesAction, register } from "../actions/userActions";
import Loader from "./Loader";

export const Register2 = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userVerify = useSelector((state) => state.userVerify);
  const { error, loading, esent, success, email: verEmail } = userVerify;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== password2) {
      setMessage("password did not match");
    } else {
      dispatch(register(email, username, password));
    }
  };

  const userRegister = useSelector((state) => state.userRegister);
  const {
    error: errorRegister,
    loading: loadingRegister,
    userInfo,
  } = userRegister;

  useEffect(() => {
    setEmail(verEmail); //setting email which has being verified
    if (userInfo) {
      navigate("/profile_setup");
    } else if (!success) {
      //if user tries to access it with having verfied email
      navigate("/register");
    } else {
      dispatch(getCategoriesAction());
    }
  }, [userInfo, loadingRegister, dispatch]);

  return (
    <>
      <div className="mt-48 text-green-500"></div>
      {loading && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 w-1/3 bg-gradient-to-r from-red-600 to-red-800 text-white p-8 rounded-md shadow-md"
      >
        <h1 className="text-[40px]">
          {" "}
          Register for the first time(step 1 of 2)
        </h1>
        {message && <Message variant="danger">{message}</Message>}
        <label className="block mb-2">Email:</label>
        <div className="relative mb-4">
          <input
            type="text"
            className="w-full p-2 bg-red-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            disabled
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
          />
          <div className="absolute w-full left-0 bottom-0 h-1 bg-green-700 transition-colors"></div>
        </div>
        <label className="block mb-2">UserName: </label>
        <div className="relative mb-4">
          <input
            type="text"
            className="w-full p-2 bg-red-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="UserName"
          />
          <div className="absolute w-full left-0 bottom-0 h-1 bg-green-700 transition-colors"></div>
        </div>

        <label className="block mb-2">Password:</label>
        <div className="relative mb-4">
          <input
            type="password"
            className="w-full p-2 bg-red-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <div className="absolute w-full left-0 bottom-0 h-1 bg-green-700 transition-colors"></div>
        </div>
        <label className="block mb-2">Reenter your Password:</label>
        <div className="relative mb-4">
          <input
            type="password"
            className="w-full p-2 bg-red-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            required
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Reenter your Password"
          />
          <div className="absolute w-full left-0 bottom-0 h-1 bg-green-700 transition-colors"></div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Submit
        </button>
      </form>
    </>
  );
};
