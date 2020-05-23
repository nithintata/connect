import React, {useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
  const history = useHistory()
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")

  const postData = () => {
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "connect")
    data.append("cloud_name", "nithin")
    fetch("https://api.cloudinary.com/v1_1/nithin/image/upload", {
      method: "post",
      body: data
    })
    .then(res => res.json())
    .then(data => {setUrl(data.url)}).catch(err => {console.log(err)})

    fetch("posts/createpost", {
      method: "post",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        title,
        body,
        pic:url
      })
    }).then(res => res.json()).then(data => {
      console.log(data)
      if (data.error) {
         M.toast({html: data.error, classes: "#c62828 red darken-3"})
      }
      else {
        M.toast({html: "Posted Successfully", classes: "#43a047 green darken-1"})
        history.push('/')
      }
    }).catch((err) => console.log(err))

  }
  return (
    <div className = "card input-filed" style = {{
      margin: "10px auto",
      maxWidth: "500px",
      padding: "20px",
      textAlign: "center"
    }}>
      <input type = "text" placeholder = "Title" value ={title} onChange = {(e) => setTitle(e.target.value)} autoFocus />
      <input type = "text" placeholder = "Body" value ={body} onChange = {(e) => setBody(e.target.value)} />
      <div className = "file-field input-field">
      <div className = "btn">
        <span>Upload Image</span>
        <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
      </div>
      <div className = "file-path-wrapper">
        <input className = "file-path validate" type="text" />
      </div>
    </div>
    <button className = "btn waves-effect waves-light #64b5f6 blue darken-1" onClick={() => postData()}> Create Post </button>
    </div>
  )
}

export default CreatePost
