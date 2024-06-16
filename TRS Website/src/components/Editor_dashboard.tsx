import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {listEditorReviewAction} from "../actions/reviewActions";
import { getReviewedReviews } from "../actions/reviewActions.tsx";
import { Link } from 'react-router-dom';

export const EditorDashboard=() =>{
    const dispatch = useDispatch();
    const navigate = useNavigate();   


    const [activeTab, setActiveTab] = useState("unreviewedReviews");
    const [loading,setLoading]=useState(false)
    const [myreviews,setMyReviews]=useState(null)
    
    const userLogin = useSelector((state) => state.userLogin);
    const { authToken } = userLogin; //the person who logged in


    const getReviewsUnderProcess = useSelector((state) => state.getallReviewsAssignedByEditor);
    const {loading: loadingReviews,reviewsInfo,success: successReviews} = getReviewsUnderProcess;


  const reviewedReviews = useSelector((state)=>state.getallReviewedReviews)
  const {loading:loadingReviewedReviews,success:successReviewedReviews,reviews,error:errReviewedReviews }=reviewedReviews


  const myReviews=async()=>{
    setLoading(true);

    const config = {
    headers:{
      "Content-type": "application/json",
      Authorization: `Bearer ${authToken.access}`,
    }}
    try {
    const response = await fetch(`/api/reviews/Editor/reviews/reviewed/`, {
        method: "GET",
        headers: config.headers,

      });
    
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

    const data=await response.json();

    if (data) {
        setMyReviews(data);
        console.log(data);
      } 

    }
    catch (error) {
      console.error('Error updating post:', error);
    }
    finally{
      setLoading(false); 
    }
  }
  


 useEffect(() => {
            if (!authToken) {
            navigate("/login");
            }
            else{
            if(authToken.roles!='editor'){
                navigate('/')
                window.location.reload();
            }
            else{
              if(activeTab==="unreviewedReviews"){
                dispatch(listEditorReviewAction())
            }
            else if(activeTab==="reviewedReviews"){
              dispatch(getReviewedReviews())
            }
            else if(activeTab==="myReviews"){
              myReviews()
            }

            }
            

            }
            
            }, [navigate,dispatch,activeTab]);


            

    const renderPendingReviews=()=>{
      return (
      
        <div className="relative flex flex-col overflow-y-visible p-4 w-full">
        <div className="flex flex-row">
        <div className="w-full">
        <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">

        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Post</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Reviewer</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Editor</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Post_Status</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Review_Status</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">More Details</th>


            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
           
              {reviewsInfo && reviewsInfo.length > 0 ? (
                reviewsInfo.map((item, postIndex) => (
                   
                       <tr>
                      <Link to={`/post/editorReview/:${item.post.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">{item.post.title}</td>
                      </Link>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.reviewer.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.editor.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.post.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.pdf_file_status}</td>
                      
                      {/* here link to the review page information will come  */}
                      <Link to={`/editor/review/:${item.id}`}>   
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 "><i className="fa-solid fa-arrow-up-right-from-square"></i></td>
                    </Link>
                    
                     </tr>
               
                  ))
                  ) : (
                <li className="text-center">No posts available</li>
              )}
            
              
          </tbody>
        </table>
      </div>
    </div>

       </div>

      
    </div>
    </div>
    </div>

      )
    }

  const renderReviewedReviews=()=>{
      return (
   <div className="relative flex flex-col overflow-y-visible p-4 w-full">
        <div className="flex flex-row">
        <div className="w-full">
        <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">

        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Add_Your_Review</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Reviewer</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Editor</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Post_Status</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Review_Status</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Review Overview</th>


            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
           
              {reviews && reviews.length > 0 ? (
                reviews.map((item, postIndex) => (
                   
                       <tr>
                      <Link to={`/post/editorReview/:${item.post.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">{item.post.title}</td>
                      </Link>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.reviewer.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.editor.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.post.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.pdf_file_status}</td>
                      
                      {/* here link to the review page information will come  */}
                     <Link to={`/editor/review/:${item.id}`}>   
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 "><i className="fa-solid fa-arrow-up-right-from-square"></i></td>
                    </Link>
                    
                     </tr>
               
                  ))
                  ) : (
                <li className="text-center">No posts available</li>
              )}
            
              
          </tbody>
        </table>
      </div>
    </div>

       </div>
  

      </div>
    
    </div>
    </div>
  )
    }

  const renderEditorsReviews=()=>{
      return (
   <div className="relative flex flex-col overflow-y-visible p-4 w-full">
        <div className="flex flex-row">
        <div className="w-full">
        <div className="-m-1.5 overflow-x-auto">
              <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">

        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Post</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Reviewer</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Editor</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Post_Status</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Review_Status</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Review Overview</th>


            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
           
              {myreviews && myreviews.length > 0 ? (
                myreviews.map((item, postIndex) => (
                   
                       <tr>
                      <Link to={`/post/editorReview/:${item.post.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">{item.post.title}</td>
                      </Link>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.reviewer.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.editor.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.post.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.pdf_file_status}</td>
                      
                      {/* here link to the review page information will come  */}
                     <Link to={`/editor/review/:${item.id}`}>   
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 "><i className="fa-solid fa-arrow-up-right-from-square"></i></td>
                    </Link>
                    
                     </tr>
               
                  ))
                  ) : (
                <li className="text-center">No posts available</li>
              )}
            
              
          </tbody>
        </table>
      </div>
    </div>

       </div>
  

      </div>
    
    </div>
    </div>
  )
    }




  return (
    <div className="mt-44">
      {(loadingReviews || loadingReviewedReviews || loading ) && <Loader />}
      <div className="flex flex-row">
        <div className="w-3/4">
          <div className="flex flex-col">
            <div className="flex justify-evenly my-3">
              <button
                onClick={() => setActiveTab("unreviewedReviews")}
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  activeTab === "unreviewedReviews"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Unreviewed
              </button>
              <button
                onClick={() => setActiveTab("reviewedReviews")}
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  activeTab === "reviewedReviews"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Reviewed
              </button>
              <button
                onClick={() => setActiveTab("myReviews")}
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  activeTab === "myReviews"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                MyReviews
              </button>

            </div>
            {activeTab === "unreviewedReviews" && renderPendingReviews()}
            {activeTab === "reviewedReviews" && renderReviewedReviews()}
            {activeTab === "myReviews" && renderEditorsReviews()}

          </div>
        </div>

      </div>
    </div>
  );
}










