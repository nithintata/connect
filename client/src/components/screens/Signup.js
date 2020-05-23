import React from 'react'
import {Link} from 'react-router-dom'

const Signup = () => {
  return (
    <div className = "mycard">
    <div className = "card auth-card">
      <h3 className =  "myfont"> Connect </h3>
      <input type = "text" placeholder = "Name" autoFocus required />
      <input type = "text" placeholder = "Email" required />
      <input type = "password" placeholder = "Password" required />
      <button className = "btn waves-effect waves-light"> Register </button>
      <h6> <Link to= "/signin"> Already have an account ? </Link></h6>
    </div>
    </div>
  )
}

export default Signup
