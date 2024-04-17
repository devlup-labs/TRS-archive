import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { useEffect, useState } from "react";
import { getUsers } from "../actions/userActions";
import { useNavigate } from "react-router-dom";
import { News } from "./News";

export const AdminPage = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.userLogin);
  const { authToken } = userLogin; //the person who logged in
  const getallUser = useSelector((state) => state.getallUser);
  const { loading, usersInfo, success } = getallUser;
  const navigate = useNavigate();
  useEffect(() => {
    if (!authToken) {
      navigate("/login");
    } else {
      if (authToken.is_staff) {
        dispatch(getUsers());
      } else {
        navigate("/");
      }
    }
  }, [authToken, dispatch, navigate]);
  return (
    <div className="mt-44">
      {loading && <Loader />}
      <div className="flex flex-row">
        {success && (
          <div className="w-[60%] overflow-y-auto p-2">
            <ul className="flex flex-col gap-2 border border-transparent">
              {usersInfo.map((user, index) => (
                <li key={index} className="border bg-gray-500 p-2">
                  <p>Username: {user.username}</p>
                  <p>Email: {user.email}</p>
                  <p>Affiliation: {user.affiliation || "N/A"}</p>
                  <p>Is Staff: {user.is_staff ? "Yes" : "No"} </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <News />
      </div>
    </div>
  );
};
