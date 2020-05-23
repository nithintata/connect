import React from 'react'

const Profile = () => {
  return (
    <div style = {{maxWidth: "650px", margin: "0px auto"}}>
      <div style = {{
        display: "flex",
        justifyContent: "space-around",
        margin: "18px 0px",
        borderBottom: "1px solid gray"
      }}>
        <div>
        <img style = {{width: "160px", height: "160px", borderRadius: "50%"}}
        src = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTkYHfs9m5fwgnQgDRyKtB65bLFFsIlgeFwFvSvzFvGERwo1-s2&usqp=CAU"
        />
        </div>

        <div>
        <h4>John wick</h4>
        <div style = {{display: "flex",justifyContent: "space-between", width: "108%"}}>
          <h6>40 posts</h6>
          <h6>30 followers</h6>
          <h6>20 following</h6>
        </div>
        </div>

      </div>

      <div className="gallery">
      <img className="item" src = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTkYHfs9m5fwgnQgDRyKtB65bLFFsIlgeFwFvSvzFvGERwo1-s2&usqp=CAU" />
      <img className="item" src = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTkYHfs9m5fwgnQgDRyKtB65bLFFsIlgeFwFvSvzFvGERwo1-s2&usqp=CAU" />
      <img className="item" src = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTkYHfs9m5fwgnQgDRyKtB65bLFFsIlgeFwFvSvzFvGERwo1-s2&usqp=CAU" />
      <img className="item" src = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTkYHfs9m5fwgnQgDRyKtB65bLFFsIlgeFwFvSvzFvGERwo1-s2&usqp=CAU" />
      <img className="item" src = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTkYHfs9m5fwgnQgDRyKtB65bLFFsIlgeFwFvSvzFvGERwo1-s2&usqp=CAU" />
      <img className="item" src = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTkYHfs9m5fwgnQgDRyKtB65bLFFsIlgeFwFvSvzFvGERwo1-s2&usqp=CAU" />
      <img className="item" src = "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTkYHfs9m5fwgnQgDRyKtB65bLFFsIlgeFwFvSvzFvGERwo1-s2&usqp=CAU" />
      </div>
    </div>
  )
}

export default Profile
