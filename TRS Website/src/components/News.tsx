import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNewsFromBackend } from "../actions/newsActions";
import Loader from "./Loader";

export const News = () => {
  const dispatch = useDispatch();
  const getNews = useSelector((state) => state.getNews);
  const { loading, success, newsInfo } = getNews;

  useEffect(() => {
    console.log("news");
    dispatch(getNewsFromBackend());
  }, [dispatch]);
  return (
    <div className="mt-48">
      {loading && <Loader />}
      {success && JSON.stringify(newsInfo)}
    </div>
  );
};
