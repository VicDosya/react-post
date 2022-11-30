import express from "express";
import Post from "../Schemas/Post";
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
  await post.save();
  res.send({ statusMsg: "Submitted!" });
});

//Send back individual post
app.get("/:postId", async (req, res) => {
  const post = await Post.findById(req.params.postId);
  res.send(post);
});

//Submitting a comment
app.post("/comment", async (req, res) => {
  res.send({ statusMsg: "woohoo" });
});

export default app;
