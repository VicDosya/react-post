import { React, useState } from "react";
import styles from "./CommentForm.module.css";
import axios from "axios";

function CommentForm({ postId, loadComments }) {
  //useState Variables
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  //Submit a comment
  const submitComment = async () => {
    const res = await axios.post(`/api/posts/${postId}/comment`, { comment });
    if (res.data.error) {
      setError(res.data.error);
    } else {
      setComment("");
      loadComments();
      setError("");
    }
  };

  return (
    <div>
      <div className={styles.addCommentCtn}>
        <h1 className={styles.addCommentTitle}>Add a comment:</h1>
        <div className={styles.textAreaCtn}>
          <textarea
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={styles.commentTextArea}
            placeholder="Add your comment here..."
          ></textarea>
        </div>
        <div className={styles.submitBtnCtn}>
          <button onClick={submitComment} className={styles.submitCommentBtn}>
            Submit
          </button>
          <div className={styles.errorStatus}>{error}</div>
        </div>
      </div>
    </div>
  );
}

export default CommentForm;
