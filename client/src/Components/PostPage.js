import { React, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./PostPage.module.css";
import TimeAgo from "react-timeago";

function PostPage() {
  //useState Variables
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  //useParams Variables
  const { postId } = useParams(); //To take the path :postId parameter from App.js

  //useEffect to load the post data
  useEffect(() => {
    loadPost();
  }, []);

  //Load the post data function
  const loadPost = async () => {
    const res = await axios.get(`/api/posts/${postId}`);
    setPost(res.data);
    setLoading(false);
  };

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

  if (loading) {
    return <div>Loading...</div>;
  }

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
              Posted: <TimeAgo date={post.postDate} />
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

export default PostPage;
