import React,{useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'

const Profile = () => {
  const [pics, setPics] = useState([])
  const {state, dispatch} = useContext(UserContext)
  useEffect(() => {
    fetch('/posts/myposts', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")      }
    }).then(res => res.json())
    .then(result => {
      setPics(result)
    })
  }, [])
  return (
    <div style = {{maxWidth: "650px", margin: "0px auto"}}>
      <div style = {{
        display: "flex",
        justifyContent: "space-around",
        margin: "18px 0px",
        borderBottom: "1px solid gray"
      }}>
        <div>
        <img style = {{width: "160px", height: "160px", borderRadius: "50%"}}
        src = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTkYHfs9m5fwgnQgDRyKtB65bLFFsIlgeFwFvSvzFvGERwo1-s2&usqp=CAU"
        />
        </div>

        <div>
        <h4>{state ? state.name : "Loading.."}</h4>
        <div style = {{display: "flex",justifyContent: "space-between", width: "108%"}}>
          <h6>{pics.length} posts</h6>
          <h6>30 followers</h6>
          <h6>20 following</h6>
        </div>
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
