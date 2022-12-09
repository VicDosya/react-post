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
  const [error, setError] = useState("");

  //useNavigate
  let navigate = useNavigate();

  //useParams Variables
  const { postId } = useParams(); //To take the path :postId parameter from App.js

  //useEffect
  useEffect(() => {
    loadEverything();
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

  //loadPost functionality
  const loadPost = async () => {
    const res = await axios.get(`/api/posts/${postId}`);
    if (res.data.error) {
      setError(res.data.error);
    } else {
      setTitle(res.data.title);
      setDescription(res.data.body);
      return res.data;
    }
  };

  //Load Everything function
  const loadEverything = async () => {
    setBtnDisabled(true);
    const _profile = await loadProfile();
    const _post = await loadPost();
    if (!_profile || !_post) {
      navigate("/");
    }
    if (_profile._id !== _post.userId) {
      navigate(`/post/${postId}`);
    }
    setBtnDisabled(false);
  };

  //Submit edited post
  const submitHandler = async () => {
    setBtnDisabled(true);
    const res = await axios.put(`/api/posts/${postId}`, {
      title: title,
      description: description,
    });
    if (res.data.error) {
      setError(res.data.error);
    } else {
      setStatusOfPost(res.data.statusMsg);
      setTimeout(navigate(`/post/${postId}`), 2000);
    }
    setBtnDisabled(false);
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
            <button
              className={styles.submitPostBtn}
              disabled={btnDisabled}
              onClick={submitHandler}
            >
              Submit
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

export default EditPost;
