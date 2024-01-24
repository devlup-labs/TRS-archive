import React, { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface JwtPayload {
  username: string;
}

interface AuthContextProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setUser: React.Dispatch<React.SetStateAction<any>>;
  authTokens: string;
  setAuthToken: React.Dispatch<React.SetStateAction<string>>;
  registerUser: (
    email: string,
    username: string,
    password: string,
    password2: string,
  ) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authTokens, setAuthToken] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")!)
      : null,
  );

  const [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens")!)
      : null,
  );

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const loginUser = async (email: string, password: string) => {
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      //making a backend request
      method: "POST",
      headers: {
        "Content-Type": "application/json", //the data is being sent in the json format
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    console.log(data);

    if (response.status === 200) {
      console.log("Logged In");
      const decoded = jwtDecode(data.access) as JwtPayload;
      const { username } = decoded;
      console.log(username);
      setAuthToken(data);
      setUser(jwtDecode(data.access));
      console.log(data.access);
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
      Swal.fire({
        title: "Login Successful \nRedirecting to home",
        icon: "success",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    } else {
      console.log(response.status);
      console.log("there was server issue");
      Swal.fire({
        title: "Username or password does not exist",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  };

  const registerUser = async (
    email: string,
    username: string,
    password: string,
    password2: string,
  ) => {
    const response = await fetch("http://127.0.0.1:8000/api/register/", {
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

    const otpResponse = await fetch("http://127.0.0.1:8000/api/send-otp/", {
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
    } else {
      console.log("Not sent");
    }
  };

  const logoutUser = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem("authTokens"); //to remove the authtoken from the local storage
    localStorage.removeItem("loggedIn");
    navigate("/login");
    Swal.fire({
      title: "You have been logged out",
      icon: "success",
      toast: true,
      timer: 2000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });
  };

  const contextData: AuthContextProps = {
    user,
    setUser,
    authTokens,
    setAuthToken,
    registerUser,
    loginUser,
    logoutUser,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access));
    }

    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
