//Import packages, variables (ESM installed).
import express from "express";
import Post from "../Schemas/Post";
const app = express();

//Recieve post data from the client and save it to the database
app.post("/submit", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.body,
  });
  await post.save();
  res.send({ statusMsg: "Submitted!" });
});

export default app;
