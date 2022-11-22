//Import packages (ESM is installed)
const apiRoutes = require("./api/post-page");
import express from "express";
import bodyParser from "body-parser";

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
