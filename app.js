const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const session=require('express-session');
const flash=require('connect-flash');
//models
const Campground = require('./models/campground');
const Review = require('./models/review.js');
const User= require('./models/user.js');
//models
const ejsMate = require('ejs-mate')
const Joi=require('joi');
const ExpressError = require('./utils/ExpressError');
const passport=require('passport')
const LocalStrategy=require('passport-local')



//requiring campground routes & reivew routes & user routes
const campgroundRoutes=require('./routes/campgrounds.js')
const reviewRoutes=require('./routes/reviews.js')
const userRoutes=require('./routes/users.js')


const methodOverride = require('method-override')
app.use(methodOverride('_method'))
//serving public files
app.use(express.static(path.join(__dirname, 'public')))



mongoose.connect('mongodb://127.0.0.1:27017/campground');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//parsing the form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}

//session and flash 
app.use(session(sessionConfig))
app.use(flash())

//passport for auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    // console.log(req.session);
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error');
    next();
})

//defining campground & Review routes middleware
app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)

app.get('/', (req, res) => {
    res.render('home')
})







app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500} = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error',{err})
})



app.listen(3000, () => {
    console.log("listening to port 3000")
})