const User = require("../models/user");

module.exports.signUp = async (req, res) => {
  try {
    console.log("signup started..")
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });
    const registered = await User.register(newUser, password);
    console.log("User Registered")
    req.login(registered, (err) => {
      if (err){ console.log('error occured during login after signup.'); return res.status(500).json({ error: "Login after signup failed" });}
      else{
        console.log("Everyting is fine right now")
      res.status(201).json({
        message: "Account created successfully",
        user: { _id: registered._id, username: registered.username, email: registered.email },
      });}
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.login = (req, res) => {
  const user = req.user;
  res.json({
    message: "Logged in successfully",
    user: { _id: user._id, username: user.username, email: user.email },
  });
};

module.exports.logout = (req, res) => {
  req.logOut((err) => {
    if (err) return res.status(500).json({ error: "Logout failed" });
    res.json({ message: "Logged out successfully" });
  });
};
module.exports.toggleWatchlist = async(req,res) => {
   try {
    if (!req.user) {
      return res.status(401).json({ error: "You must login first" });
    }
    const { listingId } = req.params; // Get the ID from the URL
    // 1. Fetch the latest user document from the DB
    const user = await User.findById(req.user._id);
    // 2. Check if the listing is already in the array
    const isWatchlisted = user.watchlist.includes(listingId);
    
    const updateQuery = isWatchlisted
      ? { $pull: { watchlist: listingId } }
      : { $addToSet: { watchlist: listingId } };
    // 4. Execute the update directly in the database and return the new document
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateQuery,
      { new: true } // This ensures updatedUser contains the newest array
    );
    res.json({
      message: isWatchlisted ? "Removed from watchlist" : "Added to watchlist",
      watchlist: updatedUser.watchlist, // Send the updated array back to frontend
    });
    
  } catch (err) {
    res.status(500).json({ error: "Something went wrong", details: err.message });
  }

}
module.exports.getWatchlist = async (req, res) => { 
  try {
    if (!req.user) return res.status(401).json({ error: "You must login first" });
    const user = await User.findById(req.user._id).populate("watchlist");
    res.json({ watchlist: user.watchlist });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch watchlist" });
  }
};

module.exports.getCurrentUser = (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json({
    user: { _id: req.user._id, username: req.user.username, email: req.user.email ,watchlist:req.user.watchlist},
  });
};
