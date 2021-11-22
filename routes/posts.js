const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

const auth = require("../middleware/auth");
const Post = require("../db/postDB.js");

// POST Create new post
router.post("/create", auth, async (req, res) => {
  console.log(">>>>> POST /posts/create");
  const newPost = req.body;
  newPost.authorId = ObjectId(newPost.authorId);
  try {
    console.log("ready to create new post", newPost);
    const response = await Post.createOne(newPost);
    res.status(200).json(response);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/* GET public posts*/
router.get("/public", async (req, res) => {
  try {
    const posts = await Post.getPosts({
      $or: [{ isPublic: true }, { isPrivate: false }],
    });
    console.log("GET posts/public:", posts);
    res.status(200).json({ posts: posts });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/* GET posts by one user*/
router.get("/", auth, async (req, res) => {
  console.log(">>>>> GET /posts");
  const authorId = req.user.id;
  console.log("authorId:", authorId);
  try {
    const posts = await Post.getPosts({
      authorId: ObjectId(authorId),
    });
    res.status(200).json({ posts: posts });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/* GET posts by one user*/
// router.get("/:authorId", auth, async (req, res) => {
//   console.log(">>>>> GET /posts");
//   const authorId = req.params.authorId.trim();
//   console.log("authorId:", authorId);
//   try {
//     const posts = await Post.getPosts({ authorId: ObjectId(authorId) });
//     res.status(200).json({ posts: posts });
//   } catch (e) {
//     res.status(400).send({ msg: e.message });
//   }
// });
router.get("/:authorId", async (req, res) => {
  console.log(">>>>> GET /posts");
  const authorId = req.user.id;
  console.log("authorId:", authorId);
  try {
    const posts = await Post.getPosts({ authorId: ObjectId(authorId) });
    res.status(200).json({ posts: posts });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/* POST UPDATE current post */
router.post("/update", auth, async (req, res) => {
  const post = req.body;
  console.log("enter /posts/update post", post);

  // update post
  try {
    console.log("trying to update post");
    const dbRes = await Post.updatePostByID(post);
    console.log("dbRes: ", dbRes);
    res.status(200).json({ status: "OK" });
  } catch (e) {
    // console.log("Error", e);
    res.status(400).send({ msg: e });
  }
});

/* POST DELETE current post */
router.post("/delete", auth, async (req, res) => {
  const post = req.body;

  console.log("enter /posts/delete", post);

  // update post
  try {
    const dbRes = await Post.deletePostByID(ObjectId(post._id));
    console.log("dbRes: ", dbRes);
    res.status(200).json({ msg: "OK" });
  } catch (e) {
    console.log("Error", e);
    res.status(400).send({ msg: e });
  }
});

module.exports = router;
