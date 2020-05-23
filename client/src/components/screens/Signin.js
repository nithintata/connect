import React, {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signin = () => {
  const history = useHistory()
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const PostData = () => {
    fetch("users/signin", {
      method: "post",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        password : password,
        email: email
      })
    }).then(res => res.json()).then(data => {
      console.log(data)
      if (data.error) {
         M.toast({html: data.error, classes: "#c62828 red darken-3"})
      }
      else {
        M.toast({html: "Login Success", classes: "#43a047 green darken-1"})
        history.push('/')
      }
    }).catch((err) => console.log(err))
  }

  return (
    <div className = "mycard">
    <div className = "card auth-card">
      <h3 className =  "myfont"> Connect </h3>
      <input type = "text" placeholder = "Email" value={email} onChange = {(e) => setEmail(e.target.value)} autoFocus required />
      <input type = "password" placeholder = "Password" value={password} onChange = {(e) => setPassword(e.target.value)} required />
      <button className = "btn waves-effect waves-light" onClick = {() => PostData()}> Login </button>
      <h6> <Link to= "/signup"> Don't have an account ? </Link></h6>
    </div>
    </div>
  )
}

export default Signin
