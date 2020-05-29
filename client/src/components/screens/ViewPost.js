import React,{useEffect, useState, useContext} from 'react'
import {UserContext} from '../../App'
import M from 'materialize-css'
import {Link, useParams, useHistory} from 'react-router-dom'

const ViewPost = () => {
  const history = useHistory()
  const [post, setPost] = useState(null)
  const {state, dispatch} = useContext(UserContext)
  const {postId} = useParams()

  useEffect(() => {
    fetch(`/posts/${postId}`, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
        "Content-Type" : "application/json"
      }
    }).then(res => res.json())
    .then(result => {
      setPost(result)
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
      setPost(result)
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
      setPost(result)
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
      setPost(result)
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
      setPost(result)
      M.toast({html: "Deleted Successfully", classes: "#43a047 green darken-1"})
      history.push('/')
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
      setPost(result)
      M.toast({html: "Comment Deleted Successfully", classes: "#43a047 green darken-1"})
    })
  }

  return (
    <>
    {
      post ?

      <div className = "card home-card" key = {post._id}>
        <h5 style={{padding: "5px"}}><Link to = {post.postedBy._id == state._id ? "/profile" : "/profile/"+post.postedBy._id} >
         <img src = {post.postedBy.pic} style = {{width: "30px", height: "30px", borderRadius: "50%"}} /> {post.postedBy.name}</Link> {post.postedBy._id == state._id
        && <span style = {{float: "right"}}><Link style = {{float: "right"}} to = {"/update-post/" + post._id}><i className = "material-icons" style={{cursor:"pointer"}}>edit</i></Link>
          <i className = "material-icons" style={{cursor:"pointer"}} onClick = {() => {deletePost(post._id)}}>delete</i></span>}</h5>
        <div className = "card-image">
          <img src = {post.photo} />
        </div>
        <div className = "card-content">
        <i className = "material-icons" style = {{color:"red"}}>favorite</i>
        {post.likes.includes(state._id)
        ? <i className = "material-icons" style={{cursor:"pointer"}} onClick = {() => {unlikePost(post._id)}}>thumb_down</i>
        : <i className = "material-icons" style={{cursor:"pointer"}} onClick = {() => {likePost(post._id)}}>thumb_up</i>
        }
          <h6>{post.likes.length} likes. {post.comments.length} comments</h6>
          <h5>{post.title}</h5>
          <p>{post.body}</p>
          <form onSubmit = {(e) => {
            e.preventDefault()
            postComment(e.target[0].value, post._id)
          }}>
            <input type = "text" placeholder = "comment on this post" autoFocus required/>
          </form>

          {
            post.comments.map(comment => {
              return (
                <h6 key={comment._id}><span style = {{fontWeight: "500"}}>{comment.postedBy.name} : </span> {comment.text}
                {comment.postedBy._id == state._id
                && <i className = "tiny material-icons" style = {{color:"red", cursor:"pointer"}} onClick = {() => {deleteComment(post._id, comment._id)}}>delete</i>}</h6>
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

export default ViewPost
