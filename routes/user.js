const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const{renderSignupFrom,signup,renderLoginForm,login,logout} = require('../controller/user.js');

// signup form route
router.get("/signup",renderSignupFrom);

//signup post route
router.post("/signup", signup);

//login page route
router.get("/login", renderLoginForm);


//login Post route
router.post(
  "/login",saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  login,
);


//logout route
router.get("/logout", logout);

module.exports = router;
