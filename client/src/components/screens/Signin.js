import React, {useState, useContext,} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'

const Signin = () => {
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const PostData = () => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
         setIsLoading(false)
         M.toast({html: "invalid email!",classes:"#c62828 red darken-3"})
         return
     }
     
    setIsLoading(true)
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
      setIsLoading(false)
      if (data.error) {
         M.toast({html: data.error, classes: "#c62828 red darken-3"})
      }
      else {
        localStorage.setItem("jwt", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
        dispatch({type: "USER", payload: data.user})
        M.toast({html: "Login Success", classes: "#43a047 green darken-1"})
        history.push('/')
      }
    }).catch((err) => {
      setIsLoading(false)
      console.log(err)
    })
  }

  return (
    <>
    {
      !isLoading ?

      <div className = "mycard">
      <div className = "card auth-card">
        <h3 className =  "myfont"> Connect </h3>
        <input type = "text" placeholder = "Email" value={email} onChange = {(e) => setEmail(e.target.value)} autoFocus required />
        <input type = "password" placeholder = "Password" value={password} onChange = {(e) => setPassword(e.target.value)} required />
        <button className = "btn waves-effect waves-light" onClick = {() => PostData()}> Login </button>
        <h6> <Link to= "/signup"> Don't have an account ? </Link></h6>
        <h6> <Link to= "/reset"> Forgot password ? </Link></h6>
      </div>
      </div>

      :

      <div className="progress">
      <div className="indeterminate"></div>
      </div>
    }
    </>
  )
}

export default Signin
