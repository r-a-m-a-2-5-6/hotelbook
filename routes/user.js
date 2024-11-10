const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapasync = require("../utils/wrapasync.js");
const passport = require("passport");
const { saveUser } = require("../middlewares/middleware.js");
//signup route
router.get("/signup",(req,res) =>{
    res.render("users/signup.ejs");
})

//create accont route
router.post("/signup",wrapasync( async (req,res) => {
    try {
        let newUser = new User(req.body.user);
   let registeredUser = await  User.register(newUser,req.body.user.password);
    req.login(registeredUser,(err) =>{
        if(err){
            next(err)
        }
        req.flash("sucess","Account created sucessfully");
        res.redirect("/listings")
    })} catch (error) {
        req.flash("error",error);
        res.redirect("users/signup")
    }
}));

//login route
router.get("/login",(req,res) =>{
    res.render("users/login.ejs");
});

router.post("/login",saveUser,passport.authenticate(
    'local',({
        failureRedirect:"/users/login",
        failureFlash:true
    })
), async (req,res) =>{
           req.flash("sucess","Logged in Sucessfully");
           let redirectUrl = res.locals.saveUser || "/listings"
           res.redirect(redirectUrl)
        })

//logout route
router.get('/logout',(req,res,next) =>{
    req.logout((err) =>{
        if(err){
            next(err)
        }
        req.flash("sucess","Log Out sucessfully")
        res.redirect("/listings")
    })
})
module.exports=router;