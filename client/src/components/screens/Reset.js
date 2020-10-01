import React, {useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Reset = () => {
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const PostData = () => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
         setIsLoading(false)
         M.toast({html: "invalid email!",classes:"#c62828 red darken-3"})
         return
     }
    setIsLoading(true)
    fetch("users/reset-password", {
      method: "post",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        email: email
      })
    }).then(res => res.json()).then(data => {
      setIsLoading(false)
      if (data.error) {
         M.toast({html: data.error, classes: "#c62828 red darken-3"})
      }
      else {
        M.toast({html: data.message, classes: "#43a047 green darken-1"})
        history.push('/signin')
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
        <button style={{marginTop: "10px"}} className = "btn waves-effect waves-light" onClick = {() => PostData()}> Reset password </button>
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

export default Reset
