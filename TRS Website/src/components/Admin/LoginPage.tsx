import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useContext(AuthContext);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser(email, password);
  };
  useEffect(() => {
    if (localStorage.getItem("authTokens")) {
      const token = localStorage.getItem("authTokens") || "";
      jwtDecode(token);
      Swal.fire({
        title: "You are already logged in",
        icon: "info",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  });
  return (
    <>
      <div className="mt-48 text-green-500 bg-opacity-0"></div>
      <form
        onSubmit={handleSubmit}
        className="mx-auto mt-16 w-1/3 bg-gray-400 text-white p-8 rounded-md shadow-md border-2 border-black"
      >
        <label className="block mb-2">Email:</label>
        <div className="relative mb-4">
          <input
            type="text"
            className="w-full p-2 bg-black border-none rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700 transition-colors"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
          />
          <div className="absolute w-full left-0 bottom-0 h-1 bg-gray-700 transition-colors"></div>
        </div>

        <label className="block mb-2">Password:</label>
        <div className="relative mb-4">
          <input
            type="password"
            className="w-full p-2 bg-black border-none rounded-md focus:outline-none focus:ring-2 focus:ring-gray-700"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          <div className="absolute w-full left-0 bottom-0 h-1 bg-gray-700 transition-colors"></div>
        </div>

        <button
          type="submit"
          className="w-full bg-black  text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Submit
        </button>
        <p>
          Do not Have an account?{" "}
          <a href="/register" className="text-blue-900">
            Register
          </a>
        </p>
      </form>
    </>
  );
};
