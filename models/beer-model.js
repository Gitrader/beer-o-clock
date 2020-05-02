const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const beerSchema = new Schema({
  authorId: { type: mongoose.ObjectId, ref: "User" },
  name: { type: String, required: true, },
  image_url: { type: String },
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
  brewery:{type:String}, // we should give user option to specify!
  alcoholVol: { type: Number, required: true },
  country: { type: String },
  description: { type: String },
  malt: [String],
  hops: [String],
  EBU: { type: Number },
  purchasePlace: {
    type: String,
    enum: ["supermarket", "local store", "brewery", "bar", "online"],
  }, // we should give user option to specify!
  purchaseCountry: { type: String },
  //public: {type : Boolean, require: true},
  //foodPairing: [String] -- backlog
});

const Beer = mongoose.model("Beer", beerSchema);

module.exports = Beer;
