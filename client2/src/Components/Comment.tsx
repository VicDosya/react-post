import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContext } from "./ProfileContext";
import axios from "axios";
import TimeAgo from "react-timeago";
import styles from "./Comment.module.css";
import {CommentType} from './ReactPost.types';

function Comment({
  postId,
  _id,
  userId,
  body,
  author,
  onDelete,
  createdAt,
}: CommentType) {
  //useContext from App.js
  const { profile } = useContext(ProfileContext);

  //useNavigate declaration
  const navigate = useNavigate();

  //handleEdit comment functionality
  const handleEdit = async () => {
    try {
      const res = await axios.get(`/api/posts/${postId}/comments/${_id}`);
      if (res.data.auth) {
        navigate(`/post/${postId}/comment/${_id}`);
      }
    } catch (err: any) {
      console.log(err.response.data.error);
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
                onClick={() => onDelete(_id)}
                className={styles.modifyBtn}
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <div className={styles.dateCtn}>
          <div className={styles.commentDate}>
            <TimeAgo date={createdAt} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Comment;
