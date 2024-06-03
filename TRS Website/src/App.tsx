import Banner from "./components/Banner";
import Navbar from "./components/NavBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Login } from "./components/Login";
import { SearchProvider } from "./context/SearchContext";
import { Register } from "./components/RegisterPage";
import Home from "./components/Homepage";
import { Upload } from "./components/Upload";
import { Dashboard } from "./components/Dashboard";
import Edit_p from "./components/Edit_p";
import Mssg from "./components/Blank";
import Forgot_pass from "./components/Reset_email";
import Change_pwd from "./components/Change_pass";
import Email_ver from "./components/Email_ver";
import { Register2 } from "./components/RegisterPage2";
import { ProfileSetup } from "./components/ProfileSetup";
import { AdminPage } from "./components/AdminPage";
import { refreshAccessToken, logout } from "./actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { PostPage } from "./components/postpage";
import { ReviewersPage } from "./components/ReviewersPage";
import { EditorPage } from "./components/EditorPage";
import {EditorDashboard} from "./components/Editor_dashboard"
import {ReviewPage} from "./components/ReviewPage"

function App() {
  const dispatch = useDispatch();
  let userInfo = useSelector((state) => state.userLogin.authToken);
  console.log(userInfo);

  useEffect(() => {
    if (userInfo && userInfo.access) {
      console.log("checking start");
      console.log("The access token in the state is: ");

      let { access: accessToken, refresh: refreshToken } = userInfo;
      // console.log(accessToken)

      // Decode JWT token to extract expiration times
      const decodedAccessToken = jwtDecode(accessToken);
      const decodedRefreshToken = jwtDecode(refreshToken);
      const accessTokenExpiresAt = decodedAccessToken.exp; // Access token expiration time in Unix timestamp format
      const refreshTokenExpiresAt = decodedRefreshToken.exp; // Refresh token expiration time in Unix timestamp format
      const currentTime = Date.now() / 1000; // Current time in Unix timestamp format
      console.log(accessTokenExpiresAt);
      console.log(currentTime);
      // Check if access token is expired
      if (currentTime > accessTokenExpiresAt) {
        // Access token is expired, refresh it
        // console.log("access_token expired")
        dispatch(refreshAccessToken(refreshToken));
      }

      // Check if refresh token is expired
      if (currentTime > refreshTokenExpiresAt) {
        console.log("refresh_token expired");
        // Refresh token is expired, dispatch logout action
        dispatch(logout());
      }
    }
  }, [userInfo, dispatch]);

  return (
    <>
      <div>
        <Router>
          <SearchProvider>
            <Banner />
            <Navbar />
            <Routes>
              <Route element={<Login />} path="/login" />
              <Route element={<Register />} path="/register" />
              <Route element={<Email_ver />} path="/activate/:key" />
              <Route element={<Home />} path="/" />
              <Route element={<Upload />} path="/Upload" />
              <Route element={<Dashboard />} path="/dashboard" />
              <Route element={<Edit_p />} path="/edit_profile" />
              <Route element={<Mssg />} path="/blank" />
              <Route element={<Forgot_pass />} path="/forgot-password" />
              <Route element={<Change_pwd />} path="/change_pass/:id" />
              <Route element={<Register2 />} path="/register2" />
              <Route element={<ProfileSetup />} path="/profile_setup" />
              <Route element={<AdminPage />} path="/admin" />
              <Route element={<PostPage />} path="/post/:id" />
              <Route element={<ReviewersPage />} path="/reviewer" />
              <Route element={<EditorPage />} path="/editor" />
              <Route element={< EditorDashboard/>} path="/editor/dashboard" />
              <Route element={<ReviewPage />} path="/editor/review/:id" />
              
            </Routes>
          </SearchProvider>
        </Router>
      </div>
    </>
  );
}

export default App;
