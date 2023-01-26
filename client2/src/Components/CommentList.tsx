import React from "react";
import Comment from "./Comment";
import {CommentListType} from './ReactPost.types';

function CommentList({ comments, postId, onDelete }: CommentListType) {
  return (
    <div>
      {comments
        .map((comment, key) => (
          <Comment
            _id={comment._id}
            postId={postId}
            userId={comment.userId}
            body={comment.body}
            author={comment.author}
            createdAt={comment.createdAt}
            onDelete={onDelete}
            key={key}
          ></Comment>
        ))
        .reverse()}
    </div>
  );
}

export default CommentList;
