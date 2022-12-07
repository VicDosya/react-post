import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EditPost.module.css";

function EditPost() {
  //useState Variables:
  const [profile, setProfile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusOfPost, setStatusOfPost] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

  //useNavigate
  let navigate = useNavigate();

  //useParams Variables
  const { postId } = useParams(); //To take the path :postId parameter from App.js

  //useEffect
  useEffect(() => {
    loadProfile();
    checkUserPost();
  }, []);

  //Load Profile function
  const loadProfile = async () => {
    const res = await axios.get("/api/auth/profile");
    if (res.data.error) {
      navigate("/auth/login");
    } else {
      setProfile(res.data);
    }
  };

  //Check editing authorization
  const checkUserPost = async () => {
    const res = await axios.get(`/api/auth/${postId}/edit`);
    if (res.data.auth) {
      setTitle("Auth true");
    } else {
      return navigate(`/post/${postId}`);
    }
  };

  //Logout function
  const handleLogout = async () => {
    const res = await axios.get("/api/auth/logout");
    navigate("/auth/login");
  };

  //Go back to all posts navigation function
  const goBackRoute = () => {
    navigate("/");
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
        <h1 className={styles.postTitleHeader}>Edit your post📭</h1>
        {/* Go back button */}
        <div className={styles.TopBtnsCtn}>
          <div>
            <button onClick={goBackRoute} className={styles.backBtn}>
              Go back
            </button>
          </div>
        </div>
        {/* Title input */}
        <div className={styles.cardStyle}>
          <div className={styles.enterTitleCtn}>
            <h1 className={styles.enterTitleText}>Title:</h1>
          </div>
          <input
            className={styles.createPostInput}
            placeholder="eg. How to cook an egg"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        </div>
        {/* Description textarea */}
        <div className={styles.cardStyle}>
          <div className={styles.dscInputCtn}>
            <h1 className={styles.dscInputText}>Description:</h1>
          </div>
          <textarea
            className={styles.createPostTextArea}
            placeholder="eg. Fill a pot full of water, take two eggs..."
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {/* Submit Button */}
          <div className={styles.submitBtnContainer}>
            <button className={styles.submitPostBtn} disabled={btnDisabled}>
              Submit
            </button>
          </div>
        </div>
        {/* Status Message */}
        <div className={styles.statusMsgContainer}>
          <h1 className={styles.statusMsgTitle}>{statusOfPost}</h1>
        </div>
      </div>
    </div>
  );
}

export default EditPost;
