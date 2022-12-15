const router = require("express").Router();
const User = require("../models/User.js");

router.get("/register", async (req, res) => {
  const user = await new User({
    username: "john",
    email: "john@email.com",
    password: "123456",
  });
  await user.save();
  res.send("ok");
});

module.exports = router;
