const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// post review
module.exports.postReview = async (req, res) => {
    try {
      let { id } = req.params;
      let newReview = req.body;

      let post = await Listing.findById(id);
      console.log(post);
      let reRes = new Review(newReview);
      reRes.author = req.user._id;
      console.log(reRes);

      //save data
      post.review.push(reRes);
      await reRes.save();
      await post.save();
      req.flash("success","New Review Created! ")
      res.redirect(`/listing/${id}`);
    } catch (err) {
      console.log(err);
    }
  }


// delete/destroy Review
  module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted! ")
    res.redirect(`/listing/${id}`);
  }