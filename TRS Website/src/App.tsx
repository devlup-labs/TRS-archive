
import Banner from './components/Banner';
import Navbar from './components/NavBar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

import HomePage from './components/homepage';
import RegisterPage from './components/register';
import LoginPage from './components/login';
// import Dashboard from './components/dashboard';

function App() {
  return (
    <>
      <div>
        <Router>
          <AuthProvider>
            {/* <Banner /> */}
            <Navbar />
            <Switch>
              <Route component={LoginPage} path="/login" />
              <Route component={RegisterPage} path="/register" />
              <Route component={HomePage} path="/" />
             
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </>
  );
}

export default App;
