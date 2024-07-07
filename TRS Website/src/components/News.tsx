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
    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white border border-gray-700 p-4 rounded-md shadow-md">
      {displayedItem && (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center w-full p-4 space-y-4">
            <h2 className="text-2xl font-bold">{displayedItem.title}</h2>
            <p className="text-lg">{displayedItem.description}
              {displayedItem.url && (
                <a
                  href={displayedItem.url}
                  className="text-blue-500 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read More...
                </a>
              )}
            </p>
           
            <img
              src={displayedItem.image}
              alt={displayedItem.title}
              className="w-full h-auto max-h-64 object-cover rounded-md"
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
    <div className="w-full max-w-lg mx-auto my-8">
      <div className="w-full h-full border border-gray-300 p-4 rounded-md shadow-md bg-white">
        <h1 className="text-3xl mb-4 text-center font-semibold">News</h1>
        {loading && <Loader />}
        {success && <RotateItems items={newsInfo} />}
      </div>
    </div>
  );
};
