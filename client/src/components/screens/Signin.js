import React from 'react'
import {Link} from 'react-router-dom'

const Signin = () => {
  return (
    <div className = "mycard">
    <div class="card auth-card">
      <h3 class= "myfont"> Connect </h3>
      <input type = "text" placeholder = "Email" autofocus required />
      <input type = "password" placeholder = "Password" required />
      <button className = "btn waves-effect waves-light"> Login </button>
      <h6> <Link to= "/signup"> Don't have an account ? </Link></h6>
    </div>
    </div>
  )
}

export default Signin
