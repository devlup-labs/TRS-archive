import React, { useState } from "react";
// import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Forgot_pass = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  // const csrfToken = (window as any).csrfToken;

  const send_email = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      // console.log("heroewkj")
      const response = await fetch(
        import.meta.env.BACKEND_URL + "/api/password_reset/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      const responseData = await response.json();

      // Handle other errors
      if (responseData.msg === "User with this email doesn't exist") {
        // Display error message to the user
        Swal.fire({
          title: "Error",
          text: responseData.msg,
          icon: "error",
          toast: true,
          timer: 2000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } else if (response.ok) {
        // console.log(response)
        Swal.fire({
          title: "Reset Request Sended",
          icon: "success",
          toast: true,
          timer: 2000,
          position: "top-right",
          timerProgressBar: true,
          showConfirmButton: false,
        });

        navigate("/blank");
      }
    } catch (error) {
      console.error("Error while sending mail:", error);
    }
  };
  return (
    <>
      <div className="mt-48 text-green-500 bg-opacity-0"></div>
      <form
        onSubmit={send_email}
        className="mx-auto mt-16 w-1/5 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-md shadow-md"
      >
        <label className="block mb-2">Enter your email id:</label>
        <div className="relative mb-4">
          <input
            type="email"
            className="w-full p-2 bg-gray-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
          />

          <div className="absolute w-full left-0 bottom-0 h-1 bg-gray-900 transition-colors"></div>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default Forgot_pass;
