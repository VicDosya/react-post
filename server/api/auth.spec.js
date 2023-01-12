import { jest } from "@jest/globals";

//Creating a fake UserDetails Schema.
const UserDetails = jest.fn();

//Mocking UserDetails module (fake), mongodb can be off but tests run fine.
jest.unstable_mockModule("../Schemas/UserDetails", () => {
  return {
    default: UserDetails,
  };
});

import axios from "axios";
import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";

let server;
let authRoutes;
let session = { user: { _id: "userId", fname: "John", lname: "Tester" } };
describe("API route", () => {
  beforeAll(async () => {
    // Dynamically importing the routes because it contains the import of the Post Schema.
    // Therefore, we must mock the Post Schema before importing the routes.
    authRoutes = (await import("./auth")).default;
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    //Simulate the session
    app.use((req, res, next) => {
      req.session = session;
      next();
    });
    app.use("/api/auth", authRoutes);
    server = app.listen(3000);
  });

  afterAll(() => {
    jest.resetAllMocks();
    return server.close();
  });

  describe("API auth route", () => {
    describe("test POST /api/auth/register", () => {
      it("should save user data to db, return a message with status 201", async () => {
        UserDetails.findOne = jest.fn();
        UserDetails.findOne.mockResolvedValue(null);

        const mockedSave = jest.fn();
        UserDetails.mockReturnValue({
          save: mockedSave,
        });
        const response = await axios.post(
          "http://localhost:3000/api/auth/register",
          {
            fname: "Tester",
            lname: "Testing",
            email: "tester@gmail.com",
            password: "Tester123", //Case sensitive!
          }
        );
        expect(response.data).toEqual({ message: "Success" });
        expect(response.status).toBe(201);
        expect(UserDetails).toHaveBeenCalled();
      });
      it("should return a message with status 403", async () => {
        UserDetails.findOne = jest.fn();
        const mockedUser = {
          email: "ExistingEmail@gmail.com",
        };
        UserDetails.findOne.mockResolvedValue(mockedUser);
        let error = null;
        try {
          await axios.post("http://localhost:3000/api/auth/register", {
            email: "ExistingEmail@gmail.com",
          });
        } catch (err) {
          error = err;
        }
        expect(error.response.data).toEqual({
          message: "This user already exists",
        });
        expect(error.response.status).toBe(403);
      });
      it("should return an error message and status 400", async () => {
        UserDetails.findOne = jest.fn();
        UserDetails.findOne.mockResolvedValue(null);
        let error = null;
        try {
          await axios.post("http://localhost:3000/api/auth/register", {
            fname: "Tester",
            lname: "Testing",
            email: "tester@gmail.com",
            password: "tester123", //Case sensitive!
          });
        } catch (err) {
          error = err;
        }
        expect(error.response.data).toEqual({
          message: "One or more input fields are not valid.",
        });
        expect(error.response.status).toBe(400);
      });
    });
    describe("test POST /api/auth/login", () => {
      it("should return back session with status 200 if the user already logged in", async () => {
        const response = await axios.post(
          "http://localhost:3000/api/auth/login"
        );
        expect(response.data).toEqual({
          _id: "userId",
          fname: "John",
          lname: "Tester",
        });
        expect(response.status).toBe(200);
      });
      it("should return an error message with status 404 is user does not exists", async () => {
        UserDetails.findOne = jest.fn();
        UserDetails.findOne.mockResolvedValue(null);
        let error = null;

        //Remove user from the session
        session.user = null;
        try {
          await axios.post("http://localhost:3000/api/auth/login");
        } catch (err) {
          error = err;
        }
        expect(error.response.data).toEqual({
          message: "User does not exist.",
        });
        expect(error.response.status).toBe(404);
      });
      it("should return an error message with status 401 if password is incorrect", async () => {
        //Remove user from the session
        session.user = null;

        UserDetails.findOne = jest.fn();
        const mockedUser = {
          email: "ExistingEmail@gmail.com",
          password: "Tester123",
        };
        UserDetails.findOne.mockResolvedValue(mockedUser);
        //Mocking bcrypt to return us the false comparison.
        bcrypt.compare = jest.fn();
        bcrypt.compare.mockResolvedValue(false);
        let error = null;
        try {
          await axios.post("http://localhost:3000/api/auth/login", {
            password: "Tester11111",
          });
        } catch (err) {
          error = err;
        }
        expect(error.response.data).toEqual({ message: "Incorrect password." });
        expect(error.response.status).toBe(401);
      });
      it("should return session with status 202 when log in successful", async () => {
        //Remove user from the session
        session.user = null;

        UserDetails.findOne = jest.fn();
        const mockedUser = {
          email: "ExistingEmail@gmail.com",
          password: "Tester123",
        };
        UserDetails.findOne.mockResolvedValue(mockedUser);
        //Mocking bcrypt to return us the false comparison.
        bcrypt.compare = jest.fn();
        bcrypt.compare.mockResolvedValue(true);

        const response = await axios.post(
          "http://localhost:3000/api/auth/login",
          {
            email: "ExistingEmail@gmail.com",
            password: "Tester123",
          }
        );

        expect(response.data).toEqual({
          message: "Logged in, Redirecting...",
          user: {
            email: "ExistingEmail@gmail.com",
            password: "Tester123",
          },
        });
        expect(response.status).toBe(202);
      });
    });
    describe("test GET /api/auth/profile", () => {
      it("should return back session with status 200", async () => {
        session.user = {
          _id: "userId",
          fname: "John",
          lname: "Tester",
          email: "ExistingEmail@gmail.com",
          password: "Tester123",
        };
        const response = await axios.get(
          "http://localhost:3000/api/auth/profile"
        );
        expect(response.data).toEqual({
          _id: "userId",
          fname: "John",
          lname: "Tester",
          email: "ExistingEmail@gmail.com",
          password: "Tester123",
        });
        expect(response.status).toBe(200);
      });
      it("should return error message with status 401 if user not logged in", async () => {
        session.user = null;
        let error = null;
        try{
            await axios.get(
                "http://localhost:3000/api/auth/profile"
              );
        } catch(err) {
            error = err;
        };
        expect(error.response.data).toEqual({ message: "User not logged in." });
        expect(error.response.status).toBe(401);
      });
    });
    describe('test GET /api/auth/logout', () => {
        it('should return a message with status 200', async () => {
            session.user = {
                _id: "userId",
                fname: "John",
                lname: "Tester",
                email: "ExistingEmail@gmail.com",
                password: "Tester123",
              };
              const response = await axios.get("http://localhost:3000/api/auth/logout");
              expect(response.data).toEqual({ status: "Logged out..." });
              expect(response.status).toBe(200);
              expect(session.user).toBe(null);
        });
    });
  });
});
