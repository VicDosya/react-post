//Import packages
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

//Import components
import { ProfileContext } from "./ProfileContext";
import PostForm from "./PostForm";
import PostList from "./PostList";

function HomePage() {
  //useState Variables
  const [posts, setPosts] = useState([]);

  //useNavigate
  let navigate = useNavigate();

  //useContext from App.js
  const { profile } = useContext(ProfileContext);

  //useEffect
  useEffect(() => {
    loadAllPosts();
  }, []);

  //Load all the posts function.
  const loadAllPosts = async () => {
    const res = await axios.get("/api/posts");
    setPosts(res.data);

  };

  //Logout function
  const handleLogout = async () => {
    const res = await axios.get("/api/auth/logout");
    navigate("/auth/login");
  };

  return (
    <div>
      {/* User */}
      <div>{profile?.fname}</div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {/* Rest of components */}
      <PostForm onPostSubmitted={loadAllPosts} />
      <PostList posts={posts} />
    </div>
  );
}

export default HomePage;
