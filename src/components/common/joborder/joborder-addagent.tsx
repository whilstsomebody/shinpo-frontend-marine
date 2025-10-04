import React from "react";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IconButton } from "@mui/material";

const AddAgent = () => {
  return (
    <IconButton aria-label="add" size="medium" className="hover:bg-transparent">
      <IoIosAddCircleOutline />
    </IconButton>
  );
};

export default AddAgent;
