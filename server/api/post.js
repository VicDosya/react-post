import express from "express";
import Post from "../Schemas/Post";
import Comment from "../Schemas/Comment";
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
  ); // atleast 8 + small + big + symbol.
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
    res.send(req.session.user);
  }
  const user = await UserDetails.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (!user) {
    res.send({ status: "Invalid email or password.", error: true });
  } else {
    req.session.user = user;
    res.send(user);
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
    res.send({ status: "Logged out..."});
});

//Send back all the posts
app.get("/", async (req, res) => {
  const posts = await Post.find();
  res.send(posts);
});

//Submitting a post
app.post("/", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    author: "LOGGED USERNAME HERE",
  });
  await post.save(); //Updates the document in the DB.
  res.send({ statusMsg: "Submitted!" });
});

//Send back individual post
app.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.send({ error: "Post not found." });
    }
    res.send(post);
  } catch (err) {
    res.send({ error: "Invalid id" });
  }
});

//Submitting a comment to individual posts
app.post("/:postId/comment", async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    res.send({ error: "Invalid post" });
  } else {
    const comment = new Comment({
      post: req.params.postId,
      body: req.body.comment,
      author: "LOGGED USERNAME",
    });

    await comment.save();
    console.log(req.body.comment);
    console.log(req.params.postId);
    res.send({ statusMsg: "Comment submitted!" });
  }
});

//Get the comments of the individual post
app.get("/:postId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    });
    res.send({ comments });
  } catch (err) {
    res.send({ error: "Invalid id" });
  }
});

export default app;
