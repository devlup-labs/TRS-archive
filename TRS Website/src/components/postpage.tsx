import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const baseDir = import.meta.env.BACKEND_URL; // Ensure you are using VITE_BACKEND_URL

  const getPost = async () => {
    try {
      const response = await fetch(`${baseDir}/api/posts/upload/`, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data1 = await response.json();
      const matchingPost = data1.find((item) => item.id === id);
      if (matchingPost) {
        setPost(matchingPost);
        console.log(matchingPost);
      } else {
        setError("Post not found");
        console.log(`Successfully`);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPost();
  }, []);

  if (loading) {
    return <div className="mt-48">Loading...</div>;
  }

  if (!post) {
    return <div className="mt-48">Post not found</div>;
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
        {new Date(post.createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-700 mb-4">{post.body}</p>
      {post.pdf && (
        <a
          href={post.pdf}
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