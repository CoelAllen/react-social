const router = require("express").Router();
const User = require("../models/User.js");

router.get("/register", (req, res) => {
  res.send("Hello from register");
});

router.post("/register", async (req, res) => {
  try {
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    const user = await newUser.save();
    // res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
