//Import packages (ESM is installed)
import dotenv from "dotenv"; // import .env to import the environment variable.
dotenv.config(); // This function actually loads the .env file
import apiRoutes from "./api/post-page";
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

//Database connection
mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
.then(() => console.log('Connected to DB'))
.catch((err) => console.log(err));

//Variables
const app = express();
const PORT = process.env.PORT || 3001;

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", apiRoutes);

//Server Start
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
