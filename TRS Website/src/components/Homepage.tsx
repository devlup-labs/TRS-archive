import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useSearch } from "../context/SearchContext";
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import News from "./News";

export default function Home() {
  const { searchQuery } = useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const baseDir = "http://127.0.0.1:8000";
  const [data, setData] = useState([]);
  const filtered = data.filter((item) => item.title.includes(searchQuery));

  useEffect(() => {
    const token = localStorage.getItem("authTokens");
    getData();
    if (token) {
      setEmail(jwtDecode(JSON.parse(token).access).email);
      const decode = jwtDecode(token);
      setUpload(decode.upload_verified);
    }
    getData();
    // else {
    //   navigate("/login");
    // }
  }, [navigate]);
  const trunctate = (s: string) => {
    if (s.length > 200) {
      return s.substring(0, 200) + "...";
    } else {
      return s;
    }
  };
  // console.log(upload)
  const getData = async () => {
    try {
      // const access = JSON.parse(token || "").access;
      const response = await fetch("http://127.0.0.1:8000/api/upload/", {
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
      // console.log(err);
    }
  };
  return (
    <div className="relative flex flex-col top-40 overflow-y-visible p-4 w-full">
      <Search />
      <div className="flex flex-row">
        <ul className="w-1/2">
          {filtered.map((item, index) => (
            <li
              key={index}
              className="flex flex-col w-[90%] border border-black shadow-md p-2 rounded-md mb-2 shadow-red-500"
            >
              <div className="mb-2 border-b border-b-black">
                <strong>{item.title}</strong>
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
          <News />
        </div>
      </div>
    </div>
  );
}
