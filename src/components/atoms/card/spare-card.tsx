import { IconButton } from "@mui/material";
import React from "react";
import { BiPencil } from "react-icons/bi";
import { FaBoxOpen } from "react-icons/fa";
import { MdDelete, MdAdd } from "react-icons/md";

interface SpareCardProps {
  title?: string;
  description?: string;
  quantity?: number | string | null;
  quantityUnit?: string;
  disableActions?: boolean;
  onSpareDelete: () => void;
  onSpareAdd: () => void;
  onSpareEdit: () => void;
}

const SpareCard: React.FC<SpareCardProps> = (props) => {
  return (
    <div className="rounded-md w-full shadow-md p-4 bg-[#e66c21] flex items-center justify-between">
      <div className="flex items-center">
        <FaBoxOpen className="text-4xl text-white" />
        <div className="flex flex-col ml-4">
          <h3 className="text-white text-xl">{props.title}</h3>
          <p className="text-white text-sm line-clamp-2">{props.description}</p>
          <p className="text-gray-200 mt-1 text-sm">
            Quantity: {props.quantity} {props.quantityUnit}
          </p>
        </div>
      </div>
      {!props.disableActions && (
        <div className="flex gap-1">
          <IconButton
            className="text-white"
            size="small"
            onClick={props.onSpareDelete}
          >
            <MdDelete />
          </IconButton>
          <IconButton
            className="text-white"
            size="small"
            onClick={props.onSpareEdit}
          >
            <BiPencil />
          </IconButton>
          <IconButton
            className="text-white"
            size="small"
            onClick={props.onSpareAdd}
          >
            <MdAdd />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default SpareCard;
