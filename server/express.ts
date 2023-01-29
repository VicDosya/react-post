//Import packages (ESM is installed)
/// <reference path="./src/types/index.d.ts" />
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import dotenv from "dotenv"; // import .env to import the environment variable.
dotenv.config(); // This function actually loads the .env file
import mongoose from "mongoose";
import apiPostsRoutes from "./api/post";
import apiAuthRoutes from "./api/auth";

//Database connection
mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING!) //added "!"  -> will throw an error if the variable is not defined.
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

//Variables
const app = express();
const PORT = process.env.PORT || 3001;

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Check if session key file exists
if (!process.env.SESSION_SECRET_KEY) {
  throw new Error("Session_Secret_Key is not set!");
}

app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
  })
);

//My own middleware - execute the middleware on specific api route.
app.use("/api/posts", (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).send({ error: "You are not logged in." });
  }
  next();
});

//Routes
app.use("/api/auth", apiAuthRoutes);
app.use("/api/posts", apiPostsRoutes);

//Server Start
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
