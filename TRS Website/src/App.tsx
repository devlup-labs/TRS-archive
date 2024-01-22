import Banner from "./components/Banner";
import Navbar from "./components/NavBar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from "./context/AuthContext";
import { Login } from "./components/Login";
import { SearchProvider } from "./context/SearchContext";
import { Register } from "./components/RegisterPage";
import { Home } from "./components/Homepage";
import Otp from "./components/Otp"

function App() {
  localStorage.setItem("check", "false");
  return (
    <>
      <div>
        <Router>
          <AuthProvider>
            <SearchProvider>
              <Banner />
              <Navbar />
              <Routes>
                <Route element={<Login />} path="/login" />
                <Route element={<Register />} path="/register" />
                <Route element={<Otp />} path="/otp" />
                <Route element={<Home />} path="/" />

              </Routes>
            </SearchProvider>
          </AuthProvider>
        </Router>
      </div>
    </>
  );
}

export default App;
