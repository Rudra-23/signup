if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express =require('express')
const app = express();
const expresslayouts =require('express-ejs-layouts')
const mongoose =require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport =require('passport')

require('./passport') (passport)
//ejs

app.use(expresslayouts);
app.set('view engine','ejs');

//bodyparser

app.use(express.urlencoded({extended:false}));


//session 

app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );


app.use(passport.initialize());
app.use(passport.session());

app.use(flash())

//global var middleware

app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });
  
//mongodb

mongoose.connect(process.env.DATABASE_URL,
{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
const db= mongoose.connection
db.on('error',error=>console.error(error));
db.once('open',()=>console.log('connected to db'))

//routes 

app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log('server is running!');
})

