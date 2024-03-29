//Import packages
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Post.module.css";
import TimeAgo from "react-timeago";
import { PostType } from "./ReactPost.types";

function Post({ _id, title, body, author, createdAt, commentsCount }: PostType) {
  //Navigate inside a post functionality and send its post data inside it.
  let navigate = useNavigate();
  const goToPost = () => {
    navigate(`/post/${_id}`);
  };

  return (
    // Container
    <div className={styles.cardStyle}>
      <div className={styles.alignPostContent}>
        {/* Title */}
        <h1
          onClick={() => {
            goToPost();
          }}
          className={styles.postTitle}
        >
          {title}
        </h1>
        <hr className={styles.hrPostBreak}></hr>
        {/* Description */}
        <div className={styles.descriptionCtn}>
          <p className={styles.postDescription}>{body}</p>
        </div>
        {/* Author */}
        <div className={styles.authorTimeCtn}>
          <div className={styles.authorCtn}>
            Post author: <span className={styles.postAuthor}>{author}</span>
          </div>
          {/* Comments quantity */}
          <div className={styles.commentsCtn}>Comments: {commentsCount}</div>
          {/* Date */}
          <div className={styles.postDateTime}>
            Posted: <TimeAgo date={createdAt} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
