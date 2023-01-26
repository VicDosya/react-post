// Comment.tsx
export type CommentType = {
  _id: string;
  postId: string | undefined;
  userId: string;
  body: string;
  author: string;
  createdAt: string;
  onDelete: Function;
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

//ForcedRoute.tsx and ProtectedRoute.tsx
export type ProtectedRouteType = {
  component: React.FunctionComponent;
};

export type ErrorType = {
  error: string;
};

export type ProfileType = {
  fname: string;
  lname: string;
  email: string;
  createdAt: string;
  error: ErrorType;
};

//Post.tsx
export type PostType = {
  _id: string;
  userId: string;
  title: string;
  body: string;
  author: string;
  createdAt: string;
  commentsCount: number;
};

//PostForm.tsx
export type PostFormType = {
  onPostSubmitted: Function;
};

//PostList.tsx
type PostsType = {
  _id: string;
  userId: string,
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
