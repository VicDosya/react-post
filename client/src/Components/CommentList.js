import React from "react";
import Comment from "./Comment";

function CommentList({ comments }) {
  return (
    <div>
      {comments.map((comment, key) => (
        <Comment
          id={comment._id}
          body={comment.body}
          author={comment.author}
          commentDate={comment.createdAt}
          key={key}
        ></Comment>
      ))}
    </div>
  );
}

export default CommentList;
