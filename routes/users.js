const express =require('express');
const router=express.Router();
const User = require('../models/user.js');
const catchAsync=require('../utils/catchAsync.js')
const passport=require('passport')


const { checkReturnTo } = require('../middleware');



//register route for user
router.get('/register',(req,res)=>{
    res.render('users/register')
})
router.post('/register', catchAsync(async (req, res,next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser,err=>{
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
            
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

//register route for user



//login route for user

router.get('/login',(req,res)=>{
    res.render('users/login')
})

router.post('/login', checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success','Successfully logged in😊😊')
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
})

//login route for user


//logout route for user
router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 
//logout route for user

module.exports=router;