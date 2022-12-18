import express from "express";
import Post from "../Schemas/Post";
import Comment from "../Schemas/Comment";
import PostVote from "../Schemas/PostVote";
const app = express();

//Send back all the posts
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.send(posts);
  } catch (err) {
    res.send({ error: "Something went wrong." });
    console.log(err);
  }
});

//Submitting a post
app.post("/", async (req, res) => {
  if (!req.session.user) {
    return res.send({ error: "You are not logged in." });
  }
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
  if (!req.session.user) {
    return res.send({ error: "You are not logged in." });
  }
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
  if (!req.session.user) {
    return res.send({ error: "You are not logged in." });
  }
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return res.send({ error: "Invalid post" });
  }
  const comment = new Comment({
    post: req.params.postId,
    userId: req.session.user._id,
    body: req.body.comment,
    author: req.session.user.fname + " " + req.session.user.lname,
  });
  await comment.save();
  post.commentsCount++;
  await post.save();
  console.log(req.body.comment);
  console.log(req.params.postId);
  res.send({ statusMsg: "Comment submitted!" });
});

//Get the comments of the individual post
app.get("/:postId/comments", async (req, res) => {
  if (!req.session.user) {
    return res.send({ error: "You are not logged in." });
  }
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
  if (!req.session.user) {
    return res.send({ error: "You are not logged in." });
  }
  const post = await Post.find({
    _id: req.params.postId,
  });
  if (post) {
    res.send(0);
  } else {
    res.send({ error: "Post not found." });
  }
});

//Edit a comment by clicking edit
app.get("/:postId/comments/:commentId", async (req, res) => {
  if (!req.session.user) {
    return res.send({ error: "You are not logged in." });
  }

  const post = await Post.find({
    _id: req.params.postId,
    userId: req.session.user._id,
  });
  if (!post) {
    return res.send({ error: "Post is not found." });
  }

  const comment = await Comment.find({
    _id: req.params.commentId,
    post: req.params.postId,
    userId: req.session.user._id,
  });
  if (!comment) {
    return res.send({ error: "Comment not found." });
  }
  res.send({ auth: true });
});

//Send back comment data upon editing
app.get("/:postId/comments/:commentId/edit", async (req, res) => {
  if (!req.session.user) {
    return res.send({ error: "You are not logged in." });
  }
  const post = await Post.find({
    _id: req.params.postId,
  });
  if (!post) {
    return res.send({ error: "Post not found." });
  }
  const comment = await Comment.findOne({
    _id: req.params.commentId,
    post: req.params.postId,
    userId: req.session.user._id,
  });
  if (comment.userId !== req.session.user._id) {
    return res.send({ error: "You are not the owner of this comment." });
  }
  res.send(comment.body);
});

//Submit edited comment
app.put("/:postId/comments/:commentId", async (req, res) => {
  if (!req.session.user) {
    return res.send({ error: "You are not logged in." });
  }
  const post = await Post.find({
    _id: req.params.postId,
  });
  if (!post) {
    return res.send({ error: "Post not found." });
  }
  const comment = await Comment.findOne({
    _id: req.params.commentId,
    post: req.params.postId,
    userId: req.session.user._id,
  });
  if (!comment) {
    return res.send({ error: "Comment not found." });
  }
  try {
    comment.body = req.body.comment;
    await comment.save();
    res.send({ statusMsg: "Comment edit submitted!" });
  } catch (err) {
    console.log(err);
    res.send({ error: "Something went wrong." });
  }
});

//Delete a comment
app.delete("/:postId/comments/:commentId", async (req, res) => {
  if (!req.session.user) {
    return res.send({ error: "You are not logged in." });
  }
  const post = await Post.findOne({
    _id: req.params.postId,
  });
  if (!post) {
    return res.send({ error: "Post not found." });
  }
  const comment = await Comment.findOne({
    _id: req.params.commentId,
    post: req.params.postId,
    userId: req.session.user._id,
  });
  if (!comment) {
    return res.send({ error: "Comment not found." });
  }
  if (req.session.user._id !== comment.userId) {
    return res.send({ error: "You are not the owner of this comment." });
  }
  try {
    await Comment.deleteOne({
      _id: req.params.commentId,
      post: req.params.postId,
      userId: req.session.user._id,
    });
    res.send({ statusMsg: "Comment has been deleted." });
  } catch (err) {
    console.log(err);
    res.send({ error: "Error deleting the comment." });
  }
});

//Send post data upon editing
app.get("/:postId", async (req, res) => {
  if (!req.session.user) {
    return res.send({ error: "You are not logged in." });
  }
  try {
    const post = await Post.find({
      _id: req.params.postId,
    });
    if (!post) {
      return res.send({ error: "Post not found." });
    }
    res.send({ post });
  } catch (err) {
    res.send({ error: "Invalid post" });
  }
});

//Edit post data
app.put("/:postId", async (req, res) => {
  if (!req.session.user) {
    return res.send({ error: "You are not logged in." });
  }
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
      userId: req.session.user._id,
    });

    if (!post) {
      return res.send({ error: "Post is not found" });
    }
    post.title = req.body.title;
    post.body = req.body.description;
    await post.save();
    res.send({ statusMsg: "Post edit is submitted" });
  } catch (err) {
    console.log(err);
    res.send({ error: "Something went wrong" });
  }
});

//Delete a post
app.delete("/:postId", async (req, res) => {
  if (!req.session.user) {
    return res.send({ error: "You are not logged in." });
  }
  const post = await Post.findOne({
    _id: req.params.postId,
    userId: req.session.user._id,
  });
  if (!post) {
    return res.send({ error: "Post does not exist." });
  }
  if (post.userId !== req.session.user._id) {
    return res.send({ error: "You are not the owner of the post!" });
  }
  try {
    await Post.deleteOne({
      _id: req.params.postId,
      userId: req.session.user._id,
    });
    res.send({ statusMsg: "Post deleted!" });
  } catch (err) {
    console.log(err);
    res.send({ error: "Error deleting the post." });
  }
});

//Send all votes to the client
app.get("/:postId/votes", async (req, res) => {
  if (!req.session.user) {
    return res.send({ error: "You are not logged in." });
  }
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
    });
    if (!post) {
      return res.send({ error: "Post not found." });
    }
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
  }
  const vote = new PostVote({
    userId: req.session.user._id,
    post: req.params.postId,
  });
  vote.vote = req.body.vote;
  await vote.save();
  res.send({ statusMsg: "Voted!" });
});

export default app;
