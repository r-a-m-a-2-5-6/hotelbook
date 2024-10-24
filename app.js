const express = require("express");
const app= express();
const mongoose = require("mongoose");
const ejsMate= require("ejs-mate");
const path = require ("path");
const Listing = require("./models/init.js");
const methodOverride = require("method-override");

const port = 8080;
app.engine("ejs",ejsMate)
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
main()
  .then(() => {
    console.log("connected to db")
  })
  .catch(err => {
    console.log(err)
  })
async function main() {
   await mongoose.connect('mongodb://127.0.0.1:27017/hotelbook')
}

app.get("/", (req,res) => {
    res.send("working")
})
// app.get("/testListing", (req,res) => {
//     let sampleListing = new Listing ({
//         title:"My House",
//         description :"Beautiful Location at the Beach Location",
//         price:50000,
//         location:"Goa",
//         country:"India"
//     })
//     // sampleListing.save()
//     //   .then(res => console.log(res))
//     //   .catch(err => console.log(err))
    
//     res.send("its working verma")
// })

//index route
app.get("/listings", async (req,res) =>{
  const alllistings= await Listing.find({});
  res.render("listings/index.ejs",{alllistings})
})
//create route
app.post("/listings", (req,res) => {
  let data = req.body;
  console.log(data);
  let list = new Listing({
    title:data.title,
    description:data.description,
    location:data.location,
    country:data.country,
    price:data.price,
    image:data.image
  })
  list.save()
   .then(res => console.log(res))
   .catch(err => console.log(err))
  res.redirect("/listings")
})
//new route
app.get("/listings/new", (req,res) => {
  res.render("listings/create.ejs")
})
//edit route
app.get("/listings/:id/edit", async (req,res) =>{
  let {id} = req.params;
  let element = await Listing.findById(id);
  res.render("listings/edit.ejs",{element})
})
//update route 
app.put("/listings/:id" , async (req,res) => {
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
  res.redirect(`/listings/${id}`)
})
//delete route
app.delete("/listings/:id/delete" ,async (req,res)=> {
  let {id}=req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
})

//show route
app.get("/listings/:id", async (req,res)=> {
  let {id}=req.params;
  const listings = await Listing.findById(id);
  res.render("listings/show.ejs",{listings})
})


app.listen(port, () => {
    console.log(`server is listening to port ${port}`)
})