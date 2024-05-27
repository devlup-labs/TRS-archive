import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DropdownInput from "./DropInput";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesAction } from "../actions/postActions";
import {listPosts} from '../actions/postActions';
import { News } from "./News";
import { Link } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const baseDir = import.meta.env.BACKEND_URL;
  const dispatch = useDispatch();
  const [cats, setCats] = useState([]);
  const [cat, setCat] = useState("");

  const getCategories = useSelector((state) => state.getCategories);
  const { loadingCat, successCat, categoriesInfo } = getCategories;

  const postList = useSelector((state) => state.postlist);
  const { loading, posts, error } = postList;

  const userLogin = useSelector((state) => state.userLogin);
  const { authToken } = userLogin; //the person who logged in


  const [upload, setUpload] = useState(false);

  const handleOptionSelect = (option) => {
    setCat(option);
  };
  



  useEffect(() => {
    
    
    dispatch(listPosts());

    
    if (authToken) {
       setUpload(authToken.upload_verified);
    }

   
    if (!categoriesInfo) {
      dispatch(getCategoriesAction());
      
    } else {
      console.log(categoriesInfo);
      setCats(categoriesInfo.map((category) => category.name));
    }
  }, [navigate, dispatch, categoriesInfo]);


  return (
    <div>
        <div className="relative flex flex-col top-40 overflow-y-visible p-4 w-full">
       {/* {/* <DropdownInput
       options={cats}
         style="bg-gray-900 w-[45%] mb-3 rounded-lg"
         b_bar={false}
         onOptionSelect={handleOptionSelect}
       /> */}
      
    <div className="items-center">
      {upload ? <a href="/Upload">Upload</a> : null}
    </div>
  
   <div className="flex flex-row">
      <ul className="w-1/2">
        {cats.map((cat, index) => (
          <li key={index}>
            <h1 className="text-[40px]">{cat}</h1>
            <ul>
             {posts && posts.length > 0 ? (
                posts
                  .filter(post => post.category === cat) // Filter posts by category
                  .map((item, postIndex) => (
                    <li
                      key={postIndex}
                      
                    >
                         <Link to={`/post/:${item.id}`}>
                      <p>{item.title}</p>
                      </Link>
                      
                    </li>
                  ))
              ) : (
                <li className="text-center">No posts available</li>
              )}
            </ul>
          </li>
        ))}
          </ul>
          <div className="w-1/2">
            <News />
          </div>
        </div>
      </div>
    </div>
  );
}
