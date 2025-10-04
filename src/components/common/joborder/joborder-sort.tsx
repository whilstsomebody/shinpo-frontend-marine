import React, { useState } from "react";
import FilterForm from "./form/filter";
import { IoFilter } from "react-icons/io5";
import { IoMdDownload } from "react-icons/io";
import { IoMdPrint } from "react-icons/io";

interface Props {
  setFilters: React.Dispatch<React.SetStateAction<FilterType>>;
  onDownload?: () => void;
  onPrint?: () => void;
}

const Filters: React.FC<Props> = ({ onDownload, setFilters, onPrint }) => {
  const [filters, showFilters] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <button
            className="flex border gap-1 items-center px-2 py-1 hover:bg-gray-200 rounded-md w-max"
            onClick={() => showFilters(!filters)}
          >
            <IoFilter />
            Filters
          </button>
        </div>
        <div className="flex gap-3">
          <button
            className="flex border gap-1 items-center px-2 py-1 hover:bg-gray-200 rounded-md w-max"
            onClick={() => onDownload && onDownload()}
          >
            <IoMdDownload />
          </button>
          <button
            className="flex border gap-1 items-center px-2 py-1 hover:bg-gray-200 rounded-md w-max"
            onClick={() => onPrint && onPrint()}
          >
            <IoMdPrint />
          </button>
        </div>
      </div>
      {filters && <FilterForm setFilters={setFilters} />}
    </div>
  );
};

export default Filters;
