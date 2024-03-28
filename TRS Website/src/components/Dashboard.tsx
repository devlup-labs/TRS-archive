import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [upload_verified, setUploadVerified] = useState(false);
  const [userID, setUserId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authTokens");
    if (token) {
      const decode = jwtDecode(token);
      setUserName(decode.username);
      setEmail(decode.email);
      setImage("http://127.0.0.1:8000/media/" + decode.image);
      // http://127.0.0.1:8000/media is used for now to retrieve image but should be changes to get the image properly
      setIsVerified(decode.is_verified);
      setUploadVerified(decode.upload_verified);
      setUserId(decode.user_id);
      console.log(JSON.stringify(decode));
    }
  }, []); // Empty dependency array to run only once when component mounts
  const handleEditProfile = () => {
    navigate("/edit_profile"); // Redirect to edit_profile page
  };
  const handleChangePasssword = () => {
    navigate(`/change_pass/${userID}`); // Redirect to change_password page
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen mt-2">
      {isVerified !== true ? (
        <div className="border border-black bg-gray-300">
          Your Account isnt verified.
        </div>
      ) : (
        <></>
      )}
      <div className="text-center border border-black bg-gray-300 pt-2 px-4 pb-4 mt-2">
        <h1 className="text-4xl font-bold text-red-500">
          Welcome to the Your Account
        </h1>
        <div className="mt-4">
          <img
            className="w-[100px] h-[100px] mx-auto items-center"
            alt="Image"
            src={image}
          />
        </div>
        <div className="mt-4">
          <p>Username: {userName}</p>
          <p>Email: {email}</p>
          <div className="flex flex-row justify-evenly">
            <button
              onClick={handleEditProfile}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Edit Profile
            </button>
            <button
              onClick={handleChangePasssword}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
      {upload_verified === true ? (
        <a
          className="border-2 border-black bg-gray-300 rounded-md mt-2 p-2 hover:no-underline"
          href="/upload"
        >
          Start New Submission
        </a>
      ) : (
        <div className="">Your Account isnt verified for Upload.</div>
      )}
    </div>
  );
};
