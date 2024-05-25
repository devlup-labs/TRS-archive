import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getUnAssignedPosts } from "../actions/postActions";
import { News } from "./News";
import { useNavigate } from "react-router-dom";

export const EditorPage = () => {
  const unassignedPosts = useSelector((state) => state.unassignedPosts);
  const { loading, success, posts, error } = unassignedPosts;
  const userLogin = useSelector((state) => state.userLogin);
  const { authToken } = userLogin; //the person who logged in
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("authTokens");
    if (authToken && authToken.user.is_staff) {
      dispatch(getUnAssignedPosts());
    } else if (authToken) {
      Swal.fire({
        title: "You are not allowed to use this page",
        icon: "error",
        toast: true,
        timer: 3000,
        position: "top-right",
        timerProgressBar: true,
        showConfirmButton: false,
      });
      navigate("/");
    } else {
      navigate("/login");
    }
  });
  if (loading) {
    return <div className="mt-48 text-4xl">Loading...</div>;
  }
  return (
    <div className="mt-48">
      <div className="flex flex-row w-[90%] mx-auto">
        <div className="w-1/2 mx-auto flex flex-col">
          {success && (
            <ul className="w-[90%] mx-auto">
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
                <li className="text-center text-4xl">
                  No posts assigned to you
                </li>
              )}
            </ul>
          )}
        </div>
        <News />
      </div>
    </div>
  );
};
