import React from "react";
import TimeAgo from "react-timeago";
import styles from "./Comment.module.css";

function Comment({ id, body, author, commentDate }) {
  return (
    <div className={styles.contentCtn}>
      <div className={styles.cardStyle}>
        <div className={styles.authorCtn}>
          <div className={styles.commentAuthor}>{author}</div>
        </div>
        <div className={styles.commentCtn}>
          <div className={styles.commentBody}>{body}</div>
        </div>
        <div className={styles.dateCtn}>
          <div className={styles.commentDate}>
            <TimeAgo date={commentDate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
