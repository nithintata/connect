import React, {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
  const history = useHistory()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState(undefined)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (url) {
      uploadFields()
    }
  }, [url])

  const uploadPic = ()=>{
       const data = new FormData()
       data.append("file",image)
       data.append("upload_preset","connect")
       data.append("cloud_name","nithin")
       fetch("https://api.cloudinary.com/v1_1/nithin/image/upload",{
           method:"post",
           body:data
       })
       .then(res=>res.json())
       .then(data=>{
          setUrl(data.url)
       })
       .catch(err=>{
           console.log(err)
       })
   }

   const uploadFields = () => {
     if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
          setIsLoading(false)
          M.toast({html: "invalid email!",classes:"#c62828 red darken-3"})
          return
      }

     fetch("users/signup", {
       method: "post",
       headers: {
         "Content-Type" : "application/json"
       },
       body: JSON.stringify({
         name: name,
         password : password,
         email: email,
         pic: url
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


  const PostData = () => {
    setIsLoading(true)
    if(image) {
      uploadPic()
    }
    else {
      uploadFields()
    }
  }

  return (
    <>
    {
      !isLoading ?

      <div className = "mycard">
      <div className = "card auth-card">
        <h3 className =  "myfont"> Connect </h3>
        <input type = "text" placeholder = "Name" value={name} onChange = {(e) => setName(e.target.value)} autoFocus required />
        <input type = "text" placeholder = "Email" value={email} onChange = {(e) => setEmail(e.target.value)} required />
        <input type = "password" placeholder = "Password" value={password} onChange = {(e) => setPassword(e.target.value)} required />
        <div className = "file-field input-field">
        <div className = "btn">
          <span>Upload Pic</span>
          <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
        </div>
        <div className = "file-path-wrapper">
          <input className = "file-path validate" type="text" />
        </div>
      </div>
        <button className = "btn waves-effect waves-light" onClick = {() => PostData()}> Register </button>
        <h6> <Link to= "/signin"> Already have an account ? </Link></h6>
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

export default Signup
