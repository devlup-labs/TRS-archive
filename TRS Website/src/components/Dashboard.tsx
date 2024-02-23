import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'


export default function Dashboard() {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = localStorage.getItem("authTokens");
      if (token) {
        const decode = jwtDecode(token);
        setUserName(decode.username);
        setEmail(decode.email);
   
      }
    }, []); // Empty dependency array to run only once when component mounts
  const handleEditProfile = () => {
      navigate('/edit_profile'); // Redirect to edit_profile page
  };
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-500">Welcome to the Dashboard</h1>
          <div className="mt-4">
            <p>Username: {userName}</p>
            <p>Email: {email}</p>
            <button onClick={handleEditProfile} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                        Edit Profile
                    </button>
          </div>
          {/* Add more dashboard content here */}
        </div>
      </div>
    );
  };

        