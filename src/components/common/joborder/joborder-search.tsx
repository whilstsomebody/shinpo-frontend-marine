import { TextField } from "@mui/material";
import clsx from "clsx";
import React from "react";
import { FiSearch } from "react-icons/fi";

interface SearchJobOrderProperties {
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchJobOrderProperties> = ({
  className,
  placeholder,
  onChange,
}) => {
  return (
    <div className={clsx("flex w-full", className)}>
      <TextField
        placeholder={placeholder}
        className="rounded-none flex-1 focus:border-transparent focus:ring-0 focus:outline-transparent"
        onChange={onChange}
      />
      <button className="bg-yellow-500 text-white p-2 px-4">
        <FiSearch />
      </button>
    </div>
  );
};

export default SearchInput;
