import { jest } from "@jest/globals";


const Post = {
  save: jest.fn(),
  find: jest.fn(),
};

//Mocking Post module (fake), mongodb can be off but tests run fine.
jest.unstable_mockModule('../Schemas/Post', () => {
  return {
    default: function () {
      return Post;
    },
  };
});

import axios from "axios";
import express from "express";
import bodyParser from "body-parser";
import postRoutes from "./post";

let server;
// let Post = (await import('../Schemas/Post')).default;
describe("API route", () => {
  beforeAll((done) => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    //Simulate the session
    app.use((req, res, next) => {
      req.session = { user: { _id: "userid", fname: "John", lname: "Tester" } };
      next();
    });
    app.use("/api/posts", postRoutes);
    server = app.listen(3000, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe("test GET /api/posts", () => {
    it("should return a 200 status code and Array of posts from DB", async () => {
      //Post(Schema) is a class, then we must use spyOn.
      const mockedPostFind = Post.find;
      //Creating a mocked response from mocked Post Schema (fake repsonse).
      const mockedPosts = [
        {
          bla: "blabla",
        },
      ];
      mockedPostFind.mockResolvedValue(mockedPosts);
      const response = await axios.get("http://localhost:3000/api/posts");
      //Making sure we get back status 200 and that the post data is returned aswell.
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(mockedPosts);
    });
    it("should return a 500 status code and an error message", async () => {
      const mockedPostFind = Post.find;
      mockedPostFind.mockRejectedValue(new Error("Oops"));
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
    it.only("should save the post input data into the db and respond with success", async () => {
      Post.save.mockResolvedValue(true);
      const response = await axios.post("http://localhost:3000/api/posts", {
        title: "title",
        body: "description",
      });
      
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ statusMsg: "Submitted!" });
      expect(Post.save).toHaveBeenCalled();
    });
    it("should throw an error if saving post has failed", async () => {});
  });
});
