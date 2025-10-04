import React from "react";
import { IoMdCloudUpload } from "react-icons/io";
import { FaFile } from "react-icons/fa";
import { Button } from "@mui/material";
import { ClipLoader } from "react-spinners";

interface Props {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  loading?: boolean;
  file?: File | null;
  handleRemove: () => void;
  fileData: any;
  id: string;
}

const FormInputFile = ({
  onChange,
  id,
  fileData,
  label,
  loading,
  file,
  handleRemove,
}: Props) => {
  return (
    <label className="flex flex-col gap-2" htmlFor={id}>
      <div className="border-2 border-gray-400 cursor-pointer h-36 w-full border-dotted flex flex-col items-center justify-center">
        {loading ? (
          <div className="absolute bg-white bg-opacity-50 h-full w-full flex items-center justify-center">
            <ClipLoader color="#017EFA" loading={loading} size={50} />
          </div>
        ) : !file && !fileData ? (
          <>
            <IoMdCloudUpload className="text-3xl" />
            <p className="text-sm">{label}</p>
            <input
              className="sr-only"
              type="file"
              id={id}
              onChange={onChange}
            />
          </>
        ) : (
          <>
            <FaFile className="text-3xl text-[#ff0000]" />
            <p className="text-sm">{(file ? file : fileData[0]).name}</p>
            <div className="flex mt-2 gap-4 items-center">
              <Button
                variant="contained"
                color="primary"
                className="bg-primary-bright-blue"
                onClick={() => {
                  window.open(fileData[0].url, "_blank");
                }}
              >
                View
              </Button>
              <Button
                variant="contained"
                color="error"
                className="bg-red-500"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemove();
                }}
              >
                Remove
              </Button>
            </div>
          </>
        )}
      </div>
    </label>
  );
};

export default FormInputFile;
