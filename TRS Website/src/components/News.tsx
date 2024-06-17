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
    <div className="w-full h-full flex items-center justify-center bg-black text-white border border-black p-2">
      {displayedItem && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center w-[3/4] p-4 ">
            <h2 className="text-xl mb-2">Title: {displayedItem.title}</h2>
            <p className="mb-4">Description: {displayedItem.description}</p>
            <img
              src={displayedItem.image}
              alt={displayedItem.title}
              className="w-92 h-auto object-cover"
            />
          </div>
          <div className="text-right text-white text-sm mt-2">
            {currentItemIndex + 1}/{items.length}
          </div>
        </div>
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
    <div className="w-1/2 h-1/2 flex items-center justify-center max-w-[375px]">
      <div className="w-full h-full border border-gray-300">
        <h1 className="text-2xl my-2 text-center font-semibold">News</h1>
        {loading && <Loader />}
        {success && <RotateItems items={newsInfo} />}
      </div>
    </div>
  );
};
