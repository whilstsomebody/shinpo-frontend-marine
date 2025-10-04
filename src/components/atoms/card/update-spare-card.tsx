import { Box, IconButton } from "@mui/material";
import React from "react";
import { IoPencil } from "react-icons/io5";
import { FaBoxOpen } from "react-icons/fa";

interface UpdateSpareCardProps {
  name: string;
  description: string;
  quantity: number;
  onEdit: () => void;
}

const UpdateSpareCard: React.FC<UpdateSpareCardProps> = ({
  name,
  description,
  quantity,
  onEdit,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <FaBoxOpen />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <p>{name}</p>
          <p>{description}</p>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <p>{quantity}</p>
        <IconButton
          onClick={onEdit}
          size="small"
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          <IoPencil />
        </IconButton>
      </Box>
    </Box>
  );
};

export default UpdateSpareCard;
