//Import packages, variables (ESM installed).
import express from "express";
const app = express();

//Send response to the client
app.get("/response", (req, res) => {
  res.send({ message: "The server is online" });
});

module.exports = app;
