import { mainPageData } from "../constants";
import { useSearch } from "../context/SearchContext";

export const Home = () => {
  const { searchQuery } = useSearch();
  const data = mainPageData;
  const filtered = data.filter((item) => item.topic.includes(searchQuery));
  const verified = localStorage.getItem("verified");

  return (
    <div className="relative flex flex-row top-40 overflow-y-visible p-4 w-full">
      <ul className="w-1/2">
        {filtered.map((item, index) => (
          <li key={index} className="flex flex-col w-1/2">
            <div className="mb-2">
              <strong>{item.paperName}</strong>
            </div>
            <div className="flex flex-row justify-between">
              <a
                href={item.link}
                target="_blank"
                onClick={() => console.log(`Clicked ${index} link`)}
              >
                Link
              </a>
              <p>{item.topic}</p>
            </div>
          </li>
        ))}
      </ul>
      <div>{verified == "true" ? <a href="/Upload">Upload</a> : <></>}</div>
    </div>
  );
};
