const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  city: { type: String },
  country: { type: String, required: true },
  beerPreference: {
    enum: [
      "lager",
      "pilsner",
      "wheat beer",
      "witbier",
      "IPA",
      "APA",
      "porter",
      "stout",
      "gose",
      "sour",
      "other",
    ],
  },
  likedBeers: [{ type: mongoose.ObjectId, ref: "Beer", required: true }],
  userBeers: [{ type: mongoose.ObjectId, ref: "Beer", required: true }], // should we add userID here that these can be linked?
  userReviews: [{ type: mongoose.ObjectId, ref: "Review", required: true }],
  //followers:[userID]-- backlog
  //public: {type: boolean, required: true} -- backlog
});

const User = mongoose.model("User", userSchema);

module.exports = User;
