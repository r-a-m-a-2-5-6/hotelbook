const express = require("express");
const app= express();
const mongoose = require("mongoose");
const ejsMate= require("ejs-mate");
const path = require ("path");
const methodOverride = require("method-override");
const wrapAsync = require("./utils/wrapasync.js");
const Review = require("./models/review.js");
const User = require("./models/user.js");
const Listing = require("./models/init.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const users= require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");




const port = 8080;

app.engine("ejs",ejsMate)

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const sessionOptions = {
  secret:"mysecrets",
  resave:false,
  saveUninitialized:true,
  cookie:{
    express:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true

  }
}

app.get("/", (req,res) => {
  res.send("working")
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.sucess = req.flash("sucess");
  res.locals.error = req.flash ("error");
  res.locals.currUser = req.user;
  next();
})



app.use("/listings",listings);
app.use("/listings",reviews);
app.use("/users",users);




main()
  .then(() => {
    console.log("connected to db")
  })
  .catch(err => {
    console.log(err)
  });

async function main() {
   await mongoose.connect('mongodb://127.0.0.1:27017/hotelbook')
};



app.use ((err,req,res,next) => {
  res.render("listings/Error.ejs",{err})
});

app.listen(port, () => {
    console.log(`server is listening to port ${port}`)
});