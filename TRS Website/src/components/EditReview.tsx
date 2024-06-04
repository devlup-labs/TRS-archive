 import { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import {useDispatch,useSelector } from "react-redux";
import Loader from './Loader.tsx';
import { Link } from 'react-router-dom';
import { updateReview } from "../actions/reviewActions.tsx";
import Message from "./Message";


export const EditReview = () => {
  const { id } = useParams();
  const dispatch=useDispatch();
    const navigate = useNavigate();
  const [review, setReview] = useState(null);  //to bring the state of review from backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


const [desc,setDesc]=useState("")
const [selectedFile, setSelectedFile] = useState(null); 
const [isDone,setIsDone]=useState(false )
const [message, setMessage] = useState("");
const [review_summ,setReview_Summ]=useState("");





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
      }
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
    if(!authToken || authToken.roles!='reviewer' ){
      navigate('/login')
    }

    else{
        if(!review){
            getReview(authToken);
        }
        else{
            // setting the values that have already being updated before
            setDesc(review.description)
            // setSelectedFile(review.reviewed_pdf) to avoid overwritting 
            setIsDone(review.is_reviewed)
            setReview_Summ(review.pdf_file_status)
        }
       
      
    }
    
  },[dispatch, authToken, review, navigate]);


   const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log(file);
      setSelectedFile(file);
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(selectedFile)
    // console.log("button is clicked")

    if (!selectedFile) {
      // setMessage("Please select a File");
      dispatch(      
        updateReview({
        id: review.id,
        desc: desc,
        is_reviewed:isDone,
        pdf_file_status:review_summ,
        // reviewed_pdf:selectedFile,      
      })
    )
    navigate('/reviewer')
    } 
    
    else{
    console.log("Updating....");
    dispatch(
      updateReview({
        id: review.id,
        desc: desc,
        is_reviewed:isDone,
        reviewed_pdf:selectedFile,
        pdf_file_status:review_summ,
      })
      )
      navigate('/reviewer')
    
  
  };



};



  if (loading) {
    // return <div className="mt-48">Loading...</div>;
    return <Loader></Loader>
  }

  if (!review) {
    return <div className="mt-48">{error}</div>;
  }



 

  return (
      <div className="p-4 w-full max-w-6xl mx-auto bg-white shadow-md rounded-lg mt-48">
    <h1 className="text-2xl font-bold mb-4 text-center">Review Submission</h1>
    {message && <Message variant="danger">{message}</Message>}
    
    <div className="flex justify-between items-start">
      <div className="w-1/2 pr-4">
        <h1 className="text-xl font-bold mb-4">Post Details</h1>
        
        <p className="text-gray-700 mb-2">
          <strong>Title:</strong> {review.post.title}
        </p>
        
        <p className="text-gray-700 mb-2">
        
          <strong>Submitted By:</strong> {review.post.user.username}
        </p>

        <p className="text-gray-700 mb-4">
        <strong>Post Submitted On:</strong>{" "}
          {new Date(review.post.created_at).toLocaleDateString()}
        </p>


        <p className="text-gray-700 mb-4">
          <strong>Abstract:</strong> {review.post.body}
        </p>
        <p className="mb-2">
           <Link to={`/post/:${review.post.id}`}>
                       Other details...
            </Link>
        </p>

        
       
      </div>

      <div className="inline-block h-[250px] min-h-[1em] w-0.5 self-stretch bg-black/30"></div> {/* Vertical line separator */}

      <div className="w-1/2 pl-4">
        <h1 className="text-xl font-bold mb-4">Your Review</h1>
        
        
        
        
        <form onSubmit={handleSubmit}>
          {/* Add your response form fields here */}
           <p className="text-gray-700 mb-2"> <strong>Description:</strong> </p> 
          <textarea
            value={desc}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Write your response here..."
            onChange={(e)=>{
                setDesc(e.target.value)
            }}
          />

        <p className="text-gray-700 mb-1"><strong>Chosse Review feedback:</strong></p>
         <div className="mb-4">
         <select
                         onChange={(e) => setReview_Summ(e.target.value)}>
                         <option value={review_summ}>{review_summ}</option> 
                         <option value="Ongoing">Ongoing</option> 
                         <option value="Under_Review">Under_Review</option> 
                         <option value="Need_changes">Need changes</option> 
                         <option value="Reviewed">Reviewed</option> 
                         
                         
        </select>
        </div>   



          <div className="flex items-start mb-4">
          <div className="w-1/2">
         
         
         
          <p className="text-gray-700 mb-1"><strong>Review PDF (optional):</strong></p>
       
       
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-4"
        />
        {/* {selectedFile && (
              <div>
                <p className="text-gray-700 mb-1"><strong>Selected File:</strong></p>
                <object
                  data={URL.createObjectURL(selectedFile)}
                  type="application/pdf"
                  width="100%"
                  height="400px"
                >
                  <p>PDF preview is not available.</p>
                </object>
              </div>
            )} */}

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
        <div className="w-1/2 pl-2">
             <label className="flex items-center">
              <input
                type="checkbox"
                onChange={(e)=>setIsDone(e.target.checked)}
                checked={isDone}
                className="form-checkbox"
              />
              <span className="ml-2 text-gray-700">Reviewed</span>
            </label>

          
        </div>
 
        </div>
          <button
            type="submit"
            className="w-full bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            Save Changes
          </button>
         


        </form>
      </div>
    </div>
  </div>
  );
};

export default EditReview;
