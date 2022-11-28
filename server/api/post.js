import express from "express";
import Post from "../Schemas/Post";
const app = express();

//Send back all the posts
app.get("/:postId", async (req, res) => {
  const posts = await Post.find();
  res.send(posts);
});

export default app;
