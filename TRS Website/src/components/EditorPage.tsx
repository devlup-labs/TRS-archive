import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DropdownInput from "./DropInput";
import { useDispatch, useSelector } from "react-redux";
import {listPosts} from '../actions/postActions';
import {getReviewers} from "../actions/userActions" 
import { Link } from 'react-router-dom';
import {assignReviewer} from '../actions/reviewActions';
// import {list_underprocess_Posts} from '../actions/postActions';

export const EditorPage = () => {
  const navigate = useNavigate();
  const baseDir = import.meta.env.BACKEND_URL;
  const dispatch = useDispatch();
  const [reviewers, setReviewers] = useState([]);
  // const [cat, setCat] = useState("");

  // const getCategories = useSelector((state) => state.getCategories);
  // const { loadingCat, successCat, categoriesInfo } = getCategories;

  const postList = useSelector((state) => state.postlist);
  const { loading, posts, error } = postList;

  const userLogin = useSelector((state) => state.userLogin);
  const { authToken } = userLogin; //the person who logged in

  // const getUnderProcessPost=useSelector((state)=>state.getallUnderProcessPosts)
  // const { loading:loadingUP_posts, under_process_posts, error:errorUP_posts } = getUnderProcessPost;



  const [selectedReviewers, setSelectedReviewers] = useState({});







  const [upload, setUpload] = useState(false);

const getallReviewers = useSelector((state) => state.getallReviewers);
const {
    loading: loadingReviewers,
    reviewersInfo,
    success: successReviewers,
  } = getallReviewers;






  useEffect(() => {
    
    
    dispatch(listPosts("Ongoing")); 
    // dispatch(list_underprocess_Posts("Under Review"))

    
    

    if(!authToken){
      navigate('/login')
    }
    if(authToken.roles!='editor'){
      navigate('/')
    }
   if(!reviewersInfo){
      dispatch(getReviewers());
    }
    else{
        setReviewers(reviewersInfo.map((reviewer) => reviewer.username));
    }

    // if(successReviewers){
    // window.location.reload();}
    
    
      
      
    
  }, [navigate,dispatch,reviewersInfo]);


   const handleOptionSelect = (postId, reviewer) => {
    setSelectedReviewers((prevSelectedReviewers) => ({
      ...prevSelectedReviewers,
      [postId]: reviewer,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const assignments = Object.keys(selectedReviewers).map(postId => ({
      postId,
      reviewer: selectedReviewers[postId],
    }));
    assignments.forEach(assignment => {
      dispatch(assignReviewer(assignment.postId, assignment.reviewer));
    });
    // navigate('/editor')
    window.location.reload();
  };


  return (
    <div>
        <div className="relative flex flex-col top-40 overflow-y-visible p-4 w-full">
      

  
   <div className="flex flex-row">
     
          <div className="w-3/4">
             <div className="-m-1.5 overflow-x-auto">
    <div className="p-1.5 min-w-full inline-block align-middle">
      <div className="overflow-hidden">
        <form onSubmit={handleSubmit}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">Post</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase ">Reviewer</th>
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase ">Sub_Category</th>
              <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase ">Uploaded By</th>
              <th scope="col" className="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase ">Chosse Reviewer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
           
              {posts && posts.length > 0 ? (
                posts.map((item, postIndex) => (
                   
                       <tr>
                          <Link to={`/post/:${item.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">{item.title}</td>
                      </Link>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.sub_category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.user.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">
                         <select
                         onChange={(e) => handleOptionSelect(item.id, e.target.value)} value={selectedReviewers[item.id] || ""}>
                         <option value="">Choose Reviewer</option> 
                         {reviewers.map((reviewer, index) => (
                        <option key={index} value={reviewer}>{reviewer}</option>
                        ))}
                         </select>
                    </td>
                    
                     </tr>
               
                  ))
                  ) : (
                <li className="text-center">No posts available</li>
              )}
            
              
          </tbody>
        </table>
          <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Assign
        </button>
        </form>
      </div>
    </div>

       </div>
  
     <div className="w-1/2">
              
      </div>
      
    </div>
    </div>
    </div>
    </div>
  );
}
