import express from "express";
import Post from "../Schemas/Post";
const app = express();

//Send back all the posts
app.get("/", async (req, res) => {
  const posts = await Post.find();
  res.send(posts);
});

app.post("/", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    author: "LOGGED USERNAME HERE",
  });
  await post.save();
  res.send({ statusMsg: "Submitted!" });
});

export default app;
