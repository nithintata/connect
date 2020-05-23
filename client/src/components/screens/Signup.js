import React, {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
  const history = useHistory()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const PostData = () => {
    fetch("users/signup", {
      method: "post",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        name: name,
        password : password,
        email: email
      })
    }).then(res => res.json()).then(data => {
      if (data.error) {
         M.toast({html: data.error, classes: "#c62828 red darken-3"})
      }
      else {
        M.toast({html: data.message, classes: "#43a047 green darken-1"})
        history.push('/signin')
      }
    })
  }
  return (
    <div className = "mycard">
    <div className = "card auth-card">
      <h3 className =  "myfont"> Connect </h3>
      <input type = "text" placeholder = "Name" value={name} onChange = {(e) => setName(e.target.value)} autoFocus required />
      <input type = "text" placeholder = "Email" value={email} onChange = {(e) => setEmail(e.target.value)} required />
      <input type = "password" placeholder = "Password" value={password} onChange = {(e) => setPassword(e.target.value)} required />
      <button className = "btn waves-effect waves-light" onClick = {() => PostData()}> Register </button>
      <h6> <Link to= "/signin"> Already have an account ? </Link></h6>
    </div>
    </div>
  )
}

export default Signup
