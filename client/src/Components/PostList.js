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
            id={post._id}
            title={post.title}
            body={post.body}
            author={post.author}
            postDate={post.createdAt}
            commentsCount={post.commentsCount}
            key={key}
          ></Post>
        ))}
      </div>
    </div>
  );
}

export default PostList;
