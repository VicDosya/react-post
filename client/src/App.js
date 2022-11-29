import { React, useState, useEffect } from "react";
import axios from "axios";
import PostForm from "./Components/PostForm";
import PostList from "./Components/PostList";

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
    <div className="App">
      <PostForm onPostSubmitted={loadAllPosts} />
      <PostList posts={posts} />
    </div>
  );
}

export default App;
