//Import packages
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";

//Import components
import Auth from "./Components/Auth";
import ProtectedRoute from "./Components/ProtectedRoute";
import ForcedRoute from "./Components/ForcedRoute";
import { ProfileContext } from "./Components/ProfileContext";
import PostPage from "./Components/PostPage";
import HomePage from "./Components/HomePage";
import EditPost from "./Components/EditPost";
import EditComment from "./Components/EditComment";

function App() {
  //useState variables
  const [profile, setProfile] = useState(null);

  //useEffect
  useEffect(() => {
    loadProfile();
  }, []);

  //Load Profile function
  const loadProfile = async () => {
    try {
      const res = await axios.get("/api/auth/profile");
      setProfile(res.data);
      return res.data;
    } catch (err: any) {
      console.log(err.response.data.message);
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, loadProfile }}>
      <Routes>
        {/* Authentication */}
        <Route
          path="/auth/*"
          element={<ForcedRoute component={Auth} />}
        ></Route>
        {/* Home page, Post form and all posts list */}
        <Route
          path="/"
          element={<ProtectedRoute component={HomePage} />}
        ></Route>
        {/* Inside each post: :postId is used as useParams in PostPage*/}
        <Route
          path="/post/:postId"
          element={<ProtectedRoute component={PostPage} />}
        ></Route>
        <Route
          path="/post/:postId/edit"
          element={<ProtectedRoute component={EditPost} />}
        ></Route>
        <Route
          path="/post/:postId/comment/:commentId"
          element={<ProtectedRoute component={EditComment} />}
        ></Route>
      </Routes>
    </ProfileContext.Provider>
  );
}

export default App;
