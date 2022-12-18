import { React, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TimeAgo from "react-timeago";
import styles from "./Comment.module.css";

function Comment({
  postId,
  commentId,
  userId,
  body,
  author,
  onDelete,
  commentDate,
}) {
  //useState Variables
  const [profile, setProfile] = useState(null);

  //useEffect onload
  useEffect(() => {
    loadProfile();
  });

  //useNavigate declaration
  const navigate = useNavigate();

  //Load Profile function
  const loadProfile = async () => {
    const res = await axios.get("/api/auth/profile");
    if (res.data.error) {
      navigate("/auth/login");
    } else {
      setProfile(res.data);
    }
  };

  //handleEdit comment functionality
  const handleEdit = async () => {
    const res = await axios.get(`/api/posts/${postId}/comments/${commentId}`);
    if (res.data.error) {
      return console.log(res.data.error);
    }
    if (res.data.auth) {
      navigate(`/post/${postId}/comment/${commentId}`);
    }
  };

  return (
    <div className={styles.contentCtn}>
      <div className={styles.cardStyle}>
        <div className={styles.authorCtn}>
          <div className={styles.commentAuthor}>{author}</div>
        </div>
        <div className={styles.commentCtn}>
          <div className={styles.commentBody}>{body}</div>
          {profile?._id === userId && (
            <div>
              <button onClick={handleEdit} className={styles.modifyBtn}>
                Edit
              </button>
              <button
                onClick={() => onDelete(commentId)}
                className={styles.modifyBtn}
              >
                Delete
              </button>
            </div>
          )}
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
