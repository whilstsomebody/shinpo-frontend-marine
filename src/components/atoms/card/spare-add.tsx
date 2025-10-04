import React from "react";

type Props = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  loading?: boolean;
  handleFileDelete: (file: File) => void;
};

const AddSpareImage = ({
  onChange,
  label,
  loading,
  handleFileDelete,
}: Props) => {
  return (
    <label className="flex flex-col gap-2" htmlFor="upload">
      <div className="border-2 border-gray-400 h-36 w-full border-dotted flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex gap-2 items-center">
            <span>Loading...</span>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <span>Upload</span>
            <input
              id="upload"
              type="file"
              multiple
              className="hidden"
              onChange={onChange}
            />
          </div>
        )}
      </div>
    </label>
  );
};

export default AddSpareImage;
