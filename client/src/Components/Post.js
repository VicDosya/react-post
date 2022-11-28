//Import packages
import { React, useState, useEffect, useRef } from "react";
import axios from "axios";
import styles from "./Post.module.css";

function Post() {
  //useState Variables
  const [posts, setPosts] = useState([]);

  //When loaded, print all the posts from the server.
  useEffect(() => {
    loadAllPosts();
  }, []);

  //Load all the posts function.
  const loadAllPosts = async () => {
    const res = await axios.get("/api/posts/:postId");
    setPosts(res.data);
  };

  return (
    <div>
      {/* All Posts */}
      <hr className={styles.hrBreak}></hr>
      <div className={styles.postsContainer}>
        {posts.map((post, key) => {
          return (
            <div key={key} className={styles.cardStyle}>
              <div className={styles.alignPostContent}>
                <h1 className={styles.postTitle}>{post.title}</h1>
                <hr className={styles.hrPostBreak}></hr>
                <div className={styles.descriptionCtn}>
                  <p className={styles.postDescription}>{post.body}</p>
                </div>
                <span className={styles.postDateTime}>{post.createdAt}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Post;
