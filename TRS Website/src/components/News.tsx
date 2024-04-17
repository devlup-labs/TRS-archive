import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNewsFromBackend } from "../actions/newsActions";
import Loader from "./Loader";

const RotateItems = ({ items }) => {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [displayedItem, setDisplayedItem] = useState(items[currentItemIndex]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentItemIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000); // Change item every 5 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, [items]);

  useEffect(() => {
    setDisplayedItem(items[currentItemIndex]);

    const timeoutId = setTimeout(() => {
      setDisplayedItem(null);
    }, 5000); // Display item for 5 seconds

    return () => clearTimeout(timeoutId); // Clear timeout on component unmount
  }, [currentItemIndex, items]);

  return (
    <div className="bg-black text-white border border-black p-2">
      {displayedItem && (
        <>
          <div>
            <h2>Title: {displayedItem.title}</h2>
            <p>Description: {displayedItem.description}</p>
            <img
              src={displayedItem.image}
              alt={displayedItem.title}
              style={{ maxWidth: "40%", height: "auto" }}
            />
          </div>
          <div className="text-right text-white text-sm">
            {currentItemIndex + 1}/{items.length}
          </div>
        </>
      )}
    </div>
  );
};

export const News = () => {
  const dispatch = useDispatch();
  const getNews = useSelector((state) => state.getNews);
  const { loading, success, newsInfo } = getNews;

  useEffect(() => {
    dispatch(getNewsFromBackend());
  }, [dispatch]);

  return (
    <div className="w-[40%]">
      <h1 className="text-2xl">News:</h1>
      {loading && <Loader />}
      {success && (
        <>
          <RotateItems items={newsInfo} />
          {/* You can also display the newsInfo as JSON below the rotating items if needed */}
        </>
      )}
    </div>
  );
};
