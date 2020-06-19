import React,{useEffect, createContext, useReducer, useContext} from 'react';
import NavBar from './components/Navbar'
import Footer from './components/Footer'
import "./App.css"
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import Signin from './components/screens/Signin'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import UpdatePost from './components/screens/UpdatePost'
import MyFeed from './components/screens/myFeed'
import ViewPost from './components/screens/ViewPost'
import Reset from './components/screens/Reset'
import Map from './components/screens/Map'
import NotFound from './components/screens/404'
import UpdatePassword from './components/screens/Newpassword'
import {reducer, initialState} from './reducers/userReducer'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({type: "USER", payload: user})
    }
    else {
      if (!history.location.pathname.startsWith('/reset'))
        history.push('/signin')
    }
  }, [])
  return (
    <Switch>
    <Route exact path = "/">
      <Home />
    </Route>
    <Route path = "/signin">
      <Signin />
    </Route>
    <Route path = "/signup">
      <Signup />
    </Route>
    <Route exact path = "/profile">
      <Profile />
    </Route>
    <Route path = "/create-post">
      <CreatePost />
    </Route>
    <Route path = "/update-post/:postId">
      <UpdatePost />
    </Route>
    <Route path = "/myfeed">
      <MyFeed />
    </Route>
    <Route path = "/map">
      <Map />
    </Route>
    <Route path = "/viewpost/:postId">
      <ViewPost />
    </Route>
    <Route path = "/profile/:userId">
      <UserProfile />
    </Route>
    <Route exact path = "/reset">
      <Reset />
    </Route>
    <Route path = "/reset/:token">
      <UpdatePassword />
    </Route>
    <Route component={NotFound} />
    </Switch>
  )
}


function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value = {{state, dispatch}}>
    <BrowserRouter>
      <NavBar />
      <Routing />
      <Footer />
    </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App;
