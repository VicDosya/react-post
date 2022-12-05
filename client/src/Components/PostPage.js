import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import axios from "axios";
import styles from "./PostPage.module.css";
import TimeAgo from "react-timeago";

function PostPage() {
  //useState Variables
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("Something Went Wrong");
  const [profile, setProfile] = useState(null);

  //useParams Variables
  const { postId } = useParams(); //To take the path :postId parameter from App.js

  //useEffect to load the post data
  useEffect(() => {
    loadProfile();
    loadPost();
    loadComments();
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

  //Logout function
  const handleLogout = async () => {
    const res = await axios.get("/api/auth/logout");
    navigate("/auth/login");
  };

  //Load the post data function
  const loadPost = async () => {
    const res = await axios.get(`/api/posts/${postId}`);
    if (res.data.error) {
      setError(res.data.error);
    } else {
      setPost(res.data);
      setError("");
    }
    setLoading(false);
  };

  //Load all the comments of this post
  const loadComments = async () => {
    const res = await axios.get(`/api/posts/${postId}/comments`);
    if (res.data.error) {
      setError(res.data.error);
    } else {
      setComments(res.data.comments);
    }
  };

  //Go back to all posts navigation function
  let navigate = useNavigate();
  const goBackRoute = () => {
    navigate("/");
  };
  if (loading) {
    return (
      <div className={styles.spinnerCtn}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div>
      {/* User */}
      <div>{profile?.fname}</div>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {/* Go back button */}
      <div className={styles.backBtnCtn}>
        <button onClick={goBackRoute} className={styles.backBtn}>
          Go back
        </button>
      </div>
      <div className={styles.errorCtn}>
        <div className={styles.errorStatus}>{error}</div>
      </div>
      <div className={styles.cardStyle}>
        <div className={styles.alignPostContent}>
          {/* Title */}
          <h1 className={styles.postTitle}>{post.title}</h1>
          <hr className={styles.hrPostBreak}></hr>
          {/* Description */}
          <div className={styles.descriptionCtn}>
            <p className={styles.postDescription}>{post.body}</p>
          </div>
          {/* Author */}
          <div className={styles.authorTimeCtn}>
            <div className={styles.authorCtn}>
              Post author:{" "}
              <span className={styles.postAuthor}>{post.author}</span>
            </div>
            {/* Date */}
            <div className={styles.postDateTime}>
              Posted: <TimeAgo date={post.createdAt} />
            </div>
          </div>
        </div>
      </div>
      {/* Post a comment */}
      <CommentForm postId={postId} loadComments={loadComments} />
      {/* Comments List */}
      <div>
        <CommentList comments={comments} />
      </div>
    </div>
  );
}

export default PostPage;
