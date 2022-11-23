//Import packages, variables (ESM installed).
import express from "express";
const app = express();

//Posts array
const submittedPosts = [];

//Send response to the client
app.get("/posts", (req, res) => {
  res.send(submittedPosts);
});

//Recieve post data from the client
app.post("/submit", (req, res) => {
  submittedPosts.push(req.body);
  console.log(submittedPosts);
  res.send({ statusMsg: "Submitted!" });
});

module.exports = app;
