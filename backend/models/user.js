 
const { SchemaType } = require("mongoose");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  watchlist:[{type:Schema.Types.ObjectId,ref:"Listings"}]
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);
