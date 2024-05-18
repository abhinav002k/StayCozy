const express =require('express');
const router=express.Router({ mergeParams: true });

const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync=require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const {reviewSchema} = require('../schemas.js');

//joi validation 

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//review route for campground
router.post('/',validateReview,catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review=new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success','Successfully Created New Review')
    res.redirect(`/campgrounds/${campground._id}`)
}))
//delete review route for campground
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id,{$pull:{reviews:req.params.reviewId}});
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success','Successfully Deleted Review')
    res.redirect(`/campgrounds/${campground._id}`);
}))

module.exports=router;