import { useState } from 'react';

const DropdownInput = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState('');
    const options = ['Option 1', 'Option 2', 'Option 3'];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (option: string) => {
        setSelectedOption(option);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
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
                    V
                </button>
            </div>
            {isOpen && (
                <div className="origin-top-left absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none"
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
