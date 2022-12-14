import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import axios from "axios";
import styles from "./PostPage.module.css";
import TimeAgo from "react-timeago";

function PostPage({ posts }) {
  //useState Variables
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profile, setProfile] = useState(null);
  const [btnDisabled, setbtnDisabled] = useState(false);
  const [voteUpDisabled, setVoteUpDisabled] = useState(false);
  const [voteDownDisabled, setVoteDownDisabled] = useState(false);
  const [voteUp, setVoteUp] = useState(0);
  const [voteDown, setVoteDown] = useState(0);

  //useParams Variables
  const { postId } = useParams(); //To take the path :postId parameter from App.js

  //useEffect to load the post data
  useEffect(() => {
    loadProfile();
    loadPost();
    loadComments();
    getAllVotes();
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

  //Edit post functionality
  const handleEditPost = async () => {
    navigate(`/post/${postId}/edit`);
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

  //Get all votes for this post
  const getAllVotes = async () => {
    setVoteUpDisabled(true);
    setVoteDownDisabled(true);
    const res = await axios.get(`/api/posts/${postId}/votes`);
    if (res.data.error) {
      setError(res.data.error);
    } else {
      setError("");
      setVoteUp(res.data.votesUpCount);
      setVoteDown(res.data.votesDownCount);
      setVoteUpDisabled(false);
      setVoteDownDisabled(false);
    }
  };

  //Send vote up to the server
  const handleVoteUp = async () => {
    setVoteUpDisabled(true);
    setVoteDownDisabled(true);
    const res = await axios.post(`/api/posts/${postId}/votes/up`, {
      vote: "Vote up",
    });
    if (res.data.error) {
      setError(res.data.error);
    } else {
      setError("");
      getAllVotes();
      setVoteUpDisabled(false);
      setVoteDownDisabled(false);
    }
  };

  //Send vote down to the server
  const handleVoteDown = async () => {
    setVoteUpDisabled(true);
    setVoteDownDisabled(true);
    const res = await axios.post(`/api/posts/${postId}/votes/down`, {
      vote: "Vote down",
    });
    if (res.data.error) {
      setError(res.data.error);
    } else {
      setError("");
      getAllVotes();
      setVoteUpDisabled(false);
      setVoteDownDisabled(false);
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
      <div className={styles.TopBtnsCtn}>
        <div>
          <button onClick={goBackRoute} className={styles.backBtn}>
            Go back
          </button>
        </div>
        {/* Edit post button */}
        <div>
          {/* Post displayed only if the user is the author of the post */}
          {profile?._id === post.userId && (
            <button
              onClick={handleEditPost}
              className={styles.editPostBtn}
              disabled={btnDisabled}
            >
              Edit Post
            </button>
          )}
        </div>
      </div>
      <div className={styles.cardStyle}>
        <div className={styles.votingCtn}>
          <span className={styles.upAmount}>{voteUp}</span>
          <div
            className={styles.voteUp}
            onClick={handleVoteUp}
            disabled={voteUpDisabled}
          >
            👍
          </div>
          <div
            className={styles.voteDown}
            onClick={handleVoteDown}
            disabled={voteDownDisabled}
          >
            👎
          </div>
          <span className={styles.downAmount}>{voteDown}</span>
        </div>
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
      {/* Errors */}
      <div className={styles.errorCtn}>
        <h1>{error}</h1>
      </div>
      {/* Comments List */}
      <div>
        <CommentList comments={comments} />
      </div>
    </div>
  );
}

export default PostPage;
