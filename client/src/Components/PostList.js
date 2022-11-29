import React from "react";
import Post from "./Post";
import styles from "./Post.module.css";

function PostList({ posts }) {
  return (
    <div>
      <hr className={styles.hrBreak}></hr>
      <div className={styles.postsContainer}>
        {posts.map((post, key) => (
          <Post
            title={post.title}
            body={post.body}
            author={post.author}
            postDate={post.createdAt}
            key={key}
          ></Post>
        ))}
      </div>
    </div>
  );
}

export default PostList;
