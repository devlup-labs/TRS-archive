import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DropdownInput from "./DropInput";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesAction } from "../actions/userActions";
import { listPosts } from "../actions/postActions";
import { News } from "./News";
import { Link } from "react-router-dom";

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

  const token = localStorage.getItem("authTokens");

  const [upload, setUpload] = useState(false);

  const handleOptionSelect = (option) => {
    setCat(option);
  };

  useEffect(() => {
    if (authToken) {
      setUpload(authToken.upload_verified);
    }

    if (!categoriesInfo) {
      dispatch(getCategoriesAction());
      dispatch(listPosts());
    } else {
      console.log(categoriesInfo);
      setCats(categoriesInfo.map((category) => category.name));
    }
  }, [navigate, token, dispatch, categoriesInfo]);

  const truncate = (s: string) => {
    if (s.length > 200) {
      return s.substring(0, 200) + "...";
    } else {
      return s;
    }
  };

  return (
    <div>
      <div className="relative flex flex-col top-40 overflow-y-visible p-4 w-full">
        <DropdownInput
          options={cats}
          style="bg-gray-900 w-[45%] mb-3 rounded-lg"
          b_bar={false}
          onOptionSelect={handleOptionSelect}
        />
        <div className="flex flex-row">
          <ul className="w-1/2">
            {posts && posts.length > 0 ? (
              posts.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col w-[90%] border border-black shadow-md p-2 rounded-md mb-2 shadow-red-500"
                >
                  <div className="mb-2 border-b border-b-black">
                    <a href={`/post/${item.id}`}>
                      <strong>{item.title}</strong>
                    </a>
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
          <div className="w-1/2">
            <News />
          </div>
        </div>
      </div>
    </div>
  );
}
