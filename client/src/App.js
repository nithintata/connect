import React from 'react';
import NavBar from './components/Navbar'
import "./App.css"
import {BrowserRouter, Route} from 'react-router-dom'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import Signin from './components/screens/Signin'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Route exact path = "/">
        <Home />
      </Route>
      <Route path = "/signin">
        <Signin />
      </Route>
      <Route path = "/signup">
        <Signup />
      </Route>
      <Route path = "/profile">
        <Profile />
      </Route>
      <Route path = "/create-post">
        <CreatePost />
      </Route>
    </BrowserRouter>
  )
}

export default App;
