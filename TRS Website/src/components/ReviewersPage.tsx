import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getAssignedPosts } from "../actions/postActions";
import Loader from './Loader.tsx'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';


export const ReviewersPage = () => {


  const dispatch = useDispatch();
  const navigate = useNavigate();


  const userLogin = useSelector((state) => state.userLogin);
  const { authToken } = userLogin;

    const assignedPosts = useSelector((state) => state.assignedPosts);
  const { loading, success, posts, error } = assignedPosts;





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
      if(posts.length==0){
            dispatch(getAssignedPosts())
       }
    }, [navigate,dispatch]);





  if (loading) {
    return <Loader></Loader>
  }
  
  return (
        <div>
        <div className="relative flex flex-col top-40 overflow-y-visible p-4 w-full">
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
              <th scope="col" className="px-6 py-3 text-start text-xs font-medium text-black uppercase ">More Details</th>


            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
           
              {posts && posts.length > 0 ? (
                posts.map((item, postIndex) => (
                   
                       <tr>
                      <Link to={`/post/:${item.post.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 ">{item.post.title}</td>
                      </Link>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.reviewer.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.editor.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 ">{item.post.status}</td>
                      
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
  
     <div className="w-1/2">
              
      </div>
      
    </div>
    </div>
    </div>
    </div>

  );
};
