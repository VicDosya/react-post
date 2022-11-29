//Import packages (ESM is installed):
import { React, useState } from "react";
import axios from "axios";
import styles from "./PostForm.module.css";

function PostForm({ onPostSubmitted }) {
  //useState Variables:
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [statusOfPost, setStatusOfPost] = useState("");
  const [btnDisabled, setBtnDisabled] = useState(false);

  //Submit button functionality.
  const submitHandler = async () => {
    if (title === "" || description === "") {
      setStatusOfPost("Please fill all the inputs.");
    } else {
      setBtnDisabled(true);
      const res = await axios
        .post("/api/posts", {
          title: title,
          body: description,
        })
        .catch((err) => {
          console.log(`Something went wrong: ${err}`);
          setBtnDisabled(false);
        });
      onPostSubmitted();
      setStatusOfPost(res.data.statusMsg);
      setTimeout(() => {
        setStatusOfPost("");
      }, 5000);
      setTitle("");
      setDescription("");
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
      </div>
    </div>
  );
}

export default PostForm;
