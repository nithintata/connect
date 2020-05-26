import React,{useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'

const Profile = () => {
  const [pics, setPics] = useState([])
  const {state, dispatch} = useContext(UserContext)
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")

  useEffect(() => {
    fetch('/posts/myposts', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")      }
    }).then(res => res.json())
    .then(result => {
      setPics(result)
    })
  }, [])

  useEffect(() => {
    if (image) {
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
         console.log(data)
         localStorage.setItem("user", JSON.stringify({...state, pic:data.url}))
         dispatch({type: "UPDATEPIC", payload:data.url})
      })
      .catch(err=>{
          console.log(err)
      })
    }
  }, [image])

  const updatePic = (file) => {
    setImage(file)

  }

  return (
    <div style = {{maxWidth: "650px", margin: "0px auto"}}>
      <div style = {{
        display: "flex",
        justifyContent: "space-around",
        margin: "18px 10px 0px 0px",
      }}>
        <div>
        <img style = {{width: "160px", height: "160px", borderRadius: "50%"}}
        src = {state ? state.pic: "loading.."}
        />
        </div>

        <div>
        <h4>{state ? state.name : "Loading.."}</h4>
        <h5>{state ? state.email : "Loading.."}</h5>
        <div style = {{display: "flex",justifyContent: "space-between", width: "108%"}}>
          <h6>{pics.length} posts</h6>
          <h6>{state ? state.followers.length : "0"} followers</h6>
          <h6>{state ? state.following.length : "0"} following</h6>
        </div>
        </div>

      </div>
      <div className = "file-field input-field">
      <div className = "btn">
        <span>Update</span>
        <input type="file" onChange={(e)=>updatePic(e.target.files[0])} />
      </div>
      <div className = "file-path-wrapper">
        <input className = "file-path validate" type="text" />
      </div>
      </div>

      <div className="gallery">
      {
        pics.map(item => {
          return (
            <img key = {item._id} className="item" alt = {item.title} src = {item.photo} />
          )
        })
      }
      </div>
    </div>
  )
}

export default Profile
