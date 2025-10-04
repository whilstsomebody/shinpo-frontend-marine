import React, { useState, MouseEvent } from "react";
import {
  Menu,
  MenuItem,
  IconButton,
  Select,
  Box,
  Typography,
} from "@mui/material";
import { FaFilter } from "react-icons/fa";

interface BarFilterFunctionProps {
  onChange: (type: "ALL" | "SPARES SUPPLY" | "SERVICES") => void;
}

const SupplierFilterFunction = ({ onChange }: BarFilterFunctionProps) => {
  const [type, setType] = useState<"ALL" | "SPARES SUPPLY" | "SERVICES">("ALL");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <FaFilter />
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <Typography
          variant="h6"
          sx={{
            p: 2,
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          Filter Options
        </Typography>
        <MenuItem>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography>Select Type</Typography>
            <Select
              size="small"
              value={type}
              onChange={(e) => {
                onChange(
                  e.target.value as "ALL" | "SPARES SUPPLY" | "SERVICES"
                );
                setType(e.target.value as "ALL" | "SPARES SUPPLY" | "SERVICES");
              }}
            >
              <MenuItem value={"ALL"}>All</MenuItem>
              <MenuItem value={"SPARES SUPPLY"}>Spares Supply</MenuItem>
              <MenuItem value={"SERVICES"}>Services</MenuItem>
            </Select>
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

export default SupplierFilterFunction;
