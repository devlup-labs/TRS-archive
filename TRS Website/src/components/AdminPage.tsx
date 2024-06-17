import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import { getUsers, getEditors } from "../actions/userActions";
import { useNavigate } from "react-router-dom";
import { getCategoriesAction, listPosts } from "../actions/postActions";
import { News } from "./News";

export const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [cats, setCats] = useState([]);

  const userLogin = useSelector((state) => state.userLogin);
  const { authToken } = userLogin; // the person who logged in

  const getallUser = useSelector((state) => state.getallUser);
  const {
    loading: loadingUsers,
    usersInfo,
    success: successUsers,
  } = getallUser;

  const getallPosts = useSelector((state) => state.postlist);
  const { loading, posts, error } = getallPosts;

  const getallEditors = useSelector((state) => state.getallEditors);
  const {
    loading: loadingEditors,
    editorsInfo,
    success: successEditors,
  } = getallEditors;

  const getCategories = useSelector((state) => state.getCategories);
  const { loadingCat, successCat, categoriesInfo } = getCategories;

  useEffect(() => {
    if (!categoriesInfo) {
      dispatch(getCategoriesAction());
    } else {
      console.log(categoriesInfo);
      setCats(categoriesInfo.map((category) => category.name));
    }
  }, [dispatch, categoriesInfo]);

  useEffect(() => {
    if (!authToken) {
      navigate("/login");
      return;
    }
    if (authToken.roles !== "admin") {
      navigate("/");
      return;
    }
    if (activeTab === "users") {
      dispatch(getUsers());
    } else if (activeTab === "posts") {
      dispatch(listPosts());
    } else if (activeTab === "editors") {
      dispatch(getEditors());
    }
  }, [authToken, dispatch, navigate, activeTab]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRoleFilter = (e) => {
    setFilterRole(e.target.value);
  };

  const handleCategoryFilter = (e) => {
    setFilterCategory(e.target.value);
  };

  const renderUsers = () => {
    let filteredUsers = usersInfo;

    if (searchTerm) {
      filteredUsers = filteredUsers.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole) {
      filteredUsers = filteredUsers.filter(
        (user) => user.roles && user.roles.includes(filterRole)
      );
    }

    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        {successUsers && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <p className="text-xl font-semibold">Non Staff Users</p>
              <div className="flex flex-row items-center gap-4 mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder={`Search ${activeTab}`}
                  className="px-4 py-2 border border-gray-300 rounded-md flex-grow"
                />
                <select
                  value={filterRole}
                  onChange={handleRoleFilter}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">All Roles</option>
                  <option value="role1">Role 1</option>
                  <option value="role2">Role 2</option>
                  <option value="role3">Role 3</option>
                </select>
              </div>
              <ul className="flex flex-col gap-4 border border-gray-300 rounded-lg shadow-md p-4 bg-white">
                {filteredUsers.map((user, index) => (
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
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPosts = () => {
    let filteredPosts = posts;

    if (searchTerm) {
      filteredPosts = filteredPosts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      filteredPosts = filteredPosts.filter(
        (post) => post.category && post.category.includes(filterCategory)
      );
    }

    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        {filteredPosts.length > 0 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-4 mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder={`Search ${activeTab}`}
                className="px-4 py-2 border border-gray-300 rounded-md flex-grow"
              />
              <select
                value={filterCategory}
                onChange={handleCategoryFilter}
                className="px-4 py-2 border border-gray-300 rounded-md"
              >
                <option value="">All Categories</option>
                {cats.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <ul className="flex flex-col gap-4 border border-gray-300 rounded-lg shadow-md p-4 bg-white">
              {filteredPosts.map((item, index) => (
                <li
                  key={index}
                  className="flex flex-col border border-gray-300 shadow-md p-4 rounded-lg mb-4 bg-gray-50"
                >
                  <div className="mb-2 border-b border-gray-300 pb-2">
                    <a
                      href={`/post/:${item.id}`}
                      className="text-xl font-bold text-blue-600 hover:no-underline"
                    >
                      {item.title}
                    </a>
                  </div>
                  <div className="mb-2 text-gray-700">
                    <p>{truncate(item.body)}</p>
                  </div>
                  <div className="flex flex-row justify-between items-center text-gray-600">
                    <p>{item.status}</p>
                    <p>{item.user.username}</p>
                    <p>{item.category}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const truncate = (s) => {
    if (s.length > 200) {
      return s.substring(0, 200) + "...";
    } else {
      return s;
    }
  };

  const renderEditors = () => {
    let filteredEditors = editorsInfo;

    if (searchTerm) {
      filteredEditors = filteredEditors.filter((editor) =>
        editor.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        {successEditors && (
          <ul className="flex flex-col gap-4 border border-gray-300 rounded-lg shadow-md p-4 bg-white">
            {filteredEditors.map((editor, index) => (
              <li
                key={index}
                className="border-b border-gray-200 last:border-none pb-4 mb-4 last:pb-0 last:mb-0"
              >
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-semibold text-gray-800">
                    Editor Name:{" "}
                    <span className="font-normal">{editor.username}</span>
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    Email: <span className="font-normal">{editor.email}</span>
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    Affiliation:{" "}
                    <span className="font-normal">
                      {editor.affiliation || "N/A"}
                    </span>
                  </p>
                  <p className="text-lg font-semibold text-gray-800">
                    Is Staff:{" "}
                    <span className="font-normal">
                      {editor.is_staff ? "Yes" : "No"}
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

  return (
    <div className="mt-44">
      {(loadingUsers || loadingEditors || loading) && <Loader />}
      <div className="flex flex-row justify-between mx-auto items-center">
        <div className="w-3/4">
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
        <div className="w-[3/10] mx-auto">
          <News />
        </div>
      </div>
    </div>
  );
};
