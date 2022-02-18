const express = require("express");
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient({
  host: REDIS_URL,
  port:REDIS_PORT
})

const app = express();

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require('./config/config');

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;


const connectWithRetry=()=>{
  mongoose.connect(mongoURL
  ).then(() =>console.log('connected to db~')
  ).catch((e)=>{
    console.log(e);
    console.log('retry!!!!!!!!!!!!!!!');
    setTimeout(connectWithRetry,5000);
  });
}

connectWithRetry();

app.use(session({
  store:new RedisStore({redisClient}),
  secret:SESSION_SECRET,
  cookie: {
    secure: false,
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    maxAge: 30000

  }
}))

app.use(express.json());

const postRouter=require('./routes/postRoutes');
const userRouter=require('./routes/userRoutes');
const { REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('config/config');

app.get("/",(req,res)=>{
  res.send("<h1>hi~~~!!!!</h1>");
})

app.use('/api/v1/posts',postRouter);
app.use('/api/v1/users',userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('listening on port '+port));
