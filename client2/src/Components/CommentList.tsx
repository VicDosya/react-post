import React from "react";
import Comment from "./Comment";
import {CommentListType} from './ReactPost.types';

function CommentList({ comments, postId, onDelete }: CommentListType) {
  return (
    <div>
      {comments
        .map((comment, key) => (
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
        ))
        .reverse()}
    </div>
  );
}

export default CommentList;
