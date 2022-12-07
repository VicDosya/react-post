import express from "express";
import Post from "../Schemas/Post";
import Comment from "../Schemas/Comment";
import UserDetails from "../Schemas/UserDetails";
const app = express();

//Send back all the posts
app.get("/", async (req, res) => {
  const posts = await Post.find();
  res.send(posts);
});

//Submitting a post
app.post("/", async (req, res) => {
  console.log(req.session.user);
  const post = new Post({
    userId: req.session.user._id,
    title: req.body.title,
    body: req.body.body,
    author: req.session.user.fname + " " + req.session.user.lname,
  });
  await post.save(); //Updates the document in the DB.
  res.send({ statusMsg: "Submitted!" });
});

//Send back individual post
app.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.send({ error: "Post not found." });
    }
    res.send(post);
  } catch (err) {
    res.send({ error: "Invalid id" });
  }
});

//Submitting a comment to individual posts
app.post("/:postId/comment", async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.send({ error: "Invalid post" });
  } else {
    const comment = new Comment({
      post: req.params.postId,
      body: req.body.comment,
      author: req.session.user.fname + " " + req.session.user.lname,
    });

    await comment.save();
    console.log(req.body.comment);
    console.log(req.params.postId);
    res.send({ statusMsg: "Comment submitted!" });
  }
});

//Get the comments of the individual post
app.get("/:postId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    });
    res.send({ comments });
  } catch (err) {
    res.send({ error: "Invalid id" });
  }
});

//Give access to edit a post via edit post button
app.get("/:postId/edit", async (req, res) => {
  try {
    const userPost = await Post.findOne({
      userId: req.session.user._id,
    });
    if (!userPost) {
      return res.send({ error: "No permission to edit the post." });
    } else {
      res.send({ auth: true });
    }
  } catch (err) {
    res.send({ error: "Something went wrong." });
  }
});

//Send post data upon editing

export default app;
