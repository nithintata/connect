import React from 'react'
import {Link} from 'react-router-dom'
const NavBar = () => {
  return (
    <nav>
    <div className="nav-wrapper white">
      <Link to="/" className="brand-logo myfont left">Connect</Link >
      <ul id="nav-mobile" className="right">
        <li><Link to="/signin">Signin</Link ></li>
        <li><Link to="/signup">Signup</Link ></li>
        <li><Link to="/profile">Profile</Link ></li>
        <li><Link to="/create-post">Create Post</Link ></li>
      </ul>
    </div>
  </nav>
  )
}

export default NavBar
