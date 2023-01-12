import { jest } from "@jest/globals";

// Creating a fake Post Schema (fake class) to mock the real one.
const Post = jest.fn();

//Creating a fake Comment Schema.
const Comment = jest.fn();

//Creating a fake PostVote Schema.
const PostVote = jest.fn();

//Mocking Post module (fake), mongodb can be off but tests run fine.
jest.unstable_mockModule("../Schemas/Post", () => {
  return {
    default: Post,
  };
});
//Mocking Comment module.
jest.unstable_mockModule("../Schemas/Comment", () => {
  return {
    default: Comment,
  };
});
//Mocking PostVote module.
jest.unstable_mockModule("../Schemas/PostVote", () => {
  return {
    default: PostVote,
  };
});

import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

let server;
let postRoutes;

describe("API route", () => {
  beforeAll(async () => {
    // Dynamically importing the routes because it contains the import of the Post Schema.
    // Therefore, we must mock the Post Schema before importing the routes.
    postRoutes = (await import("./post")).default;

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    //Simulate the session
    app.use((req, res, next) => {
      req.session = { user: { _id: "userId", fname: "John", lname: "Tester" } };
      req.body.comment = "commentBody";
      req.body.title = "titleBody";
      req.body.description = "descriptionBody";
      next();
    });
    app.use("/api/posts", postRoutes);
    server = app.listen(3000);
  });

  afterAll(() => {
    jest.resetAllMocks();
    return server.close();
  });

  describe("test GET /api/posts", () => {
    it("should return a 200 status code and Array of posts from DB", async () => {
      // Mocking the Post Schema (fake class) to return a fake response.
      //STATIC METHOD!!
      Post.find = jest.fn();
      //Creating a mocked response from mocked Post Schema (fake repsonse).
      const mockedPosts = [
        {
          bla: "blabla",
        },
      ];
      Post.find.mockResolvedValue(mockedPosts);

      const response = await axios.get("http://localhost:3000/api/posts");
      //Making sure we get back status 200 and that the post data is returned aswell.
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(mockedPosts);
    });
    it("should return a 500 status code and an error message", async () => {
      Post.find = jest.fn();
      Post.find.mockRejectedValue(new Error("Oops"));
      let error = null;
      try {
        await axios.get("http://localhost:3000/api/posts");
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({
        error: "Something went wrong with the posts system",
      });
    });
  });
  describe("test POST /api/posts", () => {
    it("should respond with error when title or description inputs are empty", async () => {
      let error = null;
      try {
        await axios.post("http://localhost:3000/api/posts", {
          title: "",
          body: "",
        });
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({
        statusMsg: "Please fill all the inputs.",
      });
    });
    it("should save the post input data into the db and respond with success", async () => {
      const mockedSave = jest.fn();

      Post.mockReturnValue({
        save: mockedSave,
      });

      const response = await axios.post("http://localhost:3000/api/posts", {
        title: "title",
        body: "description",
      });

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ statusMsg: "Submitted!" });
      await expect(Post).toHaveBeenCalled();
    });
    it("should throw an error if saving post has failed", async () => {
      const mockedSave = jest.fn();
      mockedSave.mockRejectedValue(new Error("Oops"));

      //used for Class, when there IS - 'new Post', no functions.
      Post.mockReturnValue({
        save: mockedSave,
      });
      let error = null;
      try {
        await axios.post("http://localhost:3000/api/posts", {
          title: "A title",
          body: "Description",
        });
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({
        statusMsg: "Something went wrong...",
      });
    });
  });
  describe("test GET /api/posts/:postId", () => {
    it("should throw an error with status 404 and an error message if post is not found", async () => {
      Post.findById = jest.fn();

      //Notice that there is no 'new Post' in the post.js.
      Post.findById.mockResolvedValue(null);

      let error = null;
      try {
        await axios.get("http://localhost:3000/api/posts/testId");
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({
        error: "Post not found.",
      });
      expect(error.response.status).toBe(404);
      expect(Post.findById).toHaveBeenCalledWith("testId");
    });
    it("should return a status of 200 and send back the post", async () => {
      Post.findById = jest.fn();
      const mockedPost = [
        {
          test: "test",
        },
      ];
      Post.findById.mockResolvedValue(mockedPost);
      const response = await axios.get(
        "http://localhost:3000/api/posts/testId"
      );
      expect(response.data).toEqual(mockedPost);
      expect(response.status).toBe(200);
      expect(Post.findById).toHaveBeenCalledWith("testId");
    });
    it("should throw an error with status 500 if something went wrong with finding the post", async () => {
      Post.findById = jest.fn();
      Post.findById.mockRejectedValue(new Error("Oops"));
      let error = null;
      try {
        await axios.get("http://localhost:3000/api/posts/testId");
      } catch (err) {
        error = err;
      }
      expect(Post.findById).toHaveBeenCalledWith("testId");
      expect(error.response.data).toEqual({
        error: "Something went wrong...",
      });
      expect(error.response.status).toBe(500);
    });
  });
  describe("test POST /api/posts/:postId/comments", () => {
    it("should return an error with status 404 when a post is not found.", async () => {
      Post.findById = jest.fn();
      Post.findById.mockResolvedValue(null);
      let error = null;
      try {
        await axios.post("http://localhost:3000/api/posts/testId/comments", {
          body: "commentTest",
        });
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({
        error: "Post not found.",
      });
      expect(Post.findById).toHaveBeenCalledWith("testId");
      expect(error.response.status).toBe(404);
    });
    it("should increment comment count of the post, save the comment and post data into db and return success message with status 201", async () => {
      //Notice that findById returns a singular Object and NOT array of objects.
      //Therefore the mockedPost will have only {} and not [{}].
      Post.findById = jest.fn();

      const mockedPost = {
        test: "test",
        save: jest.fn(),
        commentsCount: 0,
      };
      Post.findById.mockResolvedValue(mockedPost);

      const CommentMockedSave = jest.fn();

      Comment.mockReturnValue({
        save: CommentMockedSave,
      });

      const response = await axios.post(
        "http://localhost:3000/api/posts/testId/comments",
        {
          body: "CommentTest",
        }
      );
      //To see if the comment amount on a post has incremented after comment has been made.
      let newCommentCount = mockedPost.commentsCount;

      expect(Post.findById).toHaveBeenCalled();
      expect(Post.findById).toHaveBeenCalledWith("testId");
      await expect(Comment).toHaveBeenCalled();
      expect(response.status).toBe(201);
      expect(response.data).toEqual({ statusMsg: "Comment submitted!" });
      expect(newCommentCount).toBe(1);
    });
  });
  describe("test GET /api/posts/:postId/comments", () => {
    it("should return all comments of a specific post with status 200", async () => {
      Comment.find = jest.fn();
      const mockedComments = [
        {
          test: "test",
        },
      ];
      Comment.find.mockResolvedValue(mockedComments);
      const response = await axios.get(
        "http://localhost:3000/api/posts/testId/comments"
      );
      expect(response.data.comments).toEqual(mockedComments);
      expect(response.status).toBe(200);
    });

    it("should return an error message with status 500", async () => {
      Comment.find = jest.fn();
      Comment.find.mockRejectedValue(new Error("Oops"));
      let error = null;
      try {
        await axios.get("http://localhost:3000/api/posts/testId/comments");
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Something went wrong..." });
      expect(error.response.status).toBe(500);
      expect(Comment.find).toHaveBeenCalledWith({ post: "testId" });
    });
  });

  describe("test GET /api/posts/:postId/comments/:commentId", () => {
    it("should return an error message and status 404 if post is not found", async () => {
      Post.find = jest.fn();
      Post.find.mockResolvedValue(null);
      let error = null;
      try {
        await axios.get(
          "http://localhost:3000/api/posts/testId/comments/commentTestId"
        );
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Post is not found." });
      expect(error.response.status).toBe(404);
      expect(Post.find).toHaveBeenCalledWith({
        _id: "testId",
        userId: "userId",
      });
    });
    it("should return an error message and status 404 if comment not found", async () => {
      //Make sure to resolve the post itself and THEN deal with the comment as shown below.
      Post.find = jest.fn();
      const mockedPost = [
        {
          test: "test",
        },
      ];
      Post.find.mockResolvedValue(mockedPost);

      Comment.find = jest.fn();
      Comment.find.mockResolvedValue(null);
      let error = null;
      try {
        await axios.get(
          "http://localhost:3000/api/posts/testId/comments/commentTestId"
        );
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Comment not found." });
      expect(Comment.find).toHaveBeenCalledWith({
        _id: "commentTestId",
        post: "testId",
        userId: "userId",
      });
      expect(error.response.status).toBe(404);
    });
    it("should return authentication to the user", async () => {
      Post.find = jest.fn();
      const mockedPost = [
        {
          test: "postTest",
        },
      ];
      Post.find.mockResolvedValue(mockedPost);

      Comment.find = jest.fn();
      const mockedComment = [
        {
          test: "commentTest",
        },
      ];
      Comment.find.mockResolvedValue(mockedComment);

      const response = await axios.get(
        "http://localhost:3000/api/posts/testId/comments/commentTestId"
      );
      expect(response.data).toEqual({ auth: true });
    });
  });
  describe("test GET /api/posts/:postId/comments/:commentId/edit", () => {
    it("should return error message with status 404 if post is not found", async () => {
      Post.find = jest.fn();
      Post.find.mockResolvedValue(null);
      let error = null;
      try {
        await axios.get(
          "http://localhost:3000/api/posts/testId/comments/commentTestId/edit"
        );
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Post not found." });
      expect(error.response.status).toBe(404);
      expect(Post.find).toHaveBeenCalledWith({
        _id: "testId",
      });
    });
    it("should return error message with status 401 if user is not the owner of the comment", async () => {
      Post.find = jest.fn();
      const mockedPost = [
        {
          test: "test",
        },
      ];
      Post.find.mockResolvedValue(mockedPost);

      Comment.findOne = jest.fn();
      const mockedComment = {
        userId: "123",
      };

      Comment.findOne.mockResolvedValue(mockedComment);

      let error = null;
      try {
        await axios.get(
          "http://localhost:3000/api/posts/testId/comments/commentTestId/edit"
        );
      } catch (err) {
        error = err;
      }
      expect(error.response.status).toBe(401);
      expect(error.response.data).toEqual({
        error: "You are not the owner of this comment.",
      });
      expect(Post.find).toHaveBeenCalledWith({
        _id: "testId",
      });
      expect(Comment.findOne).toHaveBeenCalledWith({
        _id: "commentTestId",
        post: "testId",
        userId: "userId",
      });
    });
    it("should return original comment body and status 200", async () => {
      Post.find = jest.fn();
      const mockedPost = [
        {
          test: "test",
        },
      ];
      Post.find.mockResolvedValue(mockedPost);

      Comment.findOne = jest.fn();
      const mockedComment = {
        body: "blabla",
        userId: "userId",
      };

      Comment.findOne.mockResolvedValue(mockedComment);

      const response = await axios.get(
        "http://localhost:3000/api/posts/testId/comments/commentTestId/edit"
      );

      expect(response.data).toEqual(mockedComment.body);
      expect(response.status).toBe(200);
    });
  });
  describe("test PUT /api/posts/:postId/comments/:commentId", () => {
    it("should return an error message with status 404 if post is not found.", async () => {
      Post.find = jest.fn();
      Post.find.mockResolvedValue(null);
      let error = null;
      try {
        await axios.put(
          "http://localhost:3000/api/posts/testId/comments/commentTestId"
        );
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Post not found." });
      expect(error.response.status).toBe(404);
    });
    it("should return an error message with status 404 if comment is not found.", async () => {
      Post.find = jest.fn();
      const mockedPost = [
        {
          test: "test",
        },
      ];
      Post.find.mockResolvedValue(mockedPost);

      Comment.findOne = jest.fn();
      Comment.findOne.mockResolvedValue(null);
      let error = null;
      try {
        await axios.put(
          "http://localhost:3000/api/posts/testId/comments/commentTestId"
        );
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Comment not found." });
      expect(error.response.status).toBe(404);
    });
    it("should save a comment to db, send back a message and status of 201", async () => {
      Post.find = jest.fn();
      const mockedPost = [
        {
          test: "test",
        },
      ];
      Post.find.mockResolvedValue(mockedPost);

      Comment.findOne = jest.fn();
      //Notice the req.body.comment = 'commentBody' on top of the document.
      const mockedComment = {
        body: "test",
        save: jest.fn(),
      };

      Comment.findOne.mockResolvedValue(mockedComment);

      const response = await axios.put(
        "http://localhost:3000/api/posts/testId/comments/commentTestId"
      );

      expect(response.data).toEqual({ statusMsg: "Comment edit submitted!" });
      expect(response.status).toBe(201);
      expect(Comment).toHaveBeenCalled();
      expect(Post.find).toHaveBeenCalledWith({
        _id: "testId",
      });
      expect(Comment.findOne).toHaveBeenCalledWith({
        _id: "commentTestId",
        post: "testId",
        userId: "userId",
      });
    });
    it("should return an error message and status of 500", async () => {
      Post.find = jest.fn();
      const mockedPost = [
        {
          test: "test",
        },
      ];
      Post.find.mockResolvedValue(mockedPost);

      Comment.findOne = jest.fn();
      const mockedComment = {
        body: "test",
        save: null,
      };

      Comment.findOne.mockResolvedValue(mockedComment);
      let error = null;
      try {
        await axios.put(
          "http://localhost:3000/api/posts/testId/comments/commentTestId"
        );
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Something went wrong." });
      expect(error.response.status).toBe(500);
      expect(Comment).toHaveBeenCalled();
      expect(Post.find).toHaveBeenCalledWith({
        _id: "testId",
      });
      expect(Comment.findOne).toHaveBeenCalledWith({
        _id: "commentTestId",
        post: "testId",
        userId: "userId",
      });
    });
  });
  describe("test DELETE /api/posts/:postId/comments/:commentId", () => {
    it("should return error message and status 404 if post not found.", async () => {
      Post.findOne = jest.fn();
      Post.findOne.mockResolvedValue(null);
      let error = null;
      try {
        await axios.delete(
          "http://localhost:3000/api/posts/testId/comments/commentTestId"
        );
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Post not found." });
      expect(error.response.status).toBe(404);
      expect(Post.findOne).toHaveBeenCalledWith({
        _id: "testId",
      });
    });
    it("should return error message and status 404 if comment not found.", async () => {
      Post.findOne = jest.fn();
      const mockedPost = [
        {
          test: "test",
        },
      ];
      Post.findOne.mockResolvedValue(mockedPost);

      Comment.findOne = jest.fn();
      Comment.findOne.mockResolvedValue(null);
      let error = null;
      try {
        await axios.delete(
          "http://localhost:3000/api/posts/testId/comments/commentTestId"
        );
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Comment not found." });
      expect(error.response.status).toBe(404);
      expect(Post.findOne).toHaveBeenCalledWith({
        _id: "testId",
      });
      expect(Comment.findOne).toHaveBeenCalledWith({
        _id: "commentTestId",
        post: "testId",
        userId: "userId",
      });
    });
    it("should return error message and status 401 if user is not the owner of the comment", async () => {
      Post.findOne = jest.fn();
      const mockedPost = [
        {
          test: "test",
        },
      ];
      Post.findOne.mockResolvedValue(mockedPost);

      Comment.findOne = jest.fn();
      const mockedComment = {
        test: "commentTest",
        userId: "invalidUser",
      };
      Comment.findOne.mockResolvedValue(mockedComment);
      let error = null;
      try {
        await axios.delete(
          "http://localhost:3000/api/posts/testId/comments/commentTestId"
        );
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({
        error: "You are not the owner of this comment.",
      });
      expect(error.response.status).toBe(401);
      expect(Post.findOne).toHaveBeenCalledWith({
        _id: "testId",
      });
      expect(Comment.findOne).toHaveBeenCalledWith({
        _id: "commentTestId",
        post: "testId",
        userId: "userId",
      });
    });
    it("should delete a comment, decrement comment count, save the post to db, send message and status 200", async () => {
      Post.findOne = jest.fn();
      const mockedPost = {
        test: "test",
        save: jest.fn(),
        commentsCount: 1,
      };
      Post.findOne.mockResolvedValue(mockedPost);

      Comment.findOne = jest.fn();
      const mockedComment = {
        _id: "commentTestId",
        post: "testId",
        userId: "userId",
      };
      Comment.findOne.mockResolvedValue(mockedComment);

      Comment.deleteOne = jest.fn();
      Comment.deleteOne.mockResolvedValue(mockedComment);

      const response = await axios.delete(
        "http://localhost:3000/api/posts/testId/comments/commentTestId"
      );
      let updatedCommentCount = mockedPost.commentsCount;

      expect(response.data).toEqual({ statusMsg: "Comment has been deleted." });
      expect(response.status).toBe(200);
      expect(Post).toHaveBeenCalled();
      expect(Post.findOne).toHaveBeenCalledWith({
        _id: "testId",
      });
      expect(Comment.findOne).toHaveBeenCalledWith({
        _id: "commentTestId",
        post: "testId",
        userId: "userId",
      });
      expect(updatedCommentCount).toBe(0);
    });
    it("should return an error message with status of 500", async () => {
      Post.findOne = jest.fn();
      const mockedPost = {
        test: "test",
        save: jest.fn(),
        commentsCount: 1,
      };
      Post.findOne.mockResolvedValue(mockedPost);

      Comment.findOne = jest.fn();
      const mockedComment = {
        _id: "commentTestId",
        post: "testId",
        userId: "userId",
      };
      Comment.findOne.mockResolvedValue(mockedComment);

      Comment.deleteOne = jest.fn();
      Comment.deleteOne.mockRejectedValue(new Error("Oops"));
      let error = null;
      try {
        await axios.delete(
          "http://localhost:3000/api/posts/testId/comments/commentTestId"
        );
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({
        error: "Error deleting the comment.",
      });
      expect(error.response.status).toBe(500);
      expect(Post).toHaveBeenCalled();
      expect(Post.findOne).toHaveBeenCalledWith({
        _id: "testId",
      });
      expect(Comment.findOne).toHaveBeenCalledWith({
        _id: "commentTestId",
        post: "testId",
        userId: "userId",
      });
      expect(Comment.deleteOne).toHaveBeenCalledWith({
        _id: "commentTestId",
        post: "testId",
        userId: "userId",
      });
    });
  });
  describe("test GET /api/posts/:postId for editing a post", () => {
    it("should return an error message and status 404 if post not found.", async () => {
      Post.findById = jest.fn();
      Post.findById.mockResolvedValue(null);
      let error = null;
      try {
        await axios.get("http://localhost:3000/api/posts/testId");
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Post not found." });
      expect(error.response.status).toBe(404);
    });
    it("should send back the post itself to the client", async () => {
      Post.findById = jest.fn();
      const mockedPost = {
        test: "test",
      };
      Post.findById.mockResolvedValue(mockedPost);
      const response = await axios.get(
        "http://localhost:3000/api/posts/testId"
      );
      expect(response.data).toEqual(mockedPost);
      expect(Post.findById).toHaveBeenCalledWith("testId");
    });
    it("should return an error message and status 500", async () => {
      Post.findById = jest.fn();
      Post.findById.mockRejectedValue(new Error("Oops"));
      let error = null;
      try {
        await axios.get("http://localhost:3000/api/posts/testId");
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Something went wrong..." });
      expect(error.response.status).toBe(500);
      expect(Post.findById).toHaveBeenCalledWith("testId");
    });
  });
  describe("test PUT /api/posts/:postId for editing a post", () => {
    it("should return an error message with status 404 if post not found.", async () => {
      Post.findOne = jest.fn();
      Post.findOne.mockResolvedValue(null);
      let error = null;
      try {
        await axios.put("http://localhost:3000/api/posts/testId");
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Post is not found" });
      expect(error.response.status).toBe(404);
      expect(Post.findOne).toHaveBeenCalledWith({
        _id: "testId",
        userId: "userId",
      });
    });
    it("should save edited post to db and return a message with status 201", async () => {
      Post.findOne = jest.fn();
      const mockedPost = {
        title: "titleTest",
        body: "bodyTest",
        save: jest.fn(),
      };
      Post.findOne.mockResolvedValue(mockedPost);

      const response = await axios.put(
        "http://localhost:3000/api/posts/testId"
      );
      expect(response.data).toEqual({ statusMsg: "Post edit is submitted" });
      expect(response.status).toBe(201);
      expect(mockedPost.title).toBe("titleBody");
      expect(mockedPost.body).toBe("descriptionBody");
      expect(Post.findOne).toHaveBeenCalledWith({
        _id: "testId",
        userId: "userId",
      });
      expect(Post).toHaveBeenCalled();
    });
    it("should return an error message and status 500", async () => {
      Post.findOne = jest.fn();
      Post.findOne.mockRejectedValue(new Error("Oops"));
      let error = null;
      try {
        await axios.put("http://localhost:3000/api/posts/testId");
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Something went wrong" });
      expect(error.response.status).toBe(500);
      expect(Post.findOne).toHaveBeenCalledWith({
        _id: "testId",
        userId: "userId",
      });
    });
  });
  describe("test DELETE /api/posts/:postId for deleting a post", () => {
    it("should return an error message with status 404 if post not found.", async () => {
      Post.findOne = jest.fn();
      Post.findOne.mockResolvedValue(null);
      let error = null;
      try {
        await axios.delete("http://localhost:3000/api/posts/testId");
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Post does not exist." });
      expect(error.response.status).toBe(404);
      expect(Post.findOne).toHaveBeenCalledWith({
        _id: "testId",
        userId: "userId",
      });
    });
    it("should return an error message with status 401 if the user is not the owner of the post", async () => {
      Post.findOne = jest.fn();
      const mockedPost = {
        userId: "invalidUserId",
      };
      Post.findOne.mockResolvedValue(mockedPost);
      let error = null;
      try {
        await axios.delete("http://localhost:3000/api/posts/testId");
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({
        error: "You are not the owner of the post!",
      });
      expect(error.response.status).toBe(401);
      expect(Post.findOne).toHaveBeenCalledWith({
        _id: "testId",
        userId: "userId",
      });
    });
    it("should delete a post and return a message with status 200", async () => {
      Post.findOne = jest.fn();
      const mockedPost = {
        userId: "userId",
      };
      Post.findOne.mockResolvedValue(mockedPost);

      Post.deleteOne = jest.fn();
      Post.deleteOne.mockResolvedValue(mockedPost);
      const response = await axios.delete(
        "http://localhost:3000/api/posts/testId"
      );
      expect(response.data).toEqual({ statusMsg: "Post deleted!" });
      expect(response.status).toBe(200);
      expect(Post.findOne).toHaveBeenCalledWith({
        _id: "testId",
        userId: "userId",
      });
      expect(Post.deleteOne).toHaveBeenCalledWith({
        _id: "testId",
        userId: "userId",
      });
    });
    it("should return an error message with status 500", async () => {
      Post.findOne = jest.fn();
      const mockedPost = {
        userId: "userId",
      };
      Post.findOne.mockResolvedValue(mockedPost);
      Post.deleteOne = jest.fn();
      Post.deleteOne.mockRejectedValue(new Error("Oops"));
      let error = null;
      try {
        await axios.delete("http://localhost:3000/api/posts/testId");
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({
        error: "Error deleting the post.",
      });
      expect(error.response.status).toBe(500);
    });
  });
  describe("test GET /api/posts/:postId/votes", () => {
    it("should return error message with status 404 if post not found", async () => {
      Post.findOne = jest.fn();
      Post.findOne.mockResolvedValue(null);
      let error = null;
      try {
        await axios.get("http://localhost:3000/api/posts/testId/votes");
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Post not found." });
      expect(error.response.status).toBe(404);
      expect(Post.findOne).toHaveBeenCalledWith({
        _id: "testId",
      });
    });
    it("should return votes up and down amount of a post with status 200", async () => {
      Post.findOne = jest.fn();
      const mockedPost = {
        test: "test",
      };
      Post.findOne.mockResolvedValue(mockedPost);
      PostVote.countDocuments = jest.fn();

      const votesUpCount = [
        { post: "testId", vote: 1 },
        { post: "testId", vote: 1 },
      ];
      const votesDownCount = [
        { post: "testId", vote: -1 },
        { post: "testId", vote: -1 },
        { post: "testId", vote: -1 },
      ];

      PostVote.countDocuments
        .mockResolvedValueOnce(votesUpCount)
        .mockResolvedValueOnce(votesDownCount);

      const response = await axios.get(
        "http://localhost:3000/api/posts/testId/votes"
      );
      expect(response.data.votesUpCount).toHaveLength(2);
      expect(response.data.votesDownCount).toHaveLength(3);
      expect(PostVote.countDocuments).toHaveBeenCalledTimes(2);
      expect(response.status).toBe(200);
      expect(Post.findOne).toHaveBeenCalledWith({
        _id: "testId",
      });
    });
    it("should return error message with status 500", async () => {
      Post.findOne = jest.fn();
      PostVote.countDocuments = jest.fn();
      const mockedPost = {
        test: "test",
      };
      Post.findOne.mockResolvedValue(mockedPost);

      PostVote.countDocuments.mockRejectedValueOnce(new Error("Vote Oops"));
      let error = null;
      try {
        await axios.get("http://localhost:3000/api/posts/testId/votes");
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({
        error: "Something went wrong with the voting system.",
      });
      expect(error.response.status).toBe(500);
      expect(Post.findOne).toHaveBeenCalledWith({
        _id: "testId",
      });
      expect(PostVote.countDocuments).toHaveBeenCalledWith({
        post: "testId",
        vote: 1,
      });
    });
  });
  describe("test POST /api/posts/:postId/votes", () => {
    it("should return an error message and status 403 if vote is not valid.", async () => {
      let error = null;
      try {
        await axios.post("http://localhost:3000/api/posts/testId/votes", {
          vote: 2,
        });
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Vote is not valid." });
      expect(error.response.status).toBe(403);
    });
    it("should return an error message and status 404 if post not found.", async () => {
      Post.findById = jest.fn();
      Post.findById.mockResolvedValue(null);
      let error = null;
      try {
        await axios.post("http://localhost:3000/api/posts/testId/votes", {
          vote: 1,
        });
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({ error: "Post is not found." });
      expect(error.response.status).toBe(404);
      expect(Post.findById).toHaveBeenCalledWith("testId");
    });
    it("should return a message with status 201 when vote has been changed.", async () => {
      Post.findById = jest.fn();
      const mockedPost = {
        test: "test",
      };
      Post.findById.mockResolvedValue(mockedPost);

      PostVote.findOne = jest.fn();

      const mockedPostVote = {
        userId: "userId",
        post: "testId",
        vote: 1,
        save: jest.fn(),
      };

      PostVote.findOne.mockResolvedValue(mockedPostVote);

      const response = await axios.post(
        "http://localhost:3000/api/posts/testId/votes",
        {
          vote: -1,
        }
      );
      let changedVote = mockedPostVote.vote;
      expect(changedVote).toBe(-1);
      expect(response.data).toEqual({ statusMsg: "Vote has been changed." });
      expect(response.status).toBe(201);
      expect(Post.findById).toHaveBeenCalledWith("testId");
      expect(PostVote.findOne).toHaveBeenCalled();
    });
    it("should return a message with status 201 when vote has been made.", async () => {
      Post.findById = jest.fn();
      const mockedPost = {
        _id: "testId123",
      };
      Post.findById.mockResolvedValue(mockedPost);
      PostVote.findOne = jest.fn();
      PostVote.findOne.mockResolvedValue(null);

      const mockedSave = jest.fn();

      PostVote.mockReturnValue({
        userId: "userId",
        post: "testId123",
        vote: 0,
        save: mockedSave,
      });
      const response = await axios.post(
        "http://localhost:3000/api/posts/testId123/votes",
        {
          vote: 1,
        }
      );
      expect(PostVote).toHaveBeenCalledWith({
        userId: "userId",
        post: "testId123",
        vote: 1,
      });
      expect(response.data).toEqual({ statusMsg: "Voted!" });
      expect(response.status).toBe(201);
      expect(Post.findById).toHaveBeenCalledWith("testId123");
      expect(PostVote.findOne).toHaveBeenCalled();
    });
  });
});
