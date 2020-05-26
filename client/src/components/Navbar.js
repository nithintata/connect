import React, {useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const NavBar = () => {
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()
  const renderList = () => {
    if (state) {
      return [
        <li><Link to="/myfeed">My Feed</Link></li>,
        <li><Link to="/profile">Profile</Link ></li>,
        <li><Link to="/create-post">Create Post</Link ></li>,
        <li>
          <button className = "btn " onClick = {() => {
            localStorage.clear()
            dispatch({type: "CLEAR"})
            M.toast({html: "Logged out Successfully", classes: "#43a047 green darken-1"})
            history.push('/signin')

          }}> Logout </button>
        </li>
      ]
    }
    else {
      return [
        <li><Link to="/signin">Signin</Link ></li>,
        <li><Link to="/signup">Signup</Link ></li>
      ]
    }
  }


  return (
    <nav>
    <div className="nav-wrapper white">
      <Link to= {state ? "/" : "/signin"} className="brand-logo myfont left">Connect</Link >
      <ul id="nav-mobile" className="right">
        {renderList()}
      </ul>
    </div>
  </nav>
  )
}

export default NavBar
