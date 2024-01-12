import Logo from '../assets/IItlogo.png'
// import DropInput from './DropInput'
import {useContext} from 'react'
import {jwtDecode} from 'jwt-decode'
import AuthContext from '../context/AuthContext'
import {Link} from 'react-router-dom'

const Navbar = () => {

  
    const {logoutUser} = useContext(AuthContext)
    let username='';
  const token = localStorage.getItem("authTokens");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const user_id = decoded.user_id;
      username=decoded.username;
      console.log(user_id);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  } else {
    console.log("No token found in localStorage");
  }





    return (
        
        
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img style={{width:'80px',padding:'2px'}}src={Logo} alt="" />

          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          
            <ul className="navbar-nav">
              
              {token===null &&
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
              }  

              {token!==null && 
              <>
              
              <li className="nav-item">
                  <spam className="nav-link" style={{ color: '#fff' }} href="/dashboard">Hello {username}</spam>
                </li>
                <li className="nav-item">
                  <a className="nav-link" style={{ color: '#fff' }} href="/dashboard">Dashboard</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" onClick={logoutUser} style={{cursor:"pointer",color: '#fff'}} >Logout</a>
                </li>
              </>
              }


            </ul>
          
        </div>
      </nav>    


    )
}

export default Navbar