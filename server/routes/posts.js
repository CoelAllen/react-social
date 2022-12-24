const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User.js");
const { route } = require("./users.js");

// Create
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json("Post created successfully");
  } catch (error) {
    res.status(500).json(error);
  }
});
// update
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post?.userId === req.body.userId) {
      await post?.updateOne({ $set: req.body });
      res.status(200).json("Post updated successfully");
    } else {
      res.status(403).json("Cannot update post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// delete
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post?.userId === req.body.userId) {
      await post?.deleteOne();
      res.status(200).json("Post successfully deleted");
    } else {
      res.status(403).json("Cannot delete others' posts!");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// like
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post?.likes.includes(req.body.userId)) {
      await post?.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("You like!");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("No-Likey");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});
// get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});
// get timeline posts
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser?.id });
    const friendPosts = await Promise.all(
      // @ts-ignore
      currentUser.followings.map((friendId) => {
        Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
