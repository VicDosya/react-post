//Import packages (ESM is installed)
import { React, useState } from "react";
import axios from "axios";

function PostPage() {
  //useState Variables
  const [serverResponse, setServerResponse] = useState("");

  //When server loads function.
  const onLoadServer = async () => {
    const res = await axios.get("/api/response");
    setServerResponse(res.data.message);
  };
  onLoadServer();

  //JSX
  return (
    <div>
      <h1>Client Works</h1>
      <p>{serverResponse}</p>
    </div>
  );
}

export default PostPage;
