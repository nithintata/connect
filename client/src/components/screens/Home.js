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

  const addtoFav = (postId) => {
    fetch('/users/addtofav', {
      method: "put",
      headers: {
        "Content-Type" : "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: postId
      })
    }).then(res => res.json()).then(result => {
      dispatch({type: "UPDATEFAV", payload:{favourites: result.favourites}})
      localStorage.setItem("user", JSON.stringify(result))
    })
  }

  const removefromFav = (postId) => {
    fetch('/users/removefromfav', {
      method: "put",
      headers: {
        "Content-Type" : "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId: postId
      })
    }).then(res => res.json()).then(result => {
      dispatch({type: "UPDATEFAV", payload:{favourites: result.favourites}})
      localStorage.setItem("user", JSON.stringify(result))
    })
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
                <div>
                   <div style={{float: "left", padding: "10px"}}>
                     <Link to={item.postedBy._id == state._id ? "/profile" : "/profile/"+item.postedBy._id} >
                     <img src = {item.postedBy.pic} style={{width: "30px", height: "30px", borderRadius: "50%"}} />
                     </Link>
                   </div>
                   <div style={{float: "left"}}>
                    <div style={{fontSize: "1rem", lineHeight: "110%", padding:"2px", fontWeight: "600", marginTop: "5px"}}>{item.postedBy.name}</div>
                    <div style={{fontSize: "1rem", lineHeight: "110%", padding:"2px"}}>{moment(item.createdAt).utcOffset("+05:30").fromNow()} <i className = "tiny material-icons">public</i></div>
                  </div>
                  <div>{item.postedBy._id == state._id
                       && <span style = {{float: "right", marginTop: "10px"}}><Link style = {{float: "right"}} to = {"/update-post/" + item._id}><i className = "material-icons" style={{cursor:"pointer"}}>edit</i></Link>
                       <i className = "material-icons" style={{cursor:"pointer"}} onClick = {() => {deletePost(item._id)}}>delete</i></span>}
                  </div>
              </div>

              <div className = "card-image">
                <img src = {item.photo} onDoubleClick={() => {
                  state && state.favourites.includes(item._id)
                   ? removefromFav(item._id)
                   : addtoFav(item._id)
                }}/>
              </div>
              <div className = "card-content">
              {state && state.favourites.includes(item._id)
               ? <i className = "material-icons" style = {{color:"red", cursor:"pointer"}} onClick = {() => {removefromFav(item._id)}}>favorite</i>
               : <i className = "material-icons" style = {{color:"red", cursor:"pointer"}} onClick = {() => {addtoFav(item._id)}}>favorite_border</i>
              }

              {item.likes.includes(state._id)
              ? <i className = "material-icons" style={{cursor:"pointer", color: "blue"}} onClick = {() => {unlikePost(item._id)}}>thumb_up</i>
              : <i className = "material-icons" style={{cursor:"pointer"}} onClick = {() => {likePost(item._id)}}>thumb_up</i>
              }
                <h6>{item.likes.length} likes. {item.comments.length} comments</h6>
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
