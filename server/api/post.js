import express from "express";
import Post from "../Schemas/Post";
import Comment from "../Schemas/Comment";
import PostVote from "../Schemas/PostVote";
const app = express();

/**
 * This API sends to the user all the posts data from the database.
 * @route GET /
 * @returns {object} 200 - Returns an object that contains all posts
 * @returns {object} 500 - Returns an object that contains an error that states something went wrong.
 */
app.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).send(posts);
  } catch (err) {
    res
      .status(500)
      .send({ error: "Something went wrong with the posts system" });
    console.log(err);
  }
});

/**
 * This API takes user's submitted post and saves it in the database.
 * @route POST /api/posts/
 * @param {string} title.body.optional - The title of the post
 * @param {string} body.body.optional - The body of the post
 * @returns {object} 200 - Returns an object that contains a statusMsg
 * @returns {object} 400 - Returns an object that contains an error if inputs are invalid.
 * @returns {object} 500 - Returns an object that contains an error if something went wrong.
 */
app.post("/", async (req, res) => {
  if (!req.body.title || !req.body.body) {
    return res.status(400).send({ statusMsg: "Please fill all the inputs." });
  }
  try {
    const post = new Post({
      userId: req.session.user._id,
      title: req.body.title,
      body: req.body.body,
      author: req.session.user.fname + " " + req.session.user.lname,
    });
    await post.save(); //Updates the document in the DB.
    res.status(200).send({ statusMsg: "Submitted!" });
  } catch (err) {
    res.status(500).send({ statusMsg: "Something went wrong..." });
  }
});

/**
 * This API finds a specific post using its id in the database and returns its data to the user.
 * @route GET /api/posts/:postId
 * @returns {object} 200 - Returns an object that contains the specific post.
 * @returns {object} 404 - Returns an object that contains an error if the post is not found in the database
 * @returns {object} 500 - Returns an object that contains an error that states something went wrong.
 *
 */
app.get("/:postId", async (req, res) => {
  try {
    //STATIC METHOD IN TESTING, notice that there's no 'new Post'.
    const post = await Post.findById(req.params.postId);
    if (!post) {
      //if post is undefined or null.
      return res.status(404).send({ error: "Post not found." });
    }
    res.status(200).send(post);
  } catch (err) {
    res.status(500).send({ error: "Something went wrong..." });
  }
});

/**
 * This API takes user's submitted comment, saves it in the database and increments post's comment amount number by one.
 * @route POST /api/posts/:postId/comments
 * @param {string} body.body.optional - The body of the comment
 * @returns {object} 201 - Returns an object that contains a statusMsg
 * @returns {object} 404 - Returns an object that contains an error if the post is not found.
 *
 */
app.post("/:postId/comments", async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return res.status(404).send({ error: "Post not found." });
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
  res.status(201).send({ statusMsg: "Comment submitted!" });
});

/**
 * This API takes all the comments that are stored in a specific post and sends the comments back to the user.
 * @route GET /api/posts/:postId/comments
 * @returns {object} 200 - Returns an object that contains all comments
 * @returns {object} 200 - Returns an object that contains an error that states invalid id.
 */
app.get("/:postId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    });
    res.status(200).send({ comments });
  } catch (err) {
    res.status(500).send({ error: "Something went wrong..." });
  }
});

/**
 * This API gives permission to the user to edit a specific comment in a post only if he is authenticated
 * and is the owner of the comment.
 * @route GET /api/posts/:postId/comments/:commentId
 * @returns {object} 200 - Returns an object that gives auth: true.
 * @returns {object} 404 - Returns an object that contains an error if the post is not found.
 * @returns {object} 404 - Returns an object that contains an error if the comment is not found.
 */
app.get("/:postId/comments/:commentId", async (req, res) => {
  const post = await Post.find({
    _id: req.params.postId,
    userId: req.session.user._id,
  });
  if (!post) {
    return res.status(404).send({ error: "Post is not found." });
  }

  const comment = await Comment.find({
    _id: req.params.commentId,
    post: req.params.postId,
    userId: req.session.user._id,
  });
  if (!comment) {
    return res.status(404).send({ error: "Comment not found." });
  }
  res.send({ auth: true });
});

