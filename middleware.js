const Listing = require('./models/listing');
const Review = require("./models/review.js");
const { listingSchema,reviewSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


// validateListing
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log("errMsg", errMsg);
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// review validation
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  console.log(error);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    console.log("errMsg", errMsg);
    console.log(error.details.path);
    throw new ExpressError(400, error);
  } else {
    next();
  }
};


module.exports.isLoggedIn = (req, res,next) => {
  if (!req.isAuthenticated()) {
    //redirect url
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you must be logged in");
    return res.redirect("/login");
  }
next();
};



//store redirect url in local beacase  passport reset the session after the login its  very imprtant  to store in local ,passport don't have write to delete local.
module.exports.saveRedirectUrl = (req,res,next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}


// isOwner =authrization for  update and edit post 
module.exports.isOwner = async(req,res,next)=>{
   let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of listing");
     return res.redirect(`/listing/${id}`);
    }
    next();
};

// isReviewAuthor
module.exports.isReviewAuthor = async(req,res,next)=>{
   let {id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the author of this review ");
     return res.redirect(`/listing/${id}`);
    }
    next();
};

