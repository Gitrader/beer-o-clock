const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  beerId: { type: mongoose.ObjectId, ref: "Beer", required: true },
  userId: { type: mongoose.ObjectId, ref: "User", required: true },
  review: { type: String },
  rating: { type: Number, enum: [0, 1, 2, 3, 5], required: true },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
