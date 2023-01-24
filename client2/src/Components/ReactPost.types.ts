// Comment.tsx
export type CommentType = {
  postId: string | undefined;
  commentId: string;
  userId: string;
  body: string;
  author: string;
  onDelete: Function;
  commentDate: string;
};

//CommentForm.tsx
export type CommentFormType = {
  postId: string | undefined;
  loadComments: Function;
};

//CommentList.tsx
type CommentsType = {
  _id: string;
  userId: string;
  body: string;
  author: string;
  createdAt: string;
};

export type CommentListType = {
  comments: CommentsType[];
  postId: string | undefined;
  onDelete: Function;
};

//ForcedRoute.tsx
export type ProtectedRouteType = {
  component: React.FunctionComponent;
};

//Post.tsx
export type PostType = {
  id: string;
  title: string;
  body: string;
  author: string;
  postDate: string;
  commentsCount: number;
};

//PostForm.tsx
export type PostFormType = {
  onPostSubmitted: Function;
};

//PostList.tsx
type PostsType = {
  _id: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  commentsCount: number;
};
export type PostListType = {
  posts: PostsType[];
};

//PostPage.tsx
export type PostPageType = {
  userId: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
};