var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const config = require('./config/config');
const PORT = process.env.PORT || 5000;

const Users = require('./models/users');
const Posts = require('./models/posts');
const Notifications = require('./models/notifications')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var pushRouter = require('./routes/notifications');

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then((db) => {
  console.log('Connected to server');
}, (err) => {console.log(err);});

var app = express();
const Http = require("http").createServer(app);
const io = require("socket.io")(Http);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());



//app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/notifications', pushRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  })
}


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

Http.listen(PORT, () => {
  console.log("Server running on ", PORT);
})

var users = [];
var userIds = []

io.on('connection', (socket) => {
    socket.on('add_user', (user) => {
        var new_user = JSON.parse(user)
        if (userIds.includes(new_user._id)) {
           objIndex = users.findIndex((obj => obj._id == new_user._id));
           users[objIndex].lat = new_user.lat;
           users[objIndex].lng = new_user.lng;
           users[objIndex].time = new_user.time;
           console.log("Location updated")
        }
        else {
          socket._id = new_user._id;
          users.push(new_user);
          userIds.push(new_user._id);
        }
        console.log(users.length);
        console.log(users);
        io.emit('user_data', users);
    });

    socket.on('disconnect', () => {

        for (var i = 0; i < users.length; i++)
            if (users[i]._id === socket._id) {
                users.splice(i, 1);
                break;
            }

        for (var i = 0; i < userIds.length; i++)
            if (userIds[i] === socket._id) {
                userIds.splice(i, 1);
                break;
             }

        var new_count = users.length;
        console.log(new_count);
        console.log('remove marker');
        io.emit('user_data', users);
    });
});

module.exports = app;
