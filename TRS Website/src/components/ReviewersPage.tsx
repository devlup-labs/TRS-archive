import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getAssignedPosts } from "../actions/postActions";
import { getReviewedReviews } from "../actions/reviewActions.tsx";
import Loader from './Loader.tsx'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';


export const ReviewersPage = () => {


  const dispatch = useDispatch();
  const navigate = useNavigate();


  const userLogin = useSelector((state) => state.userLogin);
  const { authToken } = userLogin;

  const assignedPosts = useSelector((state) => state.assignedPosts);
  const { loading:loadingUnreviewedPosts, success:successUnreviewedPosts, posts, error:errorUnreviewedPosts } = assignedPosts;

  const reviewedReviews = useSelector((state)=>state.getallReviewedReviews)
  const {loading:loadingReviewedReviews,success:successReviewedReviews,reviews,error:errReviewedReviews }=reviewedReviews

  const editReview=useSelector((state)=>state.editReview);
  const {loading,success,response,error}=editReview

   const [activeTab, setActiveTab] = useState("unreviewedReviews");




useEffect(() => {
    if (!authToken) {
        navigate("/login");
        }
    if(authToken.roles!='reviewer'){
        Swal.fire({
        title: "You are not allowed to use this page",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
          navigate('/')
          window.location.reload();
      }
      else{
          if(activeTab==="unreviewedReviews"){
            dispatch(getAssignedPosts())
          }
          else if(activeTab==="reviewedReviews"){
            dispatch(getReviewedReviews())
          }
       }
    }, [navigate,dispatch,activeTab]);





  // if (loadingUnreviewedPosts|loadingReviewedReviews) {
  //   return <Loader></Loader>
  // }
  
const renderUnreviewedReviews=()=>{
  return (
   <div className="relative flex flex-col  overflow-y-visible p-4 w-full">
        <div className="flex flex-row">
        <div className="w-3/4">
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
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Submit Review</th>


            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
           
              {posts && posts.length > 0 ? (
                posts.map((item, postIndex) => (
                   
                       <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">
                      <Link to={`/post/:${item.post.id}`}>
                        {item.post.title}
                      </Link>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">
                        <Link to={`/profile/:${item.reviewer.username}`}>{item.reviewer.username}</Link></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">
                        <Link to={`/profile/:${item.editor.username}`}>{item.editor.username}</Link></td>
                     
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.post.status}</td>
                      
                      {/* here link to the review page information will come  */}
                      <Link to={`/reviewer/ereview/:${item.id}`}>   
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 "><i className="fa-solid fa-pen-to-square"></i></td>
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
  
     <div className="w-1/2">
              
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
        <div className="w-3/4">
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
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Submit Review</th>


            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
           
              {reviews && reviews.length > 0 ? (
                reviews.map((item, postIndex) => (
                   
                       <tr>
                      <Link to={`/post/:${item.post.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">{item.post.title}</td>
                      </Link>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.reviewer.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.editor.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.post.status}</td>
                      
                      {/* here link to the review page information will come  */}
                      <Link to={`/reviewer/ereview/:${item.id}`}>   
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 "><i className="fa-solid fa-pen-to-square"></i></td>
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
  
     <div className="w-1/2">
              
      </div>
      
    </div>
    </div>
    </div>
  )
}






   return (
    <div className="mt-44">
      {(loadingUnreviewedPosts || loadingReviewedReviews || loading) && <Loader />}
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

            </div>
            {activeTab === "unreviewedReviews" && renderUnreviewedReviews()}
            {activeTab === "reviewedReviews" && renderReviewedReviews()}

          </div>
        </div>

      </div>
    </div>
  );

;
};
