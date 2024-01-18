import { mainPageData } from "../constants";
import { useSearch } from "../context/SearchContext";

export const Home = () => {
  const { searchQuery } = useSearch();
  const data = mainPageData;
  const filtered = data.filter((item) => item.topic.includes(searchQuery));
  return (
    <div className="relative top-40 overflow-y-visible -z-10 p-4">
      <ul>
        {filtered.map((item, index) => (
          <li key={index} className="flex flex-col w-1/2">
            <div className="mb-2">
              <strong>{item.paperName}</strong>
            </div>
            <div className="flex flex-row justify-between">
              <p>{item.paperName}</p>
              <a href={item.link}>{item.link}</a>
              <p>{item.topic}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
