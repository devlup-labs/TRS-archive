import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import {useSelector } from "react-redux";
import Swal from "sweetalert2";
import axios from "axios";



export const EditorReviewPage = () => {


  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [desc,setDesc]=useState("");
  const [selectedFile, setSelectedFile] =  useState<File | null>(null);
  const [post_status,setPost_Status]=useState("");
  const [reviews,setReviews]=useState(null);


  const baseDir = import.meta.env.BACKEND_URL; 
  const userLogin = useSelector((state) => state.userLogin);
  // console.log(userLogin)
  const { authToken } = userLogin;
  // console.log(authToken)

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

  
  // to getReviews
  const getReviews = async (authToken) => {

    try {
      

    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${authToken.access}`,
      },
    };

      const response = await fetch(`/api/reviews/Reviews/${id}/`, {
        method: "GET",
        headers: config.headers,
      });
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data) {
        setReviews(data);
        console.log(data)
      } 
    

    } 
    
    catch (err) {

       setError(err.message);
    }
     
   finally {
      setLoading(false);
    }
  }


  useEffect(() => { 
    if(!authToken){
      navigate('/login')
    }

    else{
      getPost(authToken);
      getReviews(authToken)
      
    }



    
  },[]);




  const sendReviewToUser=async()=>{
    setLoading(true);
    console.log(selectedFile)
    const config = {
    headers:{
      "Content-type": "multipart/form-data",
      Authorization: `Bearer ${authToken.access}`,
    }}

    try {
    const formData = new FormData();
    formData.append('description', desc);
    formData.append('status', post_status);
    formData.append('reviewed_pdf', selectedFile);
    formData.append('post_id', post.id);

    console.log(formData)

    const { data } = await axios.post(
      "/api/reviews/User/reviews/",
      formData,
      config,
    );
    
    Swal.fire({
      title: "Post status updated successfully and user is notified ",
      icon: "success",
      toast: true,
      timer: 3000,
      position: "top-right",
      timerProgressBar: true,
      showConfirmButton: false,
    });
    
    // navigate('/editor/dashboard')
    }


    catch (error) {
      console.error('Error updating post:', error);
    }
    finally{
      setLoading(false); 
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // console.log(selectedFile)

    console.log("button is clicked")
    sendReviewToUser();
    navigate('/editor/dashboard')
    
  
  };

    if (loading) {
    return <div className="mt-48">Loading...</div>;
  }

  if (!post) {
    return <div className="mt-48">{error}</div>;
  }

const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
      setSelectedFile(file);
    }
  };


  const statusOptions = ["Under_Review", "Need_changes", "Reviewed"];
  const filteredStatusOptions = statusOptions.filter(status => status !== post.status);






  return (
    <>
    <div className="p-4 w-full max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-48">
    <div className="flex justify-between items-start">
      <div className="w-1/2 pr-4">
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



      <div className="w-1/2 pl-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Review To User</h1>
         <form onSubmit={handleSubmit}>


          {/* Add your response form fields here */}
           <p className="text-gray-700 mb-2"> <strong>Description:</strong> </p> 
          <textarea
            value={desc}
            className="w-full p-2 border border-gray-300 rounded-md mb-8"
            placeholder="Write your response here..."
            rows="5" 
            onChange={(e)=>{
                setDesc(e.target.value)
            }}
          />

            

          <div className="flex items-start mb-4">
          <div className="w-1/2">
          <>
          
         
          <p className="text-gray-700 mb-1"><strong>Update Post Status:</strong></p>
          <div className="mb-4">
          <select
            onChange={(e) => setPost_Status(e.target.value)}>
            <option value={post.status}>{post.status}</option>
                  {filteredStatusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
          </select>
          </div>
            </>

         
         </div>

                  
          <div className="w-1/2">
        <p className="text-gray-700 mb-1"><strong>Review PDF (optional):</strong></p>
       
       
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-4"
        />
         
          </div>
           </div>

          <button
            type="submit"
            className="w-full mt-4 bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 "
          >
            Submit
          </button>


          </form>
        </div>
    </div>
     </div>
   
  

  <h1 className="text-4xl font-bold mb-4 mt-20 text-center">Reviews from other reviewer</h1>
  <div className="flex flex-row">
  {reviews && reviews.length > 0 ? (
    reviews.map((review, reviewIndex) => (
      
      <div key={reviewIndex} className="p-4 w-full max-w-2xl mx-auto bg-white shadow-md rounded-lg mt-20">
        
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
    <li className="text-center">No reviews available</li>
  )}

</div>
</>
    
   
  );
};
