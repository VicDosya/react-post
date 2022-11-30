import { React, useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import PostForm from "./Components/PostForm";
import PostList from "./Components/PostList";
import PostPage from "./Components/PostPage";

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
      {/* Home page, Post form and all posts list */}
      <Route
        path="/"
        element={
          <>
            <PostForm onPostSubmitted={loadAllPosts} />
            <PostList posts={posts} />
          </>
        }
      ></Route>
      {/* Inside each post: :postId is used as useParams in PostPage*/}
      <Route path="/post/:postId" element={<PostPage />}></Route>
    </Routes>
  );
}

export default App;
