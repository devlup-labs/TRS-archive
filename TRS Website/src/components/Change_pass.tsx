import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";

const Change_pass = () => {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  //   const { state } = useLocation();
  const reset_pass = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await fetch(
        import.meta.env.BACKEND_URL + "/api/change_password/" + id + "/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password,
          }),
        }
      );

      if (response.ok) {
        console.log(password);
        Swal.fire({
          title: "Password Reset Successfully",
          icon: "success",
          toast: true,
          timer: 2000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });

        navigate("/login");

        // You can navigate to the login page or perform other actions
      } else {
        // OTP verification failed
        const errorData = await response.json();
        console.log(errorData);
        Swal.fire({
          title: `Error: ${errorData.message}`,
          icon: "error",
          toast: true,
          timer: 2000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error while sending mail:", error);
    }
  };
  return (
    <>
      <div className="mt-48 text-green-500 bg-opacity-0"></div>
      <form
        onSubmit={reset_pass}
        className="mx-auto mt-16 w-1/5 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-md shadow-md"
      >
        <label className="block mb-2">New Password:</label>
        <div className="relative mb-4">
          <input
            type="password"
            className="w-full p-2 bg-gray-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />

          <div className="absolute w-full left-0 bottom-0 h-1 bg-gray-900 transition-colors"></div>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Change_pass;
