import { jest } from '@jest/globals';

// Creating a fake Post Schema (fake class) to mock the real one.
const Post = jest.fn();

//Mocking Post module (fake), mongodb can be off but tests run fine.
jest.unstable_mockModule('../Schemas/Post', () => {
  return {
    default: Post,
  };
});

import axios from 'axios';
import express from 'express';
import bodyParser from 'body-parser';

let server;
let postRoutes;

describe('API route', () => {
  beforeAll(async () => {
    // Dynamically importing the routes because it contains the import of the Post Schema.
    // Therefore, we must mock the Post Schema before importing the routes.
    postRoutes = (await import('./post')).default;

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    //Simulate the session
    app.use((req, res, next) => {
      req.session = { user: { _id: 'userid', fname: 'John', lname: 'Tester' } };
      next();
    });
    app.use('/api/posts', postRoutes);
    server = app.listen(3000);
  });

  afterAll(() => {
    jest.resetAllMocks();
    return server.close();
  });

  describe('test GET /api/posts', () => {
    it('should return a 200 status code and Array of posts from DB', async () => {
      // Mocking the Post Schema (fake class) to return a fake response.
      Post.find = jest.fn();
      //Creating a mocked response from mocked Post Schema (fake repsonse).
      const mockedPosts = [
        {
          bla: 'blabla',
        },
      ];
      Post.find.mockResolvedValue(mockedPosts);

      const response = await axios.get('http://localhost:3000/api/posts');
      //Making sure we get back status 200 and that the post data is returned aswell.
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(mockedPosts);
    });
    it('should return a 500 status code and an error message', async () => {
      Post.find = jest.fn();
      Post.find.mockRejectedValue(new Error('Oops'));
      let error = null;
      try {
        await axios.get('http://localhost:3000/api/posts');
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({
        error: 'Something went wrong with the posts system',
      });
    });
  });
  describe('test POST /api/posts', () => {
    it('should respond with error when title or description inputs are empty', async () => {
      let error = null;
      try {
        await axios.post('http://localhost:3000/api/posts', {
          title: '',
          body: '',
        });
      } catch (err) {
        error = err;
      }
      expect(error.response.data).toEqual({
        statusMsg: 'Please fill all the inputs.',
      });
    });
    it('should save the post input data into the db and respond with success', async () => {
      const mockedSave = jest.fn();

      Post.mockReturnValue({
        save: mockedSave,
      });

      const response = await axios.post('http://localhost:3000/api/posts', {
        title: 'title',
        body: 'description',
      });

      expect(response.status).toBe(200);
      expect(response.data).toEqual({ statusMsg: 'Submitted!' });
      await expect(Post).toHaveBeenCalled();
    });
    it('should throw an error if saving post has failed', async () => {});
  });
});
