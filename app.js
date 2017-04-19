var express = require('express');
var path = require('path');
var config = require('./config.js');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var LocalStrategy = require('passport-local').Strategy;
var index = require('./routes/index');
var users = require('./routes/users');
var User = require('./models/user');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passportSocketIo = require("passport.socketio");

//var chatSerever = require('./chat_server');
var app = express();
var sessionStore = new MongoStore({
      url: 'mongodb://localhost/sessions',
      port: 27017
    });


mongoose.connect(config.mongoDB.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to mongodb");
});


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));

//passport
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/', index);
app.use('/users', users)

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


var http = require('http').Server(app);
var io = require('socket.io')(http);


io.on('connection', function(socket){


    let cookies = cookie.parse(socket.handshake.headers.cookie);
    let sid = cookieParser.signedCookie(cookies['sid'], 'tasmanialDeywool');

    sessionStore.get(sid, (err, session)=>{
        if(err)
        {

        }
        else{
            socket.user = session.passport.user;
            console.log(session.passport.user)
        }
    });

  socket.on('ge...tUser', ()=>{
   
    socket.emit('user', socket.user);
  })

  console.log('a user connected');
});





io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,       // the same middleware you registrer in express
  key:          'sid',       // the name of the cookie where express/connect stores its session_id
  secret:       'tasmanialDeywool',    // the session_secret to parse the cookie
  store:        sessionStore,        // we NEED to use a sessionstore. no memorystore please
  success:      onAuthorizeSuccess,  // optional callback on success - read more below
  fail:         onAuthorizeFail     // optional callback on fail/error - read more below
}));






function onAuthorizeSuccess(data, accept){
  console.log('successful connection to socket.io');
 
  // The accept-callback still allows us to decide whether to 
  // accept the connection or not. 
  accept(null, true);
 
  // OR 
 
  // If you use socket.io@1.X the callback looks different 
  accept();
}

function onAuthorizeFail(data, message, error, accept){
  if(error)
    throw new Error(message);
  console.log('failed connection to socket.io:', message);
 
  // We use this callback to log all of our failed connections. 
  accept(null, false);
 
  // OR 
 
  // If you use socket.io@1.X the callback looks different 
  // If you don't want to accept the connection 
  if(error)
    accept(new Error(message));
  // this error will be sent to the user as a special error-package 
  // see: http://socket.io/docs/client-api/#socket > error-object 
}


http.listen(3000, function(){
  console.log('listening on port:3000');
});