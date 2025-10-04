import React from "react";
import { MdEdit } from "react-icons/md";
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";

const EditVendor = ({ id, callback }: { id: string; callback: any }) => {
  const router = useRouter();
  return (
    <IconButton
      className="bg-yellow-500 text-sm hover:bg-yellow-600 text-white"
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/vendor/edit/${id}`);
      }}
    >
      <MdEdit />
    </IconButton>
  );
};

export default EditVendor;
