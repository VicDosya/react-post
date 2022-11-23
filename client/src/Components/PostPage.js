//Import packages (ESM is installed):
import { React, useState, useRef, useEffect } from "react";
import axios from "axios";
import styles from "./PostPage.module.css";

function PostPage() {
  //useState Variables:
  const [posts, setPosts] = useState([]);
  const [statusOfPost, setStatusOfPost] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

  //useRef Variables:
  const refTitle = useRef();
  const refDescription = useRef();

  //When loaded, print all the posts from the server.
  useEffect(() => {
    loadAllPosts();
  }, []);

  //Load all the posts function.
  const loadAllPosts = async () => {
    const res = await axios.get("/api/posts");
    setPosts(res.data);
  };

  //Submit button functionality.
  const submitHandler = async () => {
    if (refTitle.current.value === "" || refDescription.current.value === "") {
      setStatusOfPost("Please fill all the inputs.");
    } else {
      setBtnDisabled(true);
      const res = await axios
        .post("/api/submit", {
          title: refTitle.current.value,
          description: refDescription.current.value,
          date: new Date().toJSON(),
        })
        .catch((err) => {
          console.log(`Something went wrong: ${err}`);
          setBtnDisabled(false);
        });
      setStatusOfPost(res.data.statusMsg);
      setTimeout(() => {
        setStatusOfPost("");
      }, 5000);
      refTitle.current.value = "";
      refDescription.current.value = "";
      loadAllPosts();
      setBtnDisabled(false);
    }
  };

  //JSX
  return (
    <div>
      {/* Create a post */}
      <div className={styles.createPostContainer}>
        <h1>Poster</h1>
        {/* Title input */}
        <input
          className={styles.createPostInput}
          placeholder="Title..."
          ref={refTitle}
        ></input>
        {/* Description textarea */}
        <textarea
          className={styles.createPostTextArea}
          placeholder="Body..."
          ref={refDescription}
        ></textarea>
        {/* Submit Button */}
        <div className={styles.submitBtnContainer}>
          <button
            className={styles.submitPostBtn}
            onClick={submitHandler}
            disabled={btnDisabled}
          >
            Submit
          </button>
        </div>
        {/* Status Message */}
        <div className={styles.statusMsgContainer}>
          <h1 className={styles.statusMsgTitle}>{statusOfPost}</h1>
        </div>

        {/* All Posts */}
        <div className={styles.postsContainer}>
          {posts.map((post, key) => {
            return (
              <div key={key} className={styles.eachPostContainer}>
                <h1 className={styles.postTitle}>{post.title}</h1>
                <p className={styles.postDescription}>{post.description}</p>
                <span className={styles.postDateTime}>{post.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default PostPage;
