import mongoose, { Schema } from "mongoose"

const watchlistSchema = new Schema({
   ToggleEvent:{type:Boolean},
   author: { type: Schema.Types.ObjectId, ref: "User" }
})

module.exports = mongoose.model("Watchlist",watchlistSchema);
