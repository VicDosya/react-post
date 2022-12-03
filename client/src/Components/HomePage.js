import React from "react";
import PostForm from "./PostForm";
import PostList from "./PostList";

function HomePage({ posts, onPostSubmitted }) {
  return (
    <div>
      <PostForm onPostSubmitted={onPostSubmitted} />
      <PostList posts={posts} />
    </div>
  );
}

export default HomePage;
