const express = require("express")
const app= express()
const path=require("path")
const mongoose = require('mongoose');
const Campground=require('./models/campground');
const ejsMate=require('ejs-mate')



const methodOverride=require('method-override')
app.use(methodOverride('_method'))



mongoose.connect('mongodb://127.0.0.1:27017/campground');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//parsing the form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'))

app.get('/',(req,res)=>{
    res.render('home')
})



//route to display all campgrounds
app.get('/campgrounds',async(req,res)=>{
    const campgrounds =await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
})

//creating new Campgrounds
app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new')
})

app.post('/campgrounds',async(req,res)=>{
    const campground=new Campground(req.body.campground)
    await campground.save()
    res.redirect('/campgrounds')
})


//route for all details about campgrounds
app.get('/campgrounds/:id',async(req,res)=>{
    const campground=await Campground.findById(req.params.id)
    res.render('campgrounds/details',{campground})
})

//route for creating or updating
app.get('/campgrounds/:id/edit',async(req,res)=>{
    const campground=await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campground})
})
app.put('/campgrounds/:id',async(req,res)=>{
    const {id}=req.params
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
})



app.listen(3000,()=>{
    console.log("listening to port 3000")
})