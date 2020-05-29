import React,{useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'
import {Link, useHistory} from 'react-router-dom'

const Profile = () => {
  const history = useHistory()
  const [pics, setPics] = useState([])
  const {state, dispatch} = useContext(UserContext)
  const [image, setImage] = useState("")
  const [isUploading, setIsUploading] = useState(false)

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
         fetch('/users/updatepic', {
           method: "put",
           headers: {
             "Content-Type": "application/json",
             "Authorization": "Bearer " + localStorage.getItem("jwt")
           },
           body: JSON.stringify({
             pic: data.url
           })
         }).then(res => res.json()).then(result => {
           localStorage.setItem("user", JSON.stringify({...state, pic:result.pic}))
           dispatch({type: "UPDATEPIC", payload:result.pic})
           setIsUploading(false)
         })
      })
      .catch(err=>{
          console.log(err)
      })
    }
  }, [image])

  const updatePic = (file) => {
    setIsUploading(true)
    setImage(file)
  }

  return (
    <>
     {
       !isUploading ?

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
               <img key = {item._id} className="item" onClick={() => history.push('/viewpost/'+item._id)} alt = {item.title} src = {item.photo} />
             )
           })
         }
         </div>
       </div>

       :
       <div>
       <div className="progress">
       <div className="indeterminate"></div>
       </div>
       <h5 ClassName="myfont" style={{textAlign: "center", marginTop: "100px"}}>Updating...</h5>
       </div>
     }
    </>
  )
}

export default Profile
