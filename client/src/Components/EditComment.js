import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EditPost.module.css";

function EditComment() {
  //useState Variables:
  const [profile, setProfile] = useState(null);
  const [comment, setComment] = useState("");
  const [statusOfPost, setStatusOfPost] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [error, setError] = useState("");

  //useParams Variables
  const { postId } = useParams();
  const { commentId } = useParams();

  //useNavigate
  let navigate = useNavigate();

  //useEffect onload
  useEffect(() => {
    loadProfile();
    getComment();
  }, []);

  //Load Profile function
  const loadProfile = async () => {
    const res = await axios.get("/api/auth/profile");
    if (res.data.error) {
      navigate("/auth/login");
    } else {
      setProfile(res.data);
      return res.data;
    }
  };

  //Get comment data in the input
  const getComment = async () => {
    const res = await axios.get(
      `/api/posts/${postId}/comments/${commentId}/edit`
    );
    if (res.data.error) {
      setError(res.data.error);
    } else {
      setComment(res.data);
    }
  };

  //Submit edited comment
  const submitHandler = async () => {
    const res = await axios.put(`/api/posts/${postId}/comments/${commentId}`, {
      comment: comment,
    });
    if (res.data.error) {
      setError(res.data.error);
    } else {
      navigate(`/post/${postId}`);
    }
  };

  //Delete a comment
  const handleDelete = async () => {
    const res = await axios.delete(
      `/api/posts/${postId}/comments/${commentId}`
    );
    if (res.data.error) {
      setError(res.data.error);
    } else {
      navigate(`/post/${postId}`);
    }
  };

  //Logout function
  const handleLogout = async () => {
    const res = await axios.get("/api/auth/logout");
    navigate("/auth/login");
  };

  //Go back to all posts navigation function
  const goBackRoute = () => {
    navigate(`/post/${postId}`);
  };

  return (
    <div>
      {/* User */}
      <div>{profile?.fname}</div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {/* Create a post */}
      <div className={styles.createPostContainer}>
        <h1 className={styles.postTitleHeader}>Edit your comment📝</h1>
        {/* Go back button */}
        <div className={styles.TopBtnsCtn}>
          <div>
            <button onClick={goBackRoute} className={styles.backBtn}>
              Go back
            </button>
          </div>
          <div>
            <button onClick={handleDelete} className={styles.deleteBtn}>
              Delete
            </button>
          </div>
        </div>
        {/* Description textarea */}
        <div className={styles.cardStyle}>
          <div className={styles.dscInputCtn}>
            <h1 className={styles.dscInputText}>Comment:</h1>
          </div>
          <textarea
            className={styles.createPostTextArea}
            placeholder="Edit your comment..."
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
          {/* Submit Button */}
          <div className={styles.submitBtnContainer}>
            <button
              className={styles.submitPostBtn}
              disabled={btnDisabled}
              onClick={submitHandler}
            >
              Submit Edit
            </button>
          </div>
        </div>
        {/* Status Message */}
        <div className={styles.statusMsgContainer}>
          <h1 className={styles.statusMsgTitle}>{statusOfPost}</h1>
        </div>
        {/* Errors */}
        <div className={styles.errorCtn}>
          <h1>{error}</h1>
        </div>
      </div>
    </div>
  );
}

export default EditComment;
