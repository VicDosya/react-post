import express from "express";
import bcrypt from "bcryptjs";
import UserDetails from "../Schemas/UserDetails";
const app = express();

//Authentication

/**
 * This API registers a new user, checks that the input
 * upon registration is valid and saves it to the database.
 * @route POST /api/auth/register
 * @param {string} fname.body.required - First name
 * @param {string} lname.body.required - Last name
 * @param {string} email.body.required - Email
 * @param {string} password.body.required - Password
 * @returns {object} 201 - Returns an object that contains a status and user session data
 * @returns {object} 403 - Returns an object that contains an error states that the user already exists.
 * @returns {object} 400 - Returns an object that contains an error states that the inputs are not valid.
 */
app.post("/register", async (req, res) => {
  //Registeration Validation

  let validInputs = false;

  //Regex
  const fullNameRegex = new RegExp(/([A-Z][a-z]*)([\\s\\\'-][A-Z][a-z]*)*/i);
  const emailRegex = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);
  const passwordRegex = new RegExp(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
  ); // atleast 8 + small + big.
  const oldUser = await UserDetails.findOne({ email: req.body.email });
  //Validation functionality
  const checkValidation = () => {
    if (
      fullNameRegex.test(req.body.fname) === true &&
      fullNameRegex.test(req.body.lname) === true &&
      emailRegex.test(req.body.email) === true &&
      passwordRegex.test(req.body.password) === true &&
      !oldUser
    ) {
      validInputs = true;
    } else {
      validInputs = false;
    }
  };

  checkValidation();

  if (validInputs !== false) {
    //Encrypt the password
    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new UserDetails({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: encryptedPassword,
    });
    await user.save();
    res.status(201).send({ message: "Success" });
  } else if (oldUser) {
    return res.status(403).send({ message: "This user already exists" });
  } else {
    res.status(400).send({
      message: "One or more input fields are not valid.",
    });
  }
});

/**
 * This API authenticates the user and saves the user data to the session in order
 * for the user to have access to all the other APIs.
 * @route POST /api/auth/login
 * @param {string} email.body.required - Email
 * @param {string} password.body.required - Password
 * @returns {string} 200 - Returns back user session if the user already logged in.
 * @returns {object} 202 - Returns an object that contains a status and user session data
 * @returns {object} 404 - Returns an object that contains an error states that the user does not exist.
 * @returns {object} 401 - Returns an object that contains an error states that the password is incorrect.
 */
app.post("/login", async (req, res) => {
  if (req.session.user) {
    return res.status(200).send(req.session.user);
  }
  const user = await UserDetails.findOne({
    email: req.body.email,
  });
  if (!user) {
    return res.status(404).send({ message: "User does not exist." });
  }
  //Decrypt the password
  const decryptedPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!decryptedPassword) {
    return res.status(401).send({ message: "Incorrect password." });
  }
  req.session.user = user;
  res.status(202).send({ user, message: "Logged in, Redirecting..." });
});

/**
 * This API checks if the user is authenticated and is logged in in order to access all
 * other APIs.
 * @route GET /api/auth/profile
 * @returns {object} 200 - Returns an object that contains a status.
 * @returns {object} 401 - Returns an object that contains an error stating that the user is not logged in.
 */
app.get("/profile", async (req, res) => {
  if (req.session.user) {
    res.status(200).send(req.session.user);
  } else {
    res.status(401).send({ message: "User not logged in." });
  }
});

/**
 * This API removes user's session when the user chooses to log out.
 * @route POST /api/auth/logout
 * @returns {object} 200 - Returns an object that contains a status
 */
app.get("/logout", async (req, res) => {
  req.session.user = undefined; //Removing the user from the session
  res.status(200).send({ status: "Logged out..." });
});

export default app;
