import { FaSearch } from "react-icons/fa";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = "Tìm kiếm..." }: SearchInputProps) {
  return (
    <div className="flex items-center border rounded-xl px-3 py-2 shadow-sm w-full max-w-md bg-white justify-center">
      <FaSearch className="text-gray-500 mr-2" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="outline-none w-full text-sm"
      />
    </div>
  );
}
