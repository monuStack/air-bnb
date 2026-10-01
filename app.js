const dns = require("dns");
dns.setServers(["8.8.8.8"]);
require('dotenv').config()
// console.log(process.env.SECRETE);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const userRouter = require("./routes/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

// connect databas
async function main() {
  mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET
  }, 
  touchAfter:24*3600,
})

store.on("error",()=>{
  console.log("error in mongo store",err);
})


const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expire:Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly:true,
  }
}
// //Basics api
// app.get("/", (req, res) => {
//   res.send("this is root");
// });



//express-session
app.use(session(sessionOptions));

//connect-flash 
app.use(flash());

//initilize passport for every request 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


//user data store in session is  serialize and  after complete user work delete data from session is deserialize
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// create local varialbe we can access in ejs file  directly
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  console.log(res.locals.success);
  next()
})

// app.get("/demo", async(req,res)=>{
//   let fackuser = new User({
//     email:"student@gmail.com",
//     username:"dalta-student",
//   })
//   const registeredUser = await User.register(fackuser,"helloworld");
//   res.send(registeredUser);
// })

//routes all api
app.use("/listing", listingRouter);
app.use("/listing/:id/review/",reviewRouter)
app.use("/",userRouter);

// expressError if  user Go any non-exist route
app.all("*anything", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// error handling
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "somthing went wrong" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message });
});


const port = 8080;
app.listen(port, () => {
  console.log("port is listening to port: 8080");
});
