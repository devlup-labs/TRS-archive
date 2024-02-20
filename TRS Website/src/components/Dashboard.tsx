import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';

const token = localStorage.getItem("authTokens");
    
export default function Dashboard() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (token) {
      const decode = jwtDecode(token);
      setUserName(decode.username);
      setEmail(decode.email);
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500">Welcome to the Dashboard</h1>
        <div className="mt-4">
          <p>Username: {userName}</p>
          <p>Email: {email}</p>
        </div>
        {/* Add more dashboard content here */}
      </div>
    </div>
  );
};
        