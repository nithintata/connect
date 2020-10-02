[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Javascript](https://img.shields.io/badge/NodeJs-12.15.0-yellow.svg)
# Connect
A social networking web app made using MERN Stack. Here users will be able to post their memories, like, comment and follow other users and posts.

<h3> Technologies Used </h3>
<ul>
<li>NodeJs</li>
<li>Express</li>
<li>MongoDb</li>
<li>ReactJs</li>
<li>MaterialUI</li>
</ul>

<h3>Key Features</h3>
<ul>
<li>User Authentication -- using bcrypt library to hash passwords</li>
<li>GeoLocating users -- using HTML5 GeoLocating API</li>
<li>Push Notifications -- using WebPush and Service Workers</li>
</ul>

<h3>Implementation</h3>
<ul>
<li>The database schema for the web app is located at <b><a href="models/">models/</a></b> folder</li>
<li>The implementation of all the REST API end points can be found in <b><a href="routes/">routes/</a></b> folder</li>
<li>The implementation of authorization step can be found in <b><a href = "authenticate.js">authenticate.js</a></b> file in the root folder</li>
<li>All the client side development can be found in <b><a href="client/">client/</a></b> folder</li>
<li>Used Socket.io library for real time communication between client and server to display users locations on map</li>
</ul>

<h3><u>Deployment steps</u></h3><br>
<ul>
<li>Clone the entire repository to a new folder on desktop</li>
<li>Open the command prompt from the same folder and type <b>npm install</b>. This will download all the required dependencies which are present in <b><a href="package.json/">package.json</a></b> file</li>
<li>Now open the mongodb terminal and create a new database named User. All the data of users and posts will be stored here.</li>
<li>For doing unit tests type the command <b>npm run test</b>. This will do the unit tests on different end points for sanity checking.</li>
<li>To start the server enter the command <b>npm start</b></li>
</ul>
