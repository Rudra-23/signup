const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/Users')
const bcrypt = require('bcryptjs')

//login
router.get('/login',(req,res)=>{
    res.render('login.ejs')
})

//register
router.get('/register',(req,res)=>{
    res.render('register.ejs')
})

router.post('/register',(req,res)=>{
    errors=[]
    const {name,email,password,password2} =req.body
    if(!name || !email || !password || !password2) {
        errors.push({msg:"Please fill all the fields!"})
    }
    if(password != password2) {
        errors.push({msg:"Passwords don't match!"})
    }
    if(password.length <=5) {
        errors.push({msg:"Length of password is short!"})
    }
    if (errors.length > 0) {
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } 
      else {
        User.findOne({ email: email }).then(user => {
          if (user) {
            errors.push({ msg: 'Email already exists' });
            res.render('register', {
              errors,
              name,
              email,
              password,
              password2
            });
          } else {
            const newUser = new User({
              name,
              email,
              password
            });
    
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                  .save()
                  .then(user => {
                    req.flash(
                      'success_msg',
                      'You are now registered and can log in'
                    );
                    res.redirect('/users/login');
                  })
                  .catch(err => console.log(err));
              });
            });
          }
        });
      }

})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports =router;