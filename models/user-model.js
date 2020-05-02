const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  city: { type: String },
  country: { type: String },
  beerPreference: [{type:String,    //[multiple selection]
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
      "no preference",
    ],
  }],
  likedBeers: [{ type: mongoose.ObjectId, ref: "Beer", required: true }],
  userBeers: [{ type: mongoose.ObjectId, ref: "Beer", required: true }], // should we add userID here that these can be linked?
  userReviews: [{ type: mongoose.ObjectId, ref: "Review", required: true }],
  //followers:[userID]-- backlog
  //public: {type: boolean, required: true} -- backlog
});

const User = mongoose.model("User", userSchema);

module.exports = User;



//install wrapper for the API punk API js wrapper a way to query the API 