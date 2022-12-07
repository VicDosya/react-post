import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PostForm from "./PostForm";
import PostList from "./PostList";

function HomePage({ posts, onPostSubmitted }) {
  //useState Variables
  const [profile, setProfile] = useState(null);

  //useNavigate
  let navigate = useNavigate();

  //useEffect
  useEffect(() => {
    loadProfile();
  }, []);

  //Load Profile function
  const loadProfile = async () => {
    const res = await axios.get("/api/auth/profile");
    if (res.data.error) {
      navigate("/auth/login");
    } else {
      setProfile(res.data);
    }
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
      <PostForm onPostSubmitted={onPostSubmitted} />
      <PostList posts={posts} />
    </div>
  );
}

export default HomePage;