/**
 * This API takes the before edited, original comment text value and sends it back to the user when he
 * requests to edit the comment.
 * @route GET /api/posts/:postId/comments/:commentId/edit
 * @returns {string} 200 - Returns a string containing the original before edit comment.
 * @returns {object} 404 - Returns an object that contains an error if the post is not found.
 * @returns {object} 401 - Returns an object that contains an error if the user is not the owner of the comment.
 */
app.get("/:postId/comments/:commentId/edit", async (req, res) => {
  const post = await Post.find({
    _id: req.params.postId,
  });
  if (!post) {
    return res.status(404).send({ error: "Post not found." });
  }
  const comment = await Comment.findOne({
    _id: req.params.commentId,
    post: req.params.postId,
    userId: req.session.user._id,
  });
  if (comment.userId !== req.session.user._id) {
    return res
      .status(401)
      .send({ error: "You are not the owner of this comment." });
  }
  res.status(200).send(comment.body);
});

/**
 * This API takes the edited comment that the user have made and updates its text value in the comment database.
 * @route PUT /api/posts/:postId/comments/:commentId
 * @param {string} body.body.optional - The body of the comment
 * @returns {object} 201 - Returns an object that contains a statusMsg
 * @returns {object} 404 - Returns an object that contains an error if the post is not found.
 * @returns {object} 404 - Returns an object that contains an error if the comment is not found.
 * @returns {object} 500 - Returns an object that contains an error that something went wrong.
 */
app.put("/:postId/comments/:commentId", async (req, res) => {
  const post = await Post.find({
    _id: req.params.postId,
  });
  if (!post) {
    return res.status(404).send({ error: "Post not found." });
  }
  const comment = await Comment.findOne({
    _id: req.params.commentId,
    post: req.params.postId,
    userId: req.session.user._id,
  });
  if (!comment) {
    return res.status(404).send({ error: "Comment not found." });
  }
  try {
    comment.body = req.body.comment;
    await comment.save();
    res.status(201).send({ statusMsg: "Comment edit submitted!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Something went wrong." });
  }
});

/**
 * This API deletes user's specific comment from the database after authenticating that he is the
 * owner of the comment and decrements comment amount from the post's database.
 * @route DELETE /api/posts/:postId/comments/:commentId
 * @returns {object} 200 - Returns an object that contains a statusMsg
 * @returns {object} 404 - Returns an object that contains an error if the post is not found.
 * @returns {object} 404 - Returns an object that contains an error if the comment is not found.
 * @returns {object} 401 - Returns an object that contains an error if the user is not the owner of the comment.
 * @returns {object} 500 - Returns an object that contains an error deleting the post.
 */
app.delete("/:postId/comments/:commentId", async (req, res) => {
  const post = await Post.findOne({
    _id: req.params.postId,
  });
  if (!post) {
    return res.status(404).send({ error: "Post not found." });
  }
  const comment = await Comment.findOne({
    _id: req.params.commentId,
    post: req.params.postId,
    userId: req.session.user._id,
  });
  if (!comment) {
    return res.status(404).send({ error: "Comment not found." });
  }
  if (req.session.user._id !== comment.userId) {
    return res
      .status(401)
      .send({ error: "You are not the owner of this comment." });
  }
  try {
    await Comment.deleteOne({
      _id: req.params.commentId,
      post: req.params.postId,
      userId: req.session.user._id,
    });
    post.commentsCount--;
    await post.save();
    res.status(200).send({ statusMsg: "Comment has been deleted." });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Error deleting the comment." });
  }
});

/**
 * This API takes the current post text values from the database and sends them back
 * to the user when he requests to edit the post.
 * @route GET /api/posts/:postId
 * @returns {object} 200 - Returns an object that contains post data.
 * @returns {object} 404 - Returns an object that contains an error if the post is not found.
 * @returns {object} 500 - Returns an object that contains an error that states something went wrong.
 */
