import React, {useState, useEffect} from 'react'

const Home = () => {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch('/posts/all', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
    .then(result => {
      setData(result)
    })
  }, [])
  return (
    <div className = "home">{
      data.map(item => {
        return (
          <div className = "card home-card" key = {item._id}>
            <h5>{item.postedBy.name}</h5>
            <div className = "card-image">
              <img src = {item.photo} />
            </div>
            <div className = "card-content">
            <i className = "material-icons" style = {{color:"red"}}>favorite</i>
              <h5>{item.title}</h5>
              <p>{item.body}</p>
              <input type = "text" placeholder = "comment on this post" />
            </div>
          </div>
        )
      })
    }
    </div>
  )
}

export default Home
