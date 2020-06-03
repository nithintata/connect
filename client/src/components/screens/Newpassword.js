import React, {useState, useContext,} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import M from 'materialize-css'

const UpdatePassword = () => {
  const history = useHistory()
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const {token} = useParams()
  const PostData = () => {
    setIsLoading(true)
    fetch("/users/update-password", {
      method: "post",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        password : password,
        token: token
      })
    }).then(res => res.json()).then(data => {
      setIsLoading(false)
      if (data.error) {
         M.toast({html: data.error, classes: "#c62828 red darken-3"})
         history.push('/reset')
      }
      else {
        M.toast({html: data.message, classes: "#43a047 green darken-1"})
        history.push('/signin')
      }
    }).catch((err) => {
      console.log(err)
      setIsLoading(false)
    })
  }

  return (
    <>
    {
      !isLoading ?
      <div className = "mycard">
      <div className = "card auth-card">
        <h3 className =  "myfont"> Connect </h3>
        <input type = "password" placeholder = "Enter new Password" value={password} onChange = {(e) => setPassword(e.target.value)} autoFocus required />
        <button style={{marginTop: "10px"}} className = "btn waves-effect waves-light" onClick = {() => PostData()}> Update password </button>
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

export default UpdatePassword
