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
    
    
    dispatch(listPosts("Reviewed"));

    
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
  <div className="relative flex flex-col top-40 overflow-y-visible p-4 w-full">
    <div className="items-center">
      {upload ? <a href="/Upload">Upload</a> : null}
    </div>

    <div className="flex flex-row">
      <ul className="w-1/2">
        {cats.map((cat, index) => {
          // Filter posts by category
          const filteredPosts = posts.filter(post => post.category === cat);
          // Only render if there are posts in this category
          if (filteredPosts.length > 0) {
            return (
              <li key={index} className="mb-6">
                <h1 className="text-2xl font-bold mb-2">{cat}</h1>
                <ul>
                  {filteredPosts.map((item, postIndex) => (
                    <li key={postIndex} className="mb-2">
                      <Link to={`/post/${item.id}`} className="text-blue-600 hover:underline">
                        {item.title}
                      </Link>
                    </li>
                  ))} 
                </ul>
              </li>
            );
          } else {
            return null; // Skip rendering if there are no posts in this category
          }
        })}
      </ul>
      <div className="w-1/2">
        <News />
      </div>
    </div>
  </div>
);

}
