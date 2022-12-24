import { React, useState } from "react";
import styles from "./CommentForm.module.css";
import axios from "axios";

function CommentForm({ postId, loadComments }) {
  //useState Variables
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [btnDisabled, setbtnDisabled] = useState(false);

  //Submit a comment
  const submitComment = async () => {
    setbtnDisabled(true);
    const res = await axios.post(`/api/posts/${postId}/comments`, { comment });
    if (res.data.error) {
      setError(res.data.error);
    } else {
      setComment("");
      loadComments();
      setError("");
    }
    setbtnDisabled(false);
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
          <button
            onClick={submitComment}
            className={styles.submitCommentBtn}
            disabled={btnDisabled}
          >
            Submit
          </button>
          <div className={styles.errorStatus}>{error}</div>
        </div>
      </div>
    </div>
  );
}

export default CommentForm;
