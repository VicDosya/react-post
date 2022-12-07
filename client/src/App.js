import { React, useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Auth from "./Components/Auth";
import PostPage from "./Components/PostPage";
import HomePage from "./Components/HomePage";
import EditPost from "./Components/EditPost";

function App() {
  //useState Variables
  const [posts, setPosts] = useState([]);

  //When loaded, print all the posts from the server.
  useEffect(() => {
    loadAllPosts();
  }, []);

  //Load all the posts function.
  const loadAllPosts = async () => {
    const res = await axios.get("/api/posts");
    setPosts(res.data);
  };

  return (
    <Routes>
      {/* Authentication */}
      <Route path="/auth/*" element={<Auth />}></Route>
      {/* Home page, Post form and all posts list */}
      <Route
        path="/"
        element={<HomePage posts={posts} onPostSubmitted={loadAllPosts} />}
      ></Route>
      {/* Inside each post: :postId is used as useParams in PostPage*/}
      <Route path="/post/:postId" element={<PostPage />}></Route>
      <Route path="/post/:postId/edit" element={<EditPost />}></Route>
    </Routes>
  );
}

export default App;
