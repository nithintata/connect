import React, {useContext, useRef, useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const NavBar = () => {
  const searchModal = useRef(null)
  const [search, setSearch] = useState("")
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()

  useEffect(() => {
    M.Modal.init(searchModal.current)
  }, [])


  const renderList = () => {
    if (state) {
      return [
        <li key="1"><i data-target="modal1" className = "large material-icons modal-trigger" style={{color: "black", cursor:"pointer"}}>search</i></li>,
        <li key="2"><Link to="/myfeed">My Feed</Link></li>,
        <li key="3"><Link to="/profile">Profile</Link ></li>,
        <li key="4"><Link to="/create-post">Create Post</Link ></li>,
        <li key="5">
          <button className = "btn " onClick = {() => {
            localStorage.clear()
            dispatch({type: "CLEAR"})
            M.toast({html: "Logged out Successfully", classes: "#43a047 green darken-1"})
            history.push('/signin')

          }}> Logout </button>
        </li>
      ]
    }
    else {
      return [
        <li key="6"><Link to="/signin">Signin</Link ></li>,
        <li key="7"><Link to="/signup">Signup</Link ></li>
      ]
    }
  }


  return (
    <nav>
    <div className="nav-wrapper white">
      <Link to= {state ? "/" : "/signin"} className="brand-logo myfont left">Connect</Link >
      <ul id="nav-mobile" className="right">
        {renderList()}
      </ul>
    </div>
    <div id="modal1" className="modal" ref={searchModal} style={{color: "black"}}>
    <div className="modal-content">
      <input type = "text" placeholder="search users" value = {search}
       onChange={(e) => setSearch(e.target.value)} autoFocus />
      <ul className="collection">
         <li style={{width:"100%"}} className="collection-item">Alvin</li>
         <li style={{width:"100%"}} className="collection-item">Alvin</li>
         <li style={{width:"100%"}} className="collection-item">Alvin</li>
         <li style={{width:"100%"}} className="collection-item">Alvin</li>
       </ul>
    </div>
    <div className="modal-footer">
      <button className="modal-close waves-effect waves-green btn-flat">Agree</button>
    </div>
  </div>
  </nav>
  )
}

export default NavBar
