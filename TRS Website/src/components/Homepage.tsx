import { mainPageData } from "../constants";
import { useSearch } from "../context/SearchContext";
import Search from "./Search";

export const Home = () => {
  const { searchQuery } = useSearch();
  const data = mainPageData;
  const filtered = data.filter((item) => item.topic.includes(searchQuery));
  const verified = localStorage.getItem("verified");
  const trunctate = (s: string) => {
    if (s.length > 200) {
      return s.substring(0, 200) + "...";
    } else {
      return s;
    }
  };
  return (
    <div className="relative flex flex-col top-40 overflow-y-visible p-4 w-full">
      <Search />
      <div className="flex flex-row">
        <ul className="w-1/2">
          {filtered.map((item, index) => (
            <li
              key={index}
              className="flex flex-col w-[90%] border border-black shadow-md p-2 rounded-md mb-2 shadow-red-500"
            >
              <div className="mb-2 border-b border-b-black">
                <strong>{item.paperName}</strong>
              </div>
              <div className="mb-2">
                <p>{trunctate(item.body)}</p>
              </div>
              <div className="flex flex-row justify-between">
                <a
                  href={item.link}
                  target="_blank"
                  onClick={() => console.log(`Clicked ${index} link`)}
                >
                  PDF
                </a>
                <p>{item.authorName}</p>
                <p>{item.topic}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="items-center">
          {verified == "true" ? <a href="/Upload">Upload</a> : <></>}
        </div>
      </div>
    </div>
  );
};
