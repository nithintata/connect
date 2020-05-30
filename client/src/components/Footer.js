import React, {useContext, useRef, useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'


const Footer = () => {
  const {state, dispatch} = useContext(UserContext)

  return (
    <>
   {  state ?
    <footer className="myfooter show-on-medium-and-down hide-on-large-only">
      <div className="container">
        <div className= "row myrow">
          <Link className="flink waves-effect waves-teal" to = {'/'}><i className="material-icons">home</i></Link>
          <Link className="flink waves-effect waves-teal" to = {'/'}>
          <i data-target="modal1" className = "material-icons modal-trigger" >search</i></Link>
          <Link className="flink waves-effect waves-teal" to = {'/create-post'}><i className="material-icons">add_a_photo</i></Link>
          <Link className="flink waves-effect waves-teal" to = {'/myfeed'}><i className="material-icons">rss_feed</i></Link>
          <Link className="flink waves-effect waves-teal" to = {'/profile'}><i className="material-icons">account_circle</i></Link>
        </div>
      </div>
    </footer>
    :
    ""
  }
    </>
  )
}

export default Footer
