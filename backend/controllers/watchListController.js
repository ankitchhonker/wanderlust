const Listing = require("../models/listing");


module.exports.watchListController = async(req,res,next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id)
    if(!listing)
        return res.status(400).json({error:"Listing Not Found"})
    
}