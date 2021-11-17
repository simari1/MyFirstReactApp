import React, { useEffect, useState } from "react";
import Page from "./common/Page";
import { useParams, Link } from "react-router-dom";
import Axios from "axios";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";

function ViewSinglePost() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    const cancelRequest = Axios.CancelToken.source();

    (async function fetchData() {
      try {
        const response = await Axios.get(`/post/${id}`, { cancelToken: cancelRequest.token });
        setPost(response.data);
        console.log(response.data);
        setIsLoading(false)
      } catch (error) {
        console.log(error);
      }
    })();
    return () => {
      cancelRequest.cancel();
    }
  }, []);

  if (isLoading) {
    return <Page title="...">
      <LoadingDotsIcon />
    </Page>
  }

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <Link to={`/post/${post._id}/edit`} data-tip="Edit" data-for="edit" className="text-primary mr-2">
            <i className="fas fa-edit"></i>
          </Link>
          <ReactTooltip id="edit" className="custom-tooltip" />
          {" "}
          <a data-tip="delete" data-for="delete" className="delete-post-button text-danger">
            <i className="fas fa-trash"></i>
          </a>
          <ReactTooltip id="delete" className="custom-tooltip" />
        </span>
      </div >

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img
            className="avatar-tiny"
            src={post.author.avatar}
          />
        </Link>
        Posted by <Link to={`/profile/${post.author.username}`}>{post.author.username}</Link>
        on {(new Date(post.createdDate)).toLocaleDateString("en-US")}
      </p>

      <div className="body-content">
        <ReactMarkdown children={post.body} allowedTypes={["paragraph", "strong", "text", "emphasis", "heading", "list", "listitem"]} />
      </div>
    </Page >
  );
}

export default ViewSinglePost;
