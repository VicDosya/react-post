//Import packages
import { React } from "react";
import styles from "./Post.module.css";
import TimeAgo from 'react-timeago';

function Post({ title, body, postDate }) {
  return (
    <div className={styles.cardStyle}>
      <div className={styles.alignPostContent}>
        <h1 className={styles.postTitle}>{title}</h1>
        <hr className={styles.hrPostBreak}></hr>
        <div className={styles.descriptionCtn}>
          <p className={styles.postDescription}>{body}</p>
        </div>
        <span className={styles.postDateTime}><TimeAgo date={postDate} /></span>
      </div>
    </div>
  );
}

export default Post;