app.get("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).send({ error: "Post not found." });
    }
    res.send({ post });
  } catch (err) {
    res.status(500).send({ error: "Something went wrong..." });
  }
});

/**
 * This API takes the user's edited text values and updates the post values in the database.
 * @route PUT /api/posts/:postId
 * @param {string} title.body.optional - The title of the post
 * @param {string} body.body.optional - The body of the post
 * @returns {object} 201 - Returns an object that contains a statusMsg
 * @returns {object} 404 - Returns an object that contains an error if the post is not found.
 * @returns {object} 500 - Returns an object that contains an error stating that something went wrong.
 */
app.put("/:postId", async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
      userId: req.session.user._id,
    });

    if (!post) {
      return res.status(404).send({ error: "Post is not found" });
    }
    post.title = req.body.title;
    post.body = req.body.description;
    await post.save();
    res.status(201).send({ statusMsg: "Post edit is submitted" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Something went wrong" });
  }
});

/**
 * This API deletes a post from the database.
 * @route DELETE /api/posts/:postId
 * @returns {object} 200 - Returns an object that contains a statusMsg
 * @returns {object} 404 - Returns an object that contains an error if the post does not exit.
 * @returns {object} 401 - Returns an object that contains an error if the user is not the owner of the post.
 * @returns {object} 500 - Returns an object that contains an error stating that there is an error deleting the post.
 */
app.delete("/:postId", async (req, res) => {
  const post = await Post.findOne({
    _id: req.params.postId,
    userId: req.session.user._id,
  });
  if (!post) {
    return res.status(404).send({ error: "Post does not exist." });
  }
  if (post.userId !== req.session.user._id) {
    return res
      .status(401)
      .send({ error: "You are not the owner of the post!" });
  }
  try {
    await Post.deleteOne({
      _id: req.params.postId,
      userId: req.session.user._id,
    });
    res.status(200).send({ statusMsg: "Post deleted!" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Error deleting the post." });
  }
});

/**
 * This API takes the amount of votes up and votes down from the database and returns them to the user.
 * @route GET /api/posts/:postId/votes
 * @returns {number} 200 - Returns a number of up and down votes.
 * @returns {object} 404 - Returns an object that contains an error if the post is not found.
 * @returns {object} 500 - Returns an object that contains an error stating that there is an error in the voting system.
 */
app.get("/:postId/votes", async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
    });
    if (!post) {
      return res.status(404).send({ error: "Post not found." });
    }
    const votesUpCount = await PostVote.countDocuments({
      post: req.params.postId,
      vote: 1,
    });
    const votesDownCount = await PostVote.countDocuments({
      post: req.params.postId,
      vote: -1,
    });
    res.status(200).send({
      votesUpCount,
      votesDownCount,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ error: "Something went wrong with the voting system." });
  }
});

/**
 * This API takes user's up, down or updated vote and saves it to the database.
 * @route POST /api/posts/:postId/votes
 * @returns {object} 201 - Returns an object that states that vote has been changed.
 * @returns {object} 201 - Returns an object that states that vote has been made.
 * @returns {object} 403 - Returns an object that contains an error if the vote is not valid.
 * @returns {object} 404 - Returns an object that contains an error if the post is not found.
 */
app.post("/:postId/votes", async (req, res) => {
  //Validate if the vote is 1 or -1 and nothing else
  if (req.body.vote !== 1 && req.body.vote !== -1) {
    return res.status(403).send({ error: "Vote is not valid." });
  }
  //Validate if post exists
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return res.status(404).send({ error: "Post is not found." });
  }
  //Validate if vote has been already made
  const alreadyVoted = await PostVote.findOne({
    userId: req.session.user._id,
    post: req.params.postId,
  });
  if (alreadyVoted) {
    alreadyVoted.vote = req.body.vote;
    await alreadyVoted.save();
    return res.status(201).send({ statusMsg: "Vote has been changed." });
  }
  const vote = new PostVote({
    userId: req.session.user._id,
    post: req.params.postId,
    vote: req.body.vote,
  });
  await vote.save();
  res.status(201).send({ statusMsg: "Voted!" });
});

export default app;
