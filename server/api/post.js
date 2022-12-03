import express from "express";
import Post from "../Schemas/Post";
import Comment from "../Schemas/Comment";
const app = express();

//Send back all the posts
app.get("/", async (req, res) => {
  const posts = await Post.find();
  res.send(posts);
});

//Submitting a post
app.post("/", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    author: "LOGGED USERNAME HERE",
  });
  await post.save(); //Updates the document in the DB.
  res.send({ statusMsg: "Submitted!" });
});

//Send back individual post
app.get("/:postId", async (req, res) => {
  const post = await Post.findById(req.params.postId);
  res.send(post);
});

//Submitting a comment to individual posts
app.post("/:postId/comment", async (req, res) => {
  const comment = new Comment({
    post: req.params.postId,
    body: req.body.comment,
    author: "LOGGED USERNAME",
  });

  await comment.save();
  console.log(req.body.comment);
  console.log(req.params.postId);
  res.send({ statusMsg: "Comment submitted!" });
});

//Get the comments of the individual post
app.get("/:postId/comments", async (req, res) => {
  const comments = await Comment.find({
    post: req.params.postId,
  });
  res.send(comments);
});

export default app;
