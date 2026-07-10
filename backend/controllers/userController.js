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

module.exports.getCurrentUser = (req, res) => {
  if (!req.user) return res.json({ user: null });
  res.json({
    user: { _id: req.user._id, username: req.user.username, email: req.user.email },
  });
};
