import React,{useEffect, createContext, useReducer, useContext} from 'react';
import NavBar from './components/Navbar'
import "./App.css"
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom'
import Home from './components/screens/Home'
import Profile from './components/screens/Profile'
import Signin from './components/screens/Signin'
import Signup from './components/screens/Signup'
import CreatePost from './components/screens/CreatePost'
import UserProfile from './components/screens/UserProfile'
import MyFeed from './components/screens/myFeed'
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
    <Route path = "/myfeed">
      <MyFeed />
    </Route>
    <Route path = "/profile/:userId">
      <UserProfile />
    </Route>
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

    </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App;
