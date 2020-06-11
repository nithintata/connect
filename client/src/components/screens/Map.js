import React, {useState, useContext, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { renderToStaticMarkup } from 'react-dom/server';
import { Icon, divIcon } from "leaflet";
import L from "leaflet"
import socketIOClient from "socket.io-client";

const moment = require('moment')
const ENDPOINT = "https://connect-in.herokuapp.com";
//const ENDPOINT = "http://localhost:5000";

const MyMap = () => {
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [lat, setLat] = useState(undefined)
  const [lng, setLng] = useState(undefined)

  const user = JSON.parse(localStorage.getItem("user"))

  var redIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

  var blueIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });


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
        pic: user.pic,
        time: new Date()
      })
      socket.emit('add_user', new_user)

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
            <Marker position={[item.lat, item.lng]} key={item._id} icon={item._id == user._id ? redIcon : blueIcon}>
              <Popup>
              <span style={{padding: "3px"}}>
                <Link to={item._id == user._id ? "/profile" : "/profile/"+item._id} >
                <img src = {item.pic} style={{width: "25px", height: "25px", borderRadius: "50%"}} />

               <span style={{fontSize: "0.8rem", lineHeight: "110%", padding:"1px", fontWeight: "600", marginTop: "3px"}}>{item.name}</span>
               </Link><br />
               <span style={{fontSize: "0.7rem", lineHeight: "110%", padding:"1px"}}>{moment(item.time).utcOffset("+05:30").fromNow()}</span>
             </span>

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
