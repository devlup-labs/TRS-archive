import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Edit_p() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = JSON.parse(localStorage.getItem('authTokens')).access;
        
        try {
            const response = await fetch('http://127.0.0.1:8000/api/profile/edit/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    username: fullName,
                })
            });

            if (response.ok) {
                navigate("/dashboard");
                Swal.fire({
                    title: "Profile updated succesfully",
                    icon: "success",
                    toast: true,
                    timer: 3000,
                    position: "top-right",
                    timerProgressBar: true,
                    showConfirmButton: false,
                  });
                // Profile update successful
                // Redirect the user to the dashboard or display a success message
            } else {
                console.log("some error")
                // Profile update failed
                // Handle error response from the server
            }
        } catch (error) {
            // Handle network errors or other exceptions
            console.error('Error updating profile:', error);
        }
    };

    return (
            <div className="relative top-44 md:w-1/3 mx-auto w-full">
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}
            className="mx-auto mt-16 bg-gradient-to-r from-red-600 to-red-800 p-8 rounded-md shadow-md">
                <div>
                <label className="block mb-2">Name:</label>
            <input
            type="text"
            value={fullName} 
            onChange={(e) => setFullName(e.target.value)}
             placeholder="Your Name"
            required
            className="w-full p-2 bg-red-800 border-none rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            />
                </div>
    
            <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Save Changes
        </button>
            </form>
        </div>

    );
}
