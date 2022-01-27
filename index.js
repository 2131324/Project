const express = require('express')
const app = express()
const mongoose = require('mongoose')
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

const route = require('./routes/route')

const PORT = process.env.PORT || 8800

var store = new MongoDBStore({
  uri: 'mongodb+srv://admin:admin123@cluster0.pvrrp.mongodb.net/project?retryWrites=true&w=majority',
  collection: 'sessions'
});

app.use(require('express-session')({
  secret: 'This is a secret',
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 Week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));

app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))

app.set('view engine','ejs')
app.set('views','views')

app.use('/',route)

app.get('*',(req,res) => { 
  res.send('<h1>Page Not Found</h1>') 
})



mongoose 
        .connect('mongodb+srv://admin:admin123@cluster0.pvrrp.mongodb.net/project?retryWrites=true&w=majority')
        .then(() => {
          app.listen(PORT,() => {
            console.log('Database Connected');
            console.log('Server Connected at 8900');
          })
        })
        .catch((err) => {
          console.log("Some Error");
          console.log(err);
        })
