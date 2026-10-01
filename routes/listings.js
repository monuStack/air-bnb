const express = require("express");

const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudConfig.js");
const upload = multer({ storage });
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const {
  index,
  renderNewForm,
  showListing,
  renderEditForm,
  updateListing,
  createNewListing,
  destroyListing,
} = require("../controller/listings.js");

const { Route } = require("router");

// new route
router.get("/new", isLoggedIn, renderNewForm);

// router.route is compact way to write  code  its remove route duplicate route
router
  .route("/:id")
  // show route / Post data route
  .get(wrapAsync(showListing))
  // updata rotue
  .patch(isLoggedIn, isOwner,upload.single("image"), validateListing, wrapAsync(updateListing))
  // delete route
  .delete(isLoggedIn, isOwner, wrapAsync(destroyListing));

// index route
router.get("/", wrapAsync(index));

// new create route
router.post("/new", isLoggedIn, validateListing, upload.single("image"),wrapAsync(createNewListing));


// show route / Post data route
// router.get("/:id", wrapAsync(showListing));

// edit form route
router.get("/:id/update", isLoggedIn, isOwner, wrapAsync(renderEditForm));

// updata rotue
// router.patch(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(updateListing),
// );

// delete route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(destroyListing));

module.exports = router;
