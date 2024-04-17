import { useState } from "react";
import { FaCaretDown } from "react-icons/fa";

const DropdownInput = ({ options, onOptionSelect, style, b_bar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onOptionSelect(option); // Callback to parent component
  };
  const fin_style =
    "relative inline-block text-left text-sky-950 z-10" + style;
  return (
    <div className={fin_style}>
      <div className="flex h-full w-full bg-gray-800">
        <input
          type="text"
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          onClick={toggleDropdown}
          className="border border-black focus:outline-none focus:border-blue-300 p-2 h-full w-full"
          placeholder="Select an option"
        />
        {b_bar && (
          <div className="absolute w-full left-0 bottom-0 h-1 bg-green-700 transition-colors"></div>
        )}
        <button
          onClick={toggleDropdown}
          className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
        >
          <FaCaretDown />
        </button>
      </div>
      {isOpen && (
        <div className="origin-top-left absolute left-0 top-full w-full rounded-md shadow-lg bg-inherit ring-1 ring-black ring-opacity-5 z-30 transform translate-y-1">
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
