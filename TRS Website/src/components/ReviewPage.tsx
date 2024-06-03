import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import {useSelector } from "react-redux";
import Loader from './Loader.tsx'


export const ReviewPage = () => {
  const { id } = useParams();
    const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const baseDir = import.meta.env.BACKEND_URL; 

  const userLogin = useSelector((state) => state.userLogin);
  const { authToken } = userLogin;


  const getReview = async (authToken) => {
    try {
      console.log(id)
      

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken.access}`,
      },
    };

      const response = await fetch(`/api/reviews/review/${id}/`, {
        method: "GET",
        headers: config.headers,
      });
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data1 = await response.json();
      
      if (data1) {
        setReview(data1);
        console.log(data1);
      } 
      
      else {
        setError("Review not found");
        console.log(`error`);
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
      getReview(authToken);
    }
    
  },[]);




  if (loading) {
    // return <div className="mt-48">Loading...</div>;
    return <Loader></Loader>
  }

  if (!review) {
    return <div className="mt-48">{error}</div>;
  }





  return (
    <div className="p-4 w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg mt-48">
      <h1 className="text-2xl font-bold mb-4">{review.post.title}</h1>
      <p className="text-gray-700 mb-2">
        <strong>Reviewer:</strong> {review.reviewer.username}
      </p>
      <p className="text-gray-700 mb-2">
        <strong>Editor:</strong> {review.editor.username}
      </p>

  

      <p className="text-gray-700 mb-4">
        <strong>Review Instance Created At:</strong>{" "}
        {new Date(review.created_at).toLocaleDateString()}
      </p>

      <p className="text-gray-700 mb-4">
        <strong>Review Description: </strong>{review.description}</p>

      
         <div className="mb-2">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={review.is_reviewed}
            readOnly
            className="form-checkbox"
          />
          <span className="ml-2 text-gray-700">Reviewed</span>
        </label>
    </div>
    
      
      {review.reviewed_pdf && (
        <a
          href={import.meta.env.BACKEND_URL + review.reviewed_pdf}
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

export default ReviewPage;
