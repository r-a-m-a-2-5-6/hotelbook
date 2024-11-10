const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/init.js");
const methodOverride = require("method-override");
const Review = require("../models/review.js");
const { isLoggedIn } = require("../../middlewares/middleware.js");



 //review route 
 router.post("/:id/review" , isLoggedIn,async (req,res) => {
    let {id} =req.params;
    let listing = await Listing.findById(id)
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save(); 
    req.flash("sucess","Review added sucessfully");
    res.redirect(`/listings/${id}`)
   
  })
  
  //delete review
  
  router.delete("/:id/reviews/:reviewId",isLoggedIn, wrapAsync(async (req,res) =>{
    let {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    req.flash("sucess","Review Deleted!");
    res.redirect(`/listings/${id}`)
  }))
  

module.exports= router;