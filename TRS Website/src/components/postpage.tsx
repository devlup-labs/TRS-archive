import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import {useSelector } from "react-redux";

export const PostPage = () => {
  const { id } = useParams();
    const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseDir = import.meta.env.BACKEND_URL; 

  const userLogin = useSelector((state) => state.userLogin);
  console.log(userLogin)
  const { authToken } = userLogin;
  console.log(authToken)

  const getPost = async (authToken) => {
    try {
      console.log(id)
      

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken.access}`,
      },
    };

      const response = await fetch(`/api/posts/getpost/${id}/`, {
        method: "GET",
        headers: config.headers,
      });
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data1 = await response.json();
      if (data1) {
        setPost(data1);
        console.log(data1.created_at);
      } 
      
      // else {
      //   setError("Post not found");
      //   console.log(`error`);
      // }

    } 
    
    catch (err) {
       if (err.message.includes("403")) {
      setError("Post under review. You are not allowed to view it.");
    }else{
       setError(err.message);
    }
     
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if(!authToken){
      navigate('/login')
    }

    else{
      getPost(authToken);
    }
    
  },[]);

  if (loading) {
    return <div className="mt-48">Loading...</div>;
  }

  if (!post) {
    return <div className="mt-48">{error}</div>;
  }

  return (
    <div className="p-4 w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg mt-48">
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-700 mb-2">
        <strong>Author:</strong> {post.user.username}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Category:</strong> {post.category}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>SubCategory:</strong> {post.subCategory}
      </p>
      <p className="text-gray-700 mb-4">
        <strong>Created At:</strong>{" "}
        {new Date(post.created_at).toLocaleDateString()}
      </p>
      <p className="text-gray-700 mb-4">{post.body}</p>
      
      {post.document && (
        <a
          href={post.document}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View PDF
        </a>
      )}
    </div>
  );
};

export default PostPage;
