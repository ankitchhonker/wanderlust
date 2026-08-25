const Listings = require("../models/listing");

module.exports.index = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const allListings = await Listings.find({}).skip(skip).limit(limit);
  const total = await Listings.countDocuments({});
  const totalPages = Math.ceil(total / limit);

  res.json({ listings: allListings, page, totalPages, total });
};

module.exports.getByCategory = async (req, res) => {
  const { category } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const allListings = await Listings.find({ category }).skip(skip).limit(limit);
  const total = await Listings.countDocuments({ category });
  const totalPages = Math.ceil(total / limit);

  res.json({ listings: allListings, page, totalPages, total });
};

module.exports.search = async (req, res) => {
  const { searchTerm } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const query = {
    $or: [
      { title: new RegExp(searchTerm, "i") },
      { location: new RegExp(searchTerm, "i") },
      { country: new RegExp(searchTerm, "i") },
      { category: new RegExp(searchTerm, "i") },
      { description: new RegExp(searchTerm, "i") },
    ],
  };
  
  const allListings = await Listings.find(query).skip(skip).limit(limit);
  const total = await Listings.countDocuments(query);
  const totalPages = Math.ceil(total / limit);

  res.json({ listings: allListings, page, totalPages, total });
};

module.exports.createListing = async (req, res) => {
  const { title, description, price, location, country, category, lat, lng } = req.body;

  const newListing = new Listings({
    title,
    description,
    price,
    location,
    country,
    category,
    image: {
      url: req.file ? req.file.path : "",
      filename: req.file ? req.file.filename : "",
    },
    geometry: {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
    },
    owner: req.user._id,
  });

  await newListing.save();
  res.status(201).json({ message: "Listing created successfully", listing: newListing });
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listings.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) return res.status(404).json({ error: "Listing not found" });
  res.json({ listing });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, country, category, lat, lng } = req.body;

  const updateData = { title, description, price, location, country, category };
  if (lat && lng) {
    updateData.geometry = { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] };
  }

  const updated = await Listings.findByIdAndUpdate(id, updateData, { new: true });
  if (req.file) {
    updated.image = { url: req.file.path, filename: req.file.filename };
    await updated.save();
  }
  res.json({ message: "Listing updated", listing: updated });
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listings.findByIdAndDelete(id);
  res.json({ message: "Listing deleted successfully" });
};
