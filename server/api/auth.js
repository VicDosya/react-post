import express from "express";
import UserDetails from "../Schemas/UserDetails";
const app = express();

//Authentication

//Send user data upon registering
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

  if (validInputs === true) {
    const user = new UserDetails({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: req.body.password,
    });
    await user.save();
    res.send({ status: "Success" });
  } else if (oldUser) {
    return res.send({ status: "This user already exists", error: true });
  } else {
    res.send({
      status: "One or more input fields are not valid.",
      error: true,
    });
  }
});

//Log in with user data
app.post("/login", async (req, res) => {
  if (req.session.user) {
    return res.send(req.session.user);
  }
  const user = await UserDetails.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (!user) {
    res.send({ status: "Invalid email or password.", error: true });
  } else {
    req.session.user = user;
    res.send({ user, status: "Logged in, Redirecting..." });
  }
});

//Profile api to return to the user
app.get("/profile", async (req, res) => {
  if (req.session.user) {
    res.send(req.session.user);
  } else {
    res.send({ status: "User not logged in.", error: true });
  }
});

//Profile api to logout
app.get("/logout", async (req, res) => {
  req.session.user = null; //Removing the user from the session
  res.send({ status: "Logged out..." });
});

export default app;
