import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { dropOptions } from "../constants";
import { useSearch } from "../context/SearchContext";

const DropdownInput = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const options = dropOptions;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { updateSearchQuery } = useSearch();
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
    setIsOpen(false);
    updateSearchQuery(option);
  };

  return (
    <div className="relative inline-block text-left text-sky-950">
      <div className="flex">
        <input
          type="text"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          onClick={toggleDropdown}
          className="border border-black focus:outline-none focus:border-blue-300 w-48"
          placeholder="Select an option"
        />
        <button
          onClick={toggleDropdown}
          className="absolute inset-y-0 right-0 flex items-center px-2  focus:outline-none"
        >
          <FaCaretDown />
        </button>
      </div>
      {isOpen && (
        <div className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-red-700 hover:bg-gray-100 hover:border-b-[2px] hover:border-b-gray-900 focus:outline-none"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownInput;
