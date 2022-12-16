import express from "express";
import Post from "../Schemas/Post";
import Comment from "../Schemas/Comment";
import UserDetails from "../Schemas/UserDetails";
import PostVote from "../Schemas/PostVote";
const app = express();

//Send back all the posts
app.get("/", async (req, res) => {
  const posts = await Post.find();
  res.send(posts);
});

//Submitting a post
app.post("/", async (req, res) => {
  console.log(req.session.user);
  const post = new Post({
    userId: req.session.user._id,
    title: req.body.title,
    body: req.body.body,
    author: req.session.user.fname + " " + req.session.user.lname,
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
      author: req.session.user.fname + " " + req.session.user.lname,
    });
    await comment.save();
    post.commentsCount++;
    await post.save();
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

//Get all amount of comments of the individual post
app.get("/:postId/comments/all", async (req, res) => {
  const post = await Post.find({
    _id: req.params.postId,
  });
  if (post) {
    res.send(0);
  } else {
    res.send({ error: "Post not found." });
  }
});

//Send post data upon editing
app.get("/:postId", async (req, res) => {
  try {
    const post = await Post.find({
      _id: req.params.postId,
    });
    if (!post) {
      return res.send({ error: "Post not found." });
    } else {
      res.send({ post });
    }
  } catch (err) {
    res.send({ error: "Invalid post" });
  }
});

//Edit post data
app.put("/:postId", async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
      userId: req.session.user._id,
    });

    if (!post) {
      return res.send({ error: "Post is not found" });
    } else {
      post.title = req.body.title;
      post.body = req.body.description;
      await post.save();
      res.send({ statusMsg: "Post edit is submitted" });
    }
  } catch (err) {
    console.log(err);
    res.send({ error: "Something went wrong" });
  }
});

//Send all votes to the client
app.get("/:postId/votes", async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
    });
    if (!post) {
      return res.send({ error: "Post not found." });
    } else {
      const votesUpCount = await PostVote.countDocuments({
        post: req.params.postId,
        vote: 1,
      });
      const votesDownCount = await PostVote.countDocuments({
        post: req.params.postId,
        vote: -1,
      });
      res.send({
        votesUpCount,
        votesDownCount,
      });
    }
  } catch (err) {
    console.log(err);
    res.send({ error: "Something went wrong with the voting system." });
  }
});

//Handle votes from the client
app.post("/:postId/votes", async (req, res) => {
  //Validate if the client is authorized
  if (!req.session.user) {
    return res.send({ error: "You are not logged in to vote." });
  }
  //Validate if the vote is 1 or -1 and nothing else
  if (req.body.vote !== 1 && req.body.vote !== -1) {
    res.send({ error: "Vote is not valid." });
  }
  //Validate if post exists
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return res.send({ error: "Post is not found." });
  }
  //Validate if vote has been already made
  const alreadyVoted = await PostVote.findOne({
    userId: req.session.user._id,
    post: req.params.postId,
  });
  if (alreadyVoted) {
    alreadyVoted.vote = req.body.vote;
    await alreadyVoted.save();
    return res.send({ statusMsg: "Vote has been changed." });
  } else {
    const vote = new PostVote({
      userId: req.session.user._id,
      post: req.params.postId,
    });
    vote.vote = req.body.vote;
    await vote.save();
    res.send({ statusMsg: "Voted!" });
  }
});

export default app;
