import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, redirect, useNavigate, useLocation } from "react-router-dom";
import { login } from "../actions/userActions";
import Loader from "./Loader.tsx";
import Message from "./Message.tsx";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [is_staff, setIsStaff] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    console.log("Submitted");
    dispatch(login(email, password));
  };



  const userLogin = useSelector((state) => state.userLogin);
  const { error, loading, authToken } = userLogin;

  useEffect(() => {
    if (authToken) {
      if (authToken.roles == "admin") {
        navigate("/admin");
      } else if (authToken.roles == "reviewer") {
        navigate("/reviewer");
      } else if (authToken.roles == "editor") {
        navigate("/editor");
      } else {
        navigate("/");
      }
    }
  }, [authToken, redirect, navigate]);

  return (
    <>
      <div className="mt-48 text-green-500 bg-opacity-0"></div>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader></Loader>}
      <form
        onSubmit={submitHandler}
        className="mx-auto mt-16 w-1/3 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-md shadow-md"
      >
        <label className="block mb-2">Email:</label>
        <div className="relative mb-4">
          <input
            type="text"
            className="w-full p-2 bg-gray-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 transition-colors"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
          />
          <div className="absolute w-full left-0 bottom-0 h-1 bg-gray-900 transition-colors"></div>
        </div>

        <label className="block mb-2">Password:</label>
        <div className="relative mb-4">
          <input
            type="password"
            className="w-full p-2 bg-gray-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <div className="absolute w-full left-0 bottom-0 h-1 bg-gray-900 transition-colors"></div>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Submit
        </button>
        <p>
          Do not Have an account?{" "}
          <a href="/register" className="hover:text-gray-400">
            Register
          </a>
        </p>
        <div className=" mb-4">
          <a href="/forgot-password" className="hover:text-gray-400">
            Forgot Password?
          </a>
        </div>
      </form>
    </>
  );
};
