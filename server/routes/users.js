const router = require("express").Router();
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

// Edit user

router.put("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (req.body.userId === req.params.id || user?.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You cannot update this account");
  }
});

// Delete User

router.delete("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (req.body.userId === req.params.id || user?.isAdmin) {
    try {
      await User.findByIdAndDelete(user?.id);
      res.status(200).json("Account has been deleted");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can only delete your own account!");
  }
});

// Get User by Id

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // @ts-ignore
    const { password, updatedAt, ...other } = user?._doc;
    res.status(200).json(other);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.id);
      if (!user?.followers.includes(req.body.userId)) {
        await user?.updateOne({ $push: { followers: req.body.userId } });
        await currentUser?.updateOne({
          $push: { followings: req.params.id },
        });
        res.status(200).json("You are now following");
      } else {
        res.status(403).json("You are already a follower");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You cannot follow yourself");
  }
});

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.id);
      if (!user?.followers.includes(req.body.userId)) {
        await user?.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser?.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("You are no longer following");
      } else {
        res.status(403).json("You have already unfollowed");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You cannot unfollow yourself");
  }
});
module.exports = router;
