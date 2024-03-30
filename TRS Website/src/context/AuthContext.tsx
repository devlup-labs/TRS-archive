import React, { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface JwtPayload {
  username: string;
}

interface AuthContextProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
 
  authTokens: string;
  setAuthToken: React.Dispatch<React.SetStateAction<string>>;
  registerUser: (
    email: string,
    username: string,
    password: string,
    password2: string
  ) => Promise<void>;

}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authTokens, setAuthToken] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")!)
      : null
  );


  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();



  const registerUser = async (
    email: string,
    username: string,
    password: string,
    password2: string
  ) => {
    const response = await fetch("http://127.0.0.1:8000/api/users/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
        password2,
      }),
    });
  
    if (response.status === 201) {
      Swal.fire({
        title: "Check your email to complete registration",
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      const otpResponse = await fetch("http://127.0.0.1:8000/api/users/send-otp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
  
      await Promise.all([otpResponse]);
  
      if (otpResponse.ok) {
        // OTP sent successfully
        navigate("/otp", { state: { email } }); // Redirect to OTP verification page
      } 
      else {
        console.log("Not sent");
      }
    } else {
      console.log(response.status);
      console.log("there was a server issue");
      Swal.fire({
        title: `An Error occurred ${response.status}`,
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };
  
  


  // useEffect(() => {
  //   const checkTokenExpiration = async () => {
  //     console.log("checking start");
  //     if (authTokens) {
  //       const decodedAccessToken = jwtDecode(authTokens.access);
  //       const decodedRefreshToken = jwtDecode(authTokens.refresh);
  //       const accessTokenExpirationTime = decodedAccessToken.exp * 1000;
  //       const refreshTokenExpirationTime = decodedRefreshToken.exp * 1000;
  //       const currentTime = Date.now();

  //       if (accessTokenExpirationTime < currentTime) {
  //         // Access token has expired
  //         if (refreshTokenExpirationTime < currentTime) {
  //           // Both tokens have expired, logout the user
  //           console.log("refresh time exceed");
  //           logoutUser();
  //         } else {
  //           // Refresh the access token using the refresh token
  //           try {
  //             const response = await fetch(
  //               "http://127.0.0.1:8000/api/token/users/refresh",
  //               {
  //                 method: "POST",
  //                 headers: {
  //                   "Content-Type": "application/json",
  //                 },
  //                 body: JSON.stringify({
  //                   refresh: authTokens.refresh,
  //                 }),
  //               }
  //             );

  //             if (response.ok) {
  //               const data = await response.json();

  //               const tokensToUpdate = {
  //                 refresh: authTokens.refresh,
  //                 access: data.access,
  //               };
  //               setAuthToken(tokensToUpdate);
  //               localStorage.setItem(
  //                 "authTokens",
  //                 JSON.stringify(tokensToUpdate)
  //               );
  //               console.log("token updated");
  //             } else {
  //               console.log("using old ref token");
  //               // Refresh token request failed, logout the user
  //               logoutUser();
  //             }
  //           } catch (error) {
  //             console.error("Error refreshing access token:", error);
  //             // Handle error
  //           }
  //         }
  //       }
  //     }
  //   };

  //   checkTokenExpiration();

  //   // Set up a timer to check token expiration periodically
  //   const interval = setInterval(checkTokenExpiration, 60000); // Check every minute

  //   // Clean up the interval when the component unmounts
  //   return () => clearInterval(interval);
  // }, [authTokens, setAuthToken]);

  const contextData: AuthContextProps = {

    authTokens,
    setAuthToken,
    registerUser,
   
  };

 

return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
