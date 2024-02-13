import { useState } from "react";

const Search = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Hello");
  };
  const [query, setQuery] = useState("");
  return (
    <form onSubmit={handleSubmit} className="w-[90%] mb-2">
      <label className="text-green-500 block m-2 mb-0">
        Search by Keywords:
      </label>
      <input
        type="text"
        className="p-2 m-2 mt-0 border-none rounded-md focus:outline-none ring-2 w-[35%] ring-green-500 transition-colors"
        required
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Query"
      />
      <button
        type="submit"
        className=" bg-green-500 hover:bg-green-600 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        Submit
      </button>
    </form>
  );
};

export default Search;
