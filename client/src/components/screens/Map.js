import React, {useState, useContext, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import socketIOClient from "socket.io-client";

const moment = require('moment')
const ENDPOINT = "https://connect-in.herokuapp.com";

const MyMap = () => {
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [lat, setLat] = useState(undefined)
  const [lng, setLng] = useState(undefined)

  const user = JSON.parse(localStorage.getItem("user"))


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(getPosition, error, {enableHighAccuracy: true});
    }

    function error(err) {
       console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    function getPosition(position) {
      setLat(position.coords.latitude)
      setLng(position.coords.longitude)

      console.log(position.coords.latitude, position.coords.longitude)

    }
  }, [])

  useEffect(() => {
    if (lat && lng) {
      setIsLoading(false)
      const socket = socketIOClient(ENDPOINT);
      const new_user = JSON.stringify({
        _id: user._id,
        name: user.name,
        lat: lat + (Math.random()*0.001),
        lng: lng + (Math.random()*0.001),
        time: new Date()
      })
      socket.emit('add_user', new_user)

      socket.emit('load_init', "")

      socket.on('user_data', (users) => {
        setUsers(users)
        console.log("Working: " + users.length)
      })
    }
  }, [lat, lng]);



  return (
    <>
    {
      !isLoading ?

      <Map center={[lat, lng]} zoom={12}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='Nithin'
      />

      {
        users.map(item => {
          return (
            <Marker position={[item.lat, item.lng]} key={item._id} >
              <Popup>
                <span>{item.name}</span><br />
                <span>{moment(item.time).utcOffset("+05:30").fromNow()}</span>
              </Popup>
            </Marker>
          )
        })
      }

    </Map>

      :

      <div>
       <h4 style={{textAlign: "center", marginTop: "10px"}}> Please enable your location to see the map</h4>
      </div>
    }
    </>
  )
}

export default MyMap
