import { useEffect, useState } from "react";
// import { mainPageData } from "../constants";
import { useNavigate } from "react-router-dom";
import DropdownInput from "./DropInput";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesAction } from "../actions/userActions";
<<<<<<< HEAD
import { listPosts } from "../actions/postActions";
=======
import {listPosts} from '../actions/postActions';
import { News } from "./News";
import { Link } from 'react-router-dom';
>>>>>>> ec6282023722e75b4f9f742b5cfa913945dea1f6

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

<<<<<<< HEAD
  const token = localStorage.getItem("authTokens");
=======

>>>>>>> ec6282023722e75b4f9f742b5cfa913945dea1f6
  const [upload, setUpload] = useState(false);

  const handleOptionSelect = (option) => {
    setCat(option);
  };
<<<<<<< HEAD

  useEffect(() => {
    // const token = localStorage.getItem("authTokens");
    dispatch(listPosts());

    if (authToken) {
      setUpload(authToken.upload_verified);
=======
  



  useEffect(() => {
    
    if (authToken) {
       setUpload(authToken.upload_verified);
>>>>>>> ec6282023722e75b4f9f742b5cfa913945dea1f6
    }

    if (!categoriesInfo) {
      dispatch(getCategoriesAction());
      dispatch(listPosts())
    } else {
      
      console.log(categoriesInfo);
      setCats(categoriesInfo.map((category) => category.name));
    }
<<<<<<< HEAD
  }, [navigate, token, dispatch, categoriesInfo]);
=======
  }, [dispatch, categoriesInfo]);


>>>>>>> ec6282023722e75b4f9f742b5cfa913945dea1f6

  const truncate = (s: string) => {
    if (s.length > 200) {
      return s.substring(0, 200) + "...";
    } else {
      return s;
    }
  };

  return (
    <div>
<<<<<<< HEAD
      <div className="relative flex flex-col top-40 overflow-y-visible p-4 w-full">
        <DropdownInput
          options={cats}
          style="bg-gray-900 w-[45%] mb-3 rounded-lg"
          b_bar={false}
          onOptionSelect={handleOptionSelect}
        />

        <div className="items-center">
          {upload ? <a href="/Upload">Upload</a> : null}
        </div>

        <div className="flex flex-row">
          <ul className="w-1/2">
            {posts && posts.length > 0 ? (
              posts.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col w-[90%] border border-black shadow-md p-2 rounded-md mb-2 shadow-red-500"
                >
                  <div className="mb-2 border-b border-b-black">
                    <strong>{item.title}</strong>
                  </div>
                  <div className="mb-2">
                    <p>{truncate(item.body)}</p>
                  </div>
                  <div className="flex flex-row justify-between">
                    <a
                      href={baseDir + item.document}
                      target="_blank"
                      // onClick={() => console.log(`Clicked ${index} link`)}
                    >
                      PDF
                    </a>
                    <p>{item.user.username}</p>
                    <p>{item.category}</p>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-center">No posts available</li>
            )}
          </ul>
        </div>
      </div>
    </div>
=======
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
      <News />
    </div>
    </div>
  </div>



>>>>>>> ec6282023722e75b4f9f742b5cfa913945dea1f6
  );
}
