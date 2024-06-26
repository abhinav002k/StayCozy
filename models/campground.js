const mongoose = require('mongoose');
const Review = require('./review');
const { campgroundSchema } = require('../schemas.js');
const { func } = require('joi');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});

//middleware to delete campground with reviews
CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{$in:doc.reviews}
        })
    }
})
module.exports = mongoose.model('Campground', CampgroundSchema);   