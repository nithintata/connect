import React,{useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const {state, dispatch} = useContext(UserContext)
  const{userId} = useParams()
  useEffect(() => {
    fetch(`/users/${userId}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")      }
    }).then(res => res.json())
    .then(result => {
      setProfile(result)
    })
  }, [])
  return (
    <>
    {profile ?

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
          <h4>{profile.user.name}</h4>
          <h5>{profile.user.email}</h5>
          <div style = {{display: "flex",justifyContent: "space-between", width: "108%"}}>
            <h6>{profile.posts.length} posts</h6>
            <h6>30 followers</h6>
            <h6>20 following</h6>
          </div>
          </div>

        </div>

        <div className="gallery">
        {
          profile.posts.map(item => {
            return (
              <img key = {item._id} className="item" alt = {item.title} src = {item.photo} />
            )
          })
        }
        </div>
      </div>

      : <h2 className = "myfont"> Loading ...</h2>}

    </>
  )
}

export default Profile
