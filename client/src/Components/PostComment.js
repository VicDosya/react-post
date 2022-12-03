import { React, useState } from "react";
import styles from "./PostComment.module.css";
import axios from "axios";

function PostComment({ postId, loadComments }) {
  //useState Variables
  const [comment, setComment] = useState("");

  //Submit a comment
  const submitComment = async () => {
    const res = await axios.post(`/api/posts/${postId}/comment`, { comment });
    console.log(res.data.statusMsg);
    setComment("");
    loadComments();
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
        </div>
      </div>
    </div>
  );
}

export default PostComment;
