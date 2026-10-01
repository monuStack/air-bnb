const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// index route controller
module.exports.index = async (req, res) => {
  let alldata = await Listing.find({});
  // console.log(alldata );
  console.log("all listing print");
  return res.render("listing/showdata", { alldata });
};

// render New Form Controller2844
module.exports.renderNewForm = (req, res) => {
  res.render("listing/new.ejs");
};

// create new listing Controller
module.exports.createNewListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  let data = req.body;
  console.log(data);
  const newListing = new Listing(data);
  console.log(req.user);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  let coordinates = response.body.features[0].geometry;
  newListing.geometry = coordinates;
  console.log(newListing);
  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "new listing Created! ");
  res.redirect("/listing");
};

// show Listing Controller
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let postdata = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author" } })
    .populate("owner");
  if (!postdata) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listing");
  }
  res.render("listing/postdata", { postdata });
};

// Render Edit form controller
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let postdata = await Listing.findById(id);
  if (!postdata) {
    req.flash("error", "Listing you requested for does not exist");
    res.redirect("/listing");
  }
  let orignalImageUrl = postdata.image.url;
  orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/h_300,w_250");

  res.render("listing/edit.ejs", { postdata, orignalImageUrl });
};

// Update listing controller
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let data = req.body;
  console.log(data);
  let listing = await Listing.findOneAndUpdate({ _id: id }, data); // autometically update data, id is condition and , data is new update data
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated! ");
  res.redirect(`/listing/${id}`);
};

// delete/destroy listing controller
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id); // autometically update data, id is condition and , data is new update data
  req.flash("success", "Listing Deleted! ");
  res.redirect("/listing");
};
