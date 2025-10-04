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
  onChange: (
    type: "ALL" | "SPARES SUPPLY" | "SERVICES",
    status: "QUERYRECIEVED" | "ORDERCONFIRMED"
  ) => void;
}

const TopCompanyFilterFunction = ({ onChange }: BarFilterFunctionProps) => {
  const [type, setType] = useState<"ALL" | "SPARES SUPPLY" | "SERVICES">("ALL");
  const [status, setStatus] = useState<"QUERYRECIEVED" | "ORDERCONFIRMED">(
    "QUERYRECIEVED"
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const years = (() => {
    const startYear = 2024;
    const thisYear = new Date().getFullYear();
    return Array.from(
      { length: thisYear - startYear + 1 },
      (_, i) => startYear + i
    ).map(String);
  })();

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
                  e.target.value as "ALL" | "SPARES SUPPLY" | "SERVICES",
                  status
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
        <MenuItem>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography>Select Status</Typography>
            <Select
              size="small"
              value={status}
              onChange={(e) => {
                onChange(
                  type,
                  e.target.value as "QUERYRECIEVED" | "ORDERCONFIRMED"
                );
                setStatus(e.target.value as "QUERYRECIEVED" | "ORDERCONFIRMED");
              }}
            >
              <MenuItem value={"QUERYRECIEVED"}>Query Recieved</MenuItem>
              <MenuItem value={"ORDERCONFIRMED"}>Order Confirmed</MenuItem>
            </Select>
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

export default TopCompanyFilterFunction;
