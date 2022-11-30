import { React, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./InsidePost.module.css";
import TimeAgo from "react-timeago";

function InsidePost() {
  //useState Variables
  const [comment, setComment] = useState("");

  //useLocation Hook to grab the useNavigate data from Post.js
  const location = useLocation();

  //Go back to all posts navigation function
  let navigate = useNavigate();
  const goBackRoute = () => {
    navigate("/");
  };

  //Submit a comment
  const submitComment = async () => {
    const res = await axios.post("/api/posts/comment", { comment: comment });
    console.log(res.data.statusMsg);
    setComment("");
  };

  return (
    <div>
      {/* Go back button */}
      <div className={styles.backBtnCtn}>
        <button onClick={goBackRoute} className={styles.backBtn}>
          Go back
        </button>
      </div>
      <div className={styles.cardStyle}>
        <div className={styles.alignPostContent}>
          {/* Title */}
          <h1 className={styles.postTitle}>{location.state.title}</h1>
          <hr className={styles.hrPostBreak}></hr>
          {/* Description */}
          <div className={styles.descriptionCtn}>
            <p className={styles.postDescription}>{location.state.body}</p>
          </div>
          {/* Author */}
          <div className={styles.authorTimeCtn}>
            <div className={styles.authorCtn}>
              Post author:{" "}
              <span className={styles.postAuthor}>{location.state.author}</span>
            </div>
            {/* Date */}
            <div className={styles.postDateTime}>
              Posted: <TimeAgo date={location.state.postDate} />
            </div>
          </div>
        </div>
      </div>

      {/* Add a comment */}
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

export default InsidePost;
