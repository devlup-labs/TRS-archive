import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import { getUsers } from "../actions/userActions"; // Assume you have these actions
import { useNavigate } from "react-router-dom";
import { listPosts } from "../actions/postActions";
import { News } from "./News";

export const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const baseDir = import.meta.env.BACKEND_URL;
  const [activeTab, setActiveTab] = useState("users");

  const userLogin = useSelector((state) => state.userLogin);
  const { authToken } = userLogin; //the person who logged in

  const getallUser = useSelector((state) => state.getallUser);
  const {
    loading: loadingUsers,
    usersInfo,
    success: successUsers,
  } = getallUser;

  const getallPosts = useSelector((state) => state.postlist);
  const { loading, posts, error } = getallPosts;

  // const getallEditors = useSelector((state) => state.getallEditors);
  // const {
  //   loading: loadingEditors,
  //   editorsInfo,
  //   success: successEditors,
  // } = getallEditors;

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    } else {
      if (authToken.roles === "admin") {
        if (activeTab === "users") {
          dispatch(getUsers());
          console.log(usersInfo);
        } else if (activeTab === "posts") {
          dispatch(listPosts());
        } // else if (activeTab === "editors") {
        //   dispatch(getEditors());
        // }
      } else {
        navigate("/");
      }
    }
  }, [authToken, dispatch, navigate, activeTab]);

  const renderUsers = () => {
    const unverifiedUsers = usersInfo;

    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        {successUsers && (
          <ul className="flex flex-col gap-4 border border-gray-300 rounded-lg shadow-md p-4 bg-white">
            {unverifiedUsers.map((user, index) => (
              <li
                key={index}
                className="border-b border-gray-200 last:border-none pb-4 mb-4 last:pb-0 last:mb-0"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-semibold text-gray-800">
                    Username:{" "}
                    <span className="font-normal">{user.username}</span>
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    Email: <span className="font-normal">{user.email}</span>
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    Affiliation:{" "}
                    <span className="font-normal">
                      {user.affiliation || "N/A"}
                    </span>
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    Is Staff:{" "}
                    <span className="font-normal">
                      {user.is_staff ? "Yes" : "No"}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderPosts = () => (
    <div className="w-full max-w-4xl mx-auto p-4">
      {posts.length > 0 && (
        <ul className="flex flex-col gap-4 border border-gray-300 rounded-lg shadow-md p-4 bg-white">
          {posts.map((item, index) => (
            <li
              key={index}
              className="flex flex-col border border-gray-300 shadow-md p-4 rounded-lg mb-4 bg-gray-50"
            >
              <div className="mb-2 border-b border-gray-300 pb-2">
                <a
                  href={`/post/${item.id}`}
                  className="text-xl font-bold text-blue-600 hover:no-underline"
                >
                  {item.title}
                </a>
              </div>
              <div className="mb-2 text-gray-700">
                <p>{truncate(item.body)}</p>
              </div>
              <div className="flex flex-row justify-between items-center text-gray-600">
                <a
                  href={baseDir + item.document}
                  target="_blank"
                  className="text-blue-500"
                >
                  PDF
                </a>
                <p>{item.user.username}</p>
                <p>{item.category}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const truncate = (s: string) => {
    if (s.length > 200) {
      return s.substring(0, 200) + "...";
    } else {
      return s;
    }
  };

  const renderEditors = () => (
    <div className="w-[60%] overflow-y-auto p-2 mx-auto">
      {successEditors && (
        <ul className="flex flex-col gap-2 border border-transparent">
          {editorsInfo.map((editor, index) => (
            <li key={index} className="border bg-gray-500 p-2">
              <p>Editor Name: {editor.name}</p>
              <p>Email: {editor.email}</p>
              <p>Affiliation: {editor.affiliation || "N/A"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="mt-44">
      {(loadingUsers || loading) && <Loader />}
      <div className="flex flex-row">
        <div className="w-2/3">
          <div className="flex flex-col">
            <div className="flex justify-evenly my-3">
              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  activeTab === "users"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Users
              </button>
              <button
                onClick={() => setActiveTab("posts")}
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  activeTab === "posts"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setActiveTab("editors")}
                className={`px-4 py-2 rounded-md transition duration-300 ${
                  activeTab === "editors"
                    ? "bg-blue-500 text-white shadow-lg"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Editors
              </button>
            </div>
            {activeTab === "users" && renderUsers()}
            {activeTab === "posts" && renderPosts()}
            {activeTab === "editors" && renderEditors()}
          </div>
        </div>
        <div className="w-1/3">
          <News />
        </div>
      </div>
    </div>
  );
};
