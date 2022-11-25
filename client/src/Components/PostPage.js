//Import packages (ESM is installed):
import { React, useState, useEffect } from "react";
import axios from "axios";
import styles from "./PostPage.module.css";

function PostPage() {
  //useState Variables:
  const [posts, setPosts] = useState([]);
  const [createTitle, setCreateTitle] = useState("");
  const [createDsc, setCreateDsc] = useState("");
  const [statusOfPost, setStatusOfPost] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

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
    if (createTitle === "" || createDsc === "") {
      setStatusOfPost("Please fill all the inputs.");
    } else {
      setBtnDisabled(true);
      const res = await axios
        .post("/api/submit", {
          title: createTitle,
          description: createDsc,
          date:
            new Date().toDateString() + " - " + new Date().toLocaleTimeString(),
        })
        .catch((err) => {
          console.log(`Something went wrong: ${err}`);
          setBtnDisabled(false);
        });
      setStatusOfPost(res.data.statusMsg);
      setTimeout(() => {
        setStatusOfPost("");
      }, 5000);
      setCreateTitle("");
      setCreateDsc("");
      loadAllPosts();
      setBtnDisabled(false);
    }
  };

  //JSX
  return (
    <div>
      {/* Create a post */}
      <div className={styles.createPostContainer}>
        <h1 className={styles.postTitleHeader}>Create a post📭</h1>
        {/* Title input */}
        <div className={styles.titleInputContainer}>
          <div className={styles.enterTitleCtn}>
            <h1 className={styles.enterTitleText}>Title:</h1>
          </div>
          <input
            className={styles.createPostInput}
            placeholder="eg. How to cook an egg"
            type="text"
            value={createTitle}
            onChange={(e) => setCreateTitle(e.target.value)}
          ></input>
        </div>
        {/* Description textarea */}
        <div className={styles.textAreaContainer}>
          <div className={styles.dscInputCtn}>
            <h1 className={styles.dscInputText}>Description:</h1>
          </div>
          <textarea
            className={styles.createPostTextArea}
            placeholder="eg. Fill a pot full of water, take two eggs..."
            type="text"
            value={createDsc}
            onChange={(e) => setCreateDsc(e.target.value)}
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
        </div>
        {/* Status Message */}
        <div className={styles.statusMsgContainer}>
          <h1 className={styles.statusMsgTitle}>{statusOfPost}</h1>
        </div>
        {/* All Posts */}
        <hr className={styles.hrBreak}></hr>
        <div className={styles.postsContainer}>
          {posts.map((post, key) => {
            return (
              <div key={key} className={styles.eachPostContainer}>
                <h1 className={styles.postTitle}>{post.title}</h1>
                <hr className={styles.hrPostBreak}></hr>
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
