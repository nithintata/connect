import React,{useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'
import M from 'materialize-css'
import {Link} from 'react-router-dom'
const moment = require('moment')

const Home = () => {
  const [data, setData] = useState(undefined)
  const {state, dispatch} = useContext(UserContext)
  useEffect(() => {
    fetch('/posts/all', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
    .then(result => {
      console.log(result)
      console.log(moment(result[0].updatedAt).utcOffset("+05:30").fromNow())
      setData(result)
    })
  }, [])

  const likePost = (id) => {
    fetch('/posts/like', {
      method: "put",
      headers: {
        "Content-Type" : "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json()).then(result => {
      const newData = data.map(item => {
        if (item._id == result._id) {
          return result
        }
        else {
          return item
        }
      })
      setData(newData)
    }).catch(err => console.log(err))
  }

  const unlikePost = (id) => {
    fetch('/posts/unlike', {
      method: "put",
      headers: {
        "Content-Type" : "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json()).then(result => {
      const newData = data.map(item => {
        if (item._id == result._id) {
          return result
        }
        else {
          return item
        }
      })
      setData(newData)
    }).catch(err => console.log(err))
  }

  const postComment = (text, postId) => {
    fetch('/posts/comment', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId:postId,
        text: text
      })
    }).then(res => res.json()).then(result => {
      const newData = data.map(item => {
        if (item._id == result._id) {
          return result
        }
        else {
          return item
        }
      })
      setData(newData)
    }).catch(err => console.log(err))
  }

  const deletePost = (postId) => {
    fetch(`/posts/deletepost/${postId}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
    .then(result => {
      console.log(result)
      const newData = data.filter(item => {
        return item._id !== result._id
      })
      setData(newData)
      M.toast({html: "Deleted Successfully", classes: "#43a047 green darken-1"})
    })
  }

  const deleteComment = (postId, commentId) => {
    fetch(`/posts/${postId}/comments/${commentId}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
    .then(result => {
      const newData = data.map(item => {
        if (item._id == result._id) {
          return result
        }
        else {
          return item
        }
      })
      setData(newData)
      M.toast({html: "Comment Deleted Successfully", classes: "#43a047 green darken-1"})
    })
  }

  return (
    <>
    {
      data ?

      <div className = "home">{
        data.map(item => {
          return (
            <div className = "card home-card" key = {item._id}>
              <h5 style={{padding: "5px"}}><Link to = {item.postedBy._id == state._id ? "/profile" : "/profile/"+item.postedBy._id} >
               <img src = {item.postedBy.pic} style = {{width: "30px", height: "30px", borderRadius: "50%"}} /> {item.postedBy.name}</Link> {item.postedBy._id == state._id
              && <span style = {{float: "right"}}><Link style = {{float: "right"}} to = {"/update-post/" + item._id}><i className = "material-icons" style={{cursor:"pointer"}}>edit</i></Link>
                <i className = "material-icons" style={{cursor:"pointer"}} onClick = {() => {deletePost(item._id)}}>delete</i></span>}</h5>
              <div className = "card-image">
                <img src = {item.photo} />
              </div>
              <div className = "card-content">
              <i className = "material-icons" style = {{color:"red"}}>favorite</i>
              {item.likes.includes(state._id)
              ? <i className = "material-icons" style={{cursor:"pointer"}} onClick = {() => {unlikePost(item._id)}}>thumb_down</i>
              : <i className = "material-icons" style={{cursor:"pointer"}} onClick = {() => {likePost(item._id)}}>thumb_up</i>
              }
                <h6>{item.likes.length} likes</h6>
                <h5>{item.title}</h5>
                <p>{item.body}</p>
                <form onSubmit = {(e) => {
                  e.preventDefault()
                  postComment(e.target[0].value, item._id)
                }}>
                  <input type = "text" placeholder = "comment on this post" />
                </form>
                {
                  item.comments.length >= 1 ?
                      <h6 key={item.comments[0]._id}><span style = {{fontWeight: "500"}}>{item.comments[0].postedBy.name} : </span> {item.comments[0].text}
                      {item.comments[0].postedBy._id == state._id
                      && <i className = "tiny material-icons" style = {{color:"red", cursor:"pointer"}} onClick = {() => {deleteComment(item._id, item.comments[0]._id)}}>delete</i>}</h6>
                    :
                    ""
                }
                {
                  item.comments.length >= 1 ?
                      <Link style={{paddingTop: "5px"}} to = {"/viewpost/"+item._id}>View all {item.comments.length} comments</Link>
                    :
                    ""
                }


              </div>
            </div>
          )
        })
      }
      </div>

      :

      <div className="progress">
      <div className="indeterminate"></div>
      </div>
    }
    </>
  )
}

export default Home
