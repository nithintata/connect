import React,{useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const {state, dispatch} = useContext(UserContext)
  const{userId} = useParams()
  const [showFollow, setShowFollow] = useState(state ? !state.following.includes(userId):true)
  useEffect(() => {
    fetch(`/users/${userId}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")      }
    }).then(res => res.json())
    .then(result => {
      setProfile(result)
    })
  }, [])

  const follow = () => {
    fetch('/users/follow', {
      method: "put",
      headers: {
        "Content-Type" : "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        followId: userId
      })
    }).then(res => res.json()).then(data => {
      dispatch({type: "UPDATE", payload:{following:data.following, followers: data.followers}})
      localStorage.setItem("user", JSON.stringify(data))
      setProfile((prevState) => {
        return {
          ...prevState,
          user:{...prevState.user, followers: [...prevState.user.followers, data._id]}
        }
      })
      setShowFollow(false)
    })
  }


  const unfollow = () => {
    fetch('/users/unfollow', {
      method: "put",
      headers: {
        "Content-Type" : "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        unfollowId: userId
      })
    }).then(res => res.json()).then(data => {
      dispatch({type: "UPDATE", payload:{following:data.following, followers: data.followers}})
      localStorage.setItem("user", JSON.stringify(data))
      setProfile((prevState) => {
        const newFollowers = prevState.user.followers.filter(item => item != data._id)
        return {
          ...prevState,
          user:{...prevState.user, followers: newFollowers}
        }
      })
      setShowFollow(true)
    })
  }

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
          src = {profile.user.pic}/>
          </div>

          <div>
          <h4>{profile.user.name}</h4>
          <h5>{profile.user.email}</h5>
          <div style = {{display: "flex",justifyContent: "space-between", width: "108%"}}>
            <h6>{profile.posts.length} posts</h6>
            <h6>{profile.user.followers.length} followers</h6>
            <h6>{profile.user.following.length} following</h6>
          </div>
          {
            showFollow ?
            <button style = {{margin: "10px"}} className = "btn waves-effect waves-light" onClick = {() => follow()}> Follow </button>
            : <button style = {{margin: "10px"}} className = "btn waves-effect waves-light" onClick = {() => unfollow()}> unFollow </button>
          }

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

      :
      <div className="progress">
      <div className="indeterminate"></div>
      </div>
      }

    </>
  )
}

export default Profile
