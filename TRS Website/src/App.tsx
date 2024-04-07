import Banner from "./components/Banner";
import Navbar from "./components/NavBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import PrivateRoute from './utils/PrivateRoute';
import { Login } from "./components/Login";
import { SearchProvider } from "./context/SearchContext";
import { Register } from "./components/RegisterPage";
import Home from "./components/Homepage";
import Otp from "./components/Otp";
import { Upload } from "./components/Upload";
import {Dashboard} from "./components/Dashboard";
import Edit_p from "./components/Edit_p";
import Mssg from "./components/Blank"
// import { verified } from "../constants";
import Forgot_pass from "./components/Reset_email"
import Change_pwd from "./components/Change_pass"
import Email_ver from "./components/Email_ver"
import {Register2} from "./components/RegisterPage2"
import { ProfileSetup } from "./components/ProfileSetup"




function App() {
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
                <Route element={<Register2/>} path="/register2" />
                <Route element={<ProfileSetup/>} path="/profile_setup"></Route>
              </Routes>
            </SearchProvider>
        </Router>
      </div>
    </>
  );
}

export default App;
