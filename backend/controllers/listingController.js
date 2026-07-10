const Listings = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listings.find({});
  res.json({ listings: allListings });
};

module.exports.getByCategory = async (req, res) => {
  const { category } = req.params;
  const allListings = await Listings.find({ category });
  res.json({ listings: allListings });
};

module.exports.search = async (req, res) => {
  const { searchTerm } = req.query;
  const query = {
    $or: [
      { title: new RegExp(searchTerm, "i") },
      { location: new RegExp(searchTerm, "i") },
      { country: new RegExp(searchTerm, "i") },
      { category: new RegExp(searchTerm, "i") },
      { description: new RegExp(searchTerm, "i") },
    ],
  };
  const allListings = await Listings.find(query);
  res.json({ listings: allListings });
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
