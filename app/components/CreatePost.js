import React, { useEffect, useState, useContext } from "react";
import Page from "./common/Page";
import Axios from "axios";
import { withRouter } from "react-router-dom";
import DispatchContext from "./context/DispatchContext";
import StateContext from "./context/StateContext";

function CreatePost(props) {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();
  const appDispatch = useContext(DispatchContext);
  const appState = useContext(StateContext);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await Axios.post("/create-post", {
        title,
        body,
        token: appState.user.token,
      }).then(function (res) {
        console.log("New post created");
        //redirect to new post url
        appDispatch({
          type: "flashMessage",
          value: "Congrats! You created a new post",
        });
        props.history.push(`/post/${res.data}`);
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Page title="Create new post">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            name="title"
            id="post-title"
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            className="body-content tall-textarea form-control"
            onChange={(e) => setBody(e.target.value)}
            type="text"
          ></textarea>
        </div>

        <button className="btn btn-primary">Save New Post</button>
      </form>
    </Page>
  );
}

export default withRouter(CreatePost);
