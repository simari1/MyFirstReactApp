import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";

function ProfilePosts() {
  const cancelRequest = Axios.CancelToken.source();
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async function fetchPosts() {
      try {
        console.log(username);
        const response = await Axios.get(`/profile/${username}/posts`, { cancelToken: cancelRequest.token });
        setPosts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    })();
    return () => {
      cancelRequest.cancel();
    }
  }, []);

  if (isLoading) return <LoadingDotsIcon />;
  return (
    <>
      <div className="list-group">
        {posts.map((post) => {

          return (
            <Link
              key={post._id}
              to={`/post/${post._id}`}
              className="list-group-item list-group-item-action"
            >
              <img className="avatar-tiny" src={post.author.avatar} />{" "}
              <strong>{post.title}</strong>{" "}
              <span className="text-muted small">
                on {(new Date(post.createdDate)).toLocaleDateString("en-US")}{" "}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default ProfilePosts;
