const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beerSchema = new Schema({
  authorId: {type: mongoose.ObjectId, ref: "User"},
  name: {type: String, required: true, },
  image_url: {type: String},
  beerType: [{
    type: String,
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
      "other", // need to add if other, string
    ],
  }],
  alcoholVol: {type: Number},
  brewery: {type: String},
  country: {type: String},
  description: {type: String},
  malt: [String],
  hops: [String],
  EBU: {type: Number},
  purchasePlace: {
    type: String,
    enum: ["supermarket", "local store", "brewery", "bar", "online"],
  }, // we should give user option to specify!
  purchaseCountry: {type: String},
  //public: {type : Boolean, require: true},
  //foodPairing: [String] -- backlog
  // Options object
  // timestamps: {     // Set auto timestamps
  //   createdAt: "created_at",
  //   updatedAt: "update_at"
  // }
});

const Beer = mongoose.model("Beer", beerSchema);

module.exports = Beer;
