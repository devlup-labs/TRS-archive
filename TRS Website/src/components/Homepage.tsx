import { useEffect, useState } from "react";
// import { mainPageData } from "../constants";
import { jwtDecode } from "jwt-decode";
import { useSearch } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";
import DropdownInput from "./DropInput";
import { useDispatch, useSelector } from "react-redux";
import { getCategoriesAction } from "../actions/userActions";

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const baseDir = import.meta.env.BACKEND_URL;
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const [cats, setCats] = useState([]);
  const [cat, setCat] = useState("");
  const getCategories = useSelector((state) => state.getCategories);
  const filtered = data.filter((item) => item.category.includes(cat));
  const { loadingCat, successCat, categoriesInfo } = getCategories;
  const token = localStorage.getItem("authTokens");
  const [upload, setUpload] = useState(false);
  const handleOptionSelect = (option) => {
    setCat(option);
  };
  useEffect(() => {
    const token = localStorage.getItem("authTokens");
    getData();
    if (token) {
      setEmail(jwtDecode(JSON.parse(token).access).email);
      const decode = jwtDecode(token);
      setUpload(decode.upload_verified);
    }

    if (!categoriesInfo) {
      dispatch(getCategoriesAction());
    } else {
      console.log(categoriesInfo);
      setCats(categoriesInfo.map((category) => category.name));
    }
  }, [navigate, token, dispatch, categoriesInfo]);
  const trunctate = (s: string) => {
    if (s.length > 200) {
      return s.substring(0, 200) + "...";
    } else {
      return s;
    }
  };
  // console.log(upload)
  const getData = async () => {
    const token = localStorage.getItem("authTokens");
    try {
      // const access = JSON.parse(token || "").access;
      const response = await fetch(baseDir + "/api/posts/upload/", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      else {
        const data1 = await response.json();
        // console.log(data1);
        setData(data1);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="relative flex flex-col top-40 overflow-y-visible p-4 w-full">
      <DropdownInput
        options={cats}
        style="bg-gray-900 w-[45%] mb-3 rounded-lg"
        b_bar={false}
        onOptionSelect={handleOptionSelect}
      />
      <div className="flex flex-row">
        <ul className="w-1/2">
          {filtered.map((item, index) => (
            <li
              key={index}
              className="flex flex-col w-[90%] border border-black shadow-md p-2 rounded-md mb-2 shadow-red-500"
            >
              <div className="mb-2 border-b border-b-black">
                <a href={"post/" + item.id}>
                  <strong>{item.title}</strong>
                </a>
              </div>
              <div className="mb-2">
                <p>{trunctate(item.body)}</p>
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
          ))}
        </ul>
        <div className="items-center">
          {upload == true ? <a href="/Upload">Upload</a> : <></>}
        </div>
      </div>
    </div>
  );
}
