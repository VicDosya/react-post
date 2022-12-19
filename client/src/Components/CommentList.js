import React from "react";
import Comment from "./Comment";

function CommentList({ comments, postId, onDelete }) {
  return (
    <div>
      {comments.map((comment, key) => (
        <Comment
          postId={postId}
          commentId={comment._id}
          userId={comment.userId}
          body={comment.body}
          author={comment.author}
          commentDate={comment.createdAt}
          onDelete={onDelete}
          key={key}
        ></Comment>
      )).reverse()}
    </div>
  );
}

export default CommentList;
