import React,{useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'
import {useParams, useHistory} from 'react-router-dom'

const Profile = () => {
  const history = useHistory()
  const [profile, setProfile] = useState(null)
  const {state, dispatch} = useContext(UserContext)
  const{userId} = useParams()
  const user = JSON.parse(localStorage.getItem("user"))
  const [showFollow, setShowFollow] = useState(!user.following.includes(userId))
  useEffect(() => {
    fetch(`/users/${userId}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")      }
    }).then(res => res.json())
    .then(result => {
      setProfile(result)
    })
  }, [])

  function sendPush() {
    fetch(`/notifications/subscription/${userId}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: "You have a new connection",
        image: user.pic,
        text: user.name +" started following you. Tap to see his profile",
        tag: "follower",
        url: "https://connect-in.herokuapp.com/profile/" + user._id
      })

    }).then(res => res.json())
    .then(result => {
      console.log(result)
    })
  }

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
      sendPush()
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
            <h6><b>{profile.posts.length}</b> posts</h6>
            <h6><b>{profile.user.followers.length}</b> followers</h6>
            <h6><b>{profile.user.following.length}</b> following</h6>
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
              <img key = {item._id} onClick={() => history.push('/viewpost/'+item._id)} className="item" alt = {item.title} src = {item.photo} />
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
