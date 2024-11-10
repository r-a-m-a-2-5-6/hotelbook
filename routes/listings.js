const express= require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/init.js");
const methodOverride = require("method-override");
const Review = require("../models/review.js");
const flash= require("connect-flash");
const session = require("express-session");
const { isLoggedIn } = require("../middlewares/middleware.js");


//index route
router.get("/", wrapAsync( async (req,res) =>{
const alllistings= await Listing.find({});
res.render("listings/index.ejs",{alllistings})
}))

//create route
router.post("/", (req,res) => {
let data = req.body;
let list = new Listing({
    title:data.title,
    description:data.description,
    location:data.location,
    country:data.country,
    price:data.price,
    image:data.image
})
list.owner=req.user._id;
list.save()
    .catch(err => console.log(err))
req.flash("sucess","New List Added ")
res.redirect("/listings")
})

//new route
router.get("/new",isLoggedIn, (req,res) => {
res.render("listings/create.ejs")
})

//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync( async (req,res) =>{
let {id} = req.params;
let element = await Listing.findById(id);
res.render("listings/edit.ejs",{element})
}))

//update route 
router.put("/:id" ,isLoggedIn, async (req,res) => {
let {id}=req.params;
let data = req.body;
await Listing.findByIdAndUpdate(id, {
    title:data.title,
    description:data.description,
    location:data.location,
    country:data.country,
    price:data.price,
    image:data.image
})
req.flash("sucess","Listing Edited sucessfully!");
res.redirect(`/listings/${id}`)
})

//delete route
router.delete("/:id/delete" ,isLoggedIn,async (req,res)=> {
let {id}=req.params;
let data =await Listing.findByIdAndDelete(id);
req.flash("sucess","Listing Deleteds!");
res.redirect("/listings");
})


//show route
router.get("/:id",wrapAsync( async (req,res)=> {
let {id}=req.params;
const listings = await Listing.findById(id).populate("reviews").populate("owner");
res.render("listings/show.ejs",{listings})
}))

module.exports= router;