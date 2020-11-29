const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../auth')
router.get('/',(req,res)=>{
    res.render('welcome.ejs')
})

router.get('/dashboard',ensureAuthenticated,(req,res)=>{
    res.render('dashboard',{
        user:req.user
    })
})
module.exports =router;