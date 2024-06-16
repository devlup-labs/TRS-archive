import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import {useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";



export const UserPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const baseDir = import.meta.env.BACKEND_URL; 
  const userLogin = useSelector((state) => state.userLogin);

  const { authToken } = userLogin;

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


const getUserReviews = async (authToken) =>{
    try {
      console.log(id)
      

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken.access}`,
      },
    };

    const response = await fetch(`/api/reviews/Review/User/${id}/`, {
        method: "GET",
        headers: config.headers,
      });
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data)
      if (data) {
        setReviews(data);
      } 


    } 
    
    catch (err) {
      
    setError(err.message);
     
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
      getUserReviews(authToken);
      
    }



    
  },[]);

if (loading) {
    return <div className="mt-48">Loading...</div>;
  }

  if (!post) {
    return <div className="mt-48">{error}</div>;
  }

  const hasReviews = reviews && reviews.length > 0;
  const firstReview = hasReviews ? reviews[0] : null;
  const otherReviews = hasReviews ? reviews.slice(1) : [];

    return(
        <>
    <div className="p-4 w-full max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-48 ">
    <div className="flex justify-between items-start">
      <div className="w-1/2 pr-4 text-center">
      <h1 className="text-2xl font-bold mb-4 text-center">Post Details</h1>
      <h1 className="text-xl font-bold mb-4">{post.title}</h1>
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
          href={import.meta.env.BACKEND_URL+post.document}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View PDF
        </a>
      )}
    </div>

     <div className="inline-block h-[400px] min-h-[1em] w-0.5 self-stretch bg-black/30"></div> {/* Vertical line separator */}    
      

      {/* review from the editor */}
      <div className="w-1/2 pl-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Review From Editor</h1>
        {reviews && reviews.length > 0 ? (
        
        <div> 
      <p className="text-gray-700 mb-2 text-lg">
          <strong>Editor:</strong> {firstReview.reviewer.username}
        </p>
       <p className="text-gray-700 mb-2 text-lg">
          <strong>Review Instance Created At:</strong>{" "}
          {new Date(firstReview.created_at).toLocaleDateString()}
        </p>
       <p className="text-gray-700 mb-2 text-lg">
          <strong>Review Description: </strong>{firstReview.description}
        </p>

        <p className="text-gray-700 mb-2 text-lg">
          <strong>Review Feedback: </strong>{post.status}
        </p>

      {firstReview.reviewed_pdf && (
        <a
          href={import.meta.env.BACKEND_URL+reviews[0].reviewed_pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View Review PDF
        </a>
      )}


      </div>
  
  ) : (
    <li className="text-center">Post still under review</li>
  )}
      </div>

    </div>
    </div>

  <h1 className="text-4xl font-bold  mt-10 text-center">Reviews from other reviewer</h1>
  <div className="flex flex-row">
  {otherReviews && otherReviews.length > 0 ? (
    otherReviews.map((review, reviewIndex) => (
      
      <div key={reviewIndex} className="p-4 w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg mt-10">
        
        <h1 className="text-2xl font-bold mb-4">{review.post.title}</h1>
        <p className="text-gray-700 mb-2">
          <strong>Reviewer:</strong> {review.reviewer.username}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Review Instance Created At:</strong>{" "}
          {new Date(review.created_at).toLocaleDateString()}
        </p>
        <p className="text-gray-700 mb-4">
          <strong>Review Description: </strong>{review.description}
        </p>

      {review.reviewed_pdf && (
        <a
          href={import.meta.env.BACKEND_URL+review.reviewed_pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          View Review PDF
        </a>
      )}


      </div>
    ))
  ) : (
    <li className="text-center">No other reviews</li>
  )}
  </div>
    </>
    )

}