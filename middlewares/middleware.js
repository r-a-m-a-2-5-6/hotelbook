module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.userpath = req.originalUrl;
        console.log(req.originalUrl)
        req.flash("error" ,"Login Required")
        return res.render("users/login")
        
    }
    next();
}

module.exports.saveUser = (req,res,next)=>{
    res.locals.saveUser = req.session.userpath;
    next();
}