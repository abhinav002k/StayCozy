const cities=require('./cities')
const {descriptors,places}=require('./seedHelpers')
const campground=require('../models/campground')
const mongoose = require('mongoose');





mongoose.connect('mongodb://127.0.0.1:27017/campground');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const sample=(array)=>{
        return array[Math.floor(Math.random()*array.length)]
}


const seedDB= async()=>{
    await campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000=Math.floor(Math.random()*1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp=new campground({
            title:`${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image:'https://source.unsplash.com/collection/484351',
            description:'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam quae vel corrupti fugiat consequatur a possimus commodi, reprehenderit placeat laboriosam odio doloribus in voluptate, velit neque nihil. Excepturi, vero quia',
            price:price

    })
    await camp.save();
    }    
}

seedDB().then(()=>{
    mongoose.connection.close()
})