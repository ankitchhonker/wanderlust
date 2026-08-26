const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { url: String, filename: String },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  watchlist:[{type:Schema.Types.ObjectId, ref:"Watchlist"}],
  reviews: [{ type: Schema.Types.ObjectId, ref: "Reviews" }],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  geometry: {
    type: { type: String, enum: ["Point"] },
    coordinates: { type: [Number] },
  },
  category: { type: String, required: true },
});

module.exports = mongoose.model("Listings", listSchema);
