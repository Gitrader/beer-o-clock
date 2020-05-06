const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
<<<<<<< HEAD
  beerId: { type: mongoose.ObjectId, ref: "Beer", required: true },
  userId: { type: mongoose.ObjectId, ref: "User", required: true },
  review: { type: String },
  rating: { type: Number, enum: [0, 1, 2, 3, 4, 5], required: true },
=======
  beerId: {type: mongoose.ObjectId, ref: "Beer", required: true},
  userId: {type: mongoose.ObjectId, ref: "User", required: true},
  review: {type: String},
  rating: {type: Number, enum: [0, 1, 2, 3, 4, 5], required: true},
>>>>>>> 0e2c13ece221a572a053ade05ac667f358a851d6
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
