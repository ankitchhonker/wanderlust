const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: { type: Number, min: 0, max: 5, required: true },
  comment: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Reviews", reviewSchema);
