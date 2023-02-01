import React from "react";
import Post from "./Post";
import styles from "./Post.module.css";
import { PostListType } from "./ReactPost.types";

function PostList({ posts }: PostListType) {
  return (
    <div>
      <hr className={styles.hrBreak}></hr>
      <div className={styles.postsContainer}>
        {posts
          .map((post, key) => (
            <Post
              _id={post._id}
              userId={post.userId}
              title={post.title}
              body={post.body}
              author={post.author}
              createdAt={post.createdAt}
              commentsCount={post.commentsCount}
              key={key}
            ></Post>
          ))
          .reverse()}
      </div>
    </div>
  );
}

export default PostList;
