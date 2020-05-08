const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  beerId: {type: mongoose.Schema.Types.ObjectId, ref: "Beer", required: true},
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
  review: {type: String},
  rating: {type: Number, enum: [0, 1, 2, 3, 4, 5], required: true},
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
