import React, {useContext, useRef, useEffect, useState} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'


const Footer = () => {


  return (
    <footer className="myfooter show-on-medium-and-down hide-on-large-only">
      <div class="container">
        <div class= "row myrow">
          <Link class="flink waves-effect waves-teal" to = {'/'}><i class="material-icons">home</i></Link>
          <Link class="flink waves-effect waves-teal" to = {'/'}>
          <i data-target="modal1" className = "material-icons modal-trigger" >search</i></Link>
          <Link class="flink waves-effect waves-teal" to = {'/create-post'}><i class="material-icons">add_a_photo</i></Link>
          <Link class="flink waves-effect waves-teal" to = {'/myfeed'}><i class="material-icons">rss_feed</i></Link>
          <Link class="flink waves-effect waves-teal" to = {'/profile'}><i class="material-icons">account_circle</i></Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer
