import Banner from "./components/Banner";
import Navbar from "./components/NavBar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import PrivateRoute from './utils/PrivateRoute';
// import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./components/Login";
import RegisterPage from "./components/RegisterPage";
import HomePage from "./components/Homepage";
function App() {
  return (
    <>
      <div>
        <Router>
          <Banner />
          <Navbar />
          <Switch>
            <Route component={LoginPage} path="/login" />
            <Route component={RegisterPage} path="/register" />
            <Route component={HomePage} path="/" />
          </Switch>
        </Router>
      </div>
    </>
  );
}

export default App;
