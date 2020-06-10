import React, {useContext, useRef, useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'

const NavBar = () => {
  const searchModal = useRef(null)
  const sideNav = useRef(null)
  const [search, setSearch] = useState("")
  const [userDetails, setUserDetails] = useState([])
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()

  useEffect(() => {
    M.Modal.init(searchModal.current)
    M.Sidenav.init(sideNav.current, {draggable: true})
  }, [])

  const fetchUsers = (query) => {
    setSearch(query)
    fetch('/users/search-users', {
      method: "post",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({query:query})
    }).then(res => res.json())
    .then(results => {
      setUserDetails(results.users)
    }).catch(err => console.log(err))
  }

  const renderList = () => {
    if (state) {
      return [
        <li key="1"><i onClick={() => M.Sidenav.getInstance(sideNav.current).close()}
        data-target="modal1" className = "material-icons modal-trigger" style={{color: "black", cursor:"pointer"}}>search</i></li>,
        <li key="2"><Link to="/myfeed" onClick={() => M.Sidenav.getInstance(sideNav.current).close()}>My Feed</Link></li>,
        <li key="3"><Link to="/profile" onClick={() => M.Sidenav.getInstance(sideNav.current).close()}>Profile</Link ></li>,
        <li key="4"><Link to="/create-post" onClick={() => M.Sidenav.getInstance(sideNav.current).close()}>Create Post</Link ></li>,
        <li key="8"><Link to="/map" onClick={() => M.Sidenav.getInstance(sideNav.current).close()}>Map</Link ></li>,
        <li key="5">
          <button className = "btn " onClick = {() => {
            localStorage.clear()
            dispatch({type: "CLEAR"})
            M.Sidenav.getInstance(sideNav.current).close()
            M.toast({html: "Logged out Successfully", classes: "#43a047 green darken-1"})
            history.push('/signin')

          }}> Logout </button>
        </li>
      ]
    }
    else {
      return [
        <li key="6"><Link to="/signin" onClick={() => M.Sidenav.getInstance(sideNav.current).close()}>Signin</Link ></li>,
        <li key="7"><Link to="/signup" onClick={() => M.Sidenav.getInstance(sideNav.current).close()}>Signup</Link ></li>
      ]
    }
  }


  return (
    <div>
    <div className="navbar-fixed">
    <nav>
    <div className="nav-wrapper white">
      <Link to= {state ? "/" : "/signin"} className="brand-logo myfont ">Connect</Link >
      <Link to ={""} className="sidenav-trigger" data-target="slide-out">
			<i className="material-icons">menu</i>
		  </Link>
      <ul id="nav-mobile" className="right hide-on-med-and-down ">
        {renderList()}
      </ul>
    </div>
    <div id="modal1" className="modal" ref={searchModal} style={{color: "black"}}>
    <div className="modal-content">
      <input type = "text" placeholder="Search users" value = {search}
       onChange={(e) => fetchUsers(e.target.value)} autoFocus />
      <ul className="collection">
         {userDetails.map(item => {
           return <Link key={item._id} to={item._id !== (state ? state._id : "0") ? "/profile/"+item._id : "/profile"} onClick = {()=>{
             M.Modal.getInstance(searchModal.current).close()
             setSearch("")
           }}><li className="collection-item avatar">
                    <img src = {item.pic} className="circle" />
                   <span className="title">{item.name}</span>
                   <p>{item.email}</p>
                  </li></Link>
         })}
       </ul>
    </div>
    <div className="modal-footer">
      <button className="modal-close waves-effect waves-green btn-flat" onClick={()=> setSearch("")}>Close</button>
    </div>
  </div>
  </nav>
 </div>

   <ul className="sidenav" id="slide-out" ref={sideNav}>
       <li><i style={{cursor:"pointer", float:"right", margin: "10px"}} className="material-icons sidenav-close">close</i></li>
 	    {renderList()}
    </ul>
</div>
  )
}

export default NavBar
