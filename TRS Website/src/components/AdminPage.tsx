import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { useEffect } from "react";
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
    console.log("Called");
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
    <div className="mt-48">
      {loading && <Loader />}
      <div>{success && JSON.stringify(usersInfo)}</div>
      <div>Hello</div>
      <News />
    </div>
  );
};
