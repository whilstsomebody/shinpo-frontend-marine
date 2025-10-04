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
  onChange: (year: string, userId: number) => void;
}

interface User {
  id: number;
  name: string;
}

const BarFilterFunction = ({ onChange }: BarFilterFunctionProps) => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [userId, setUserId] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const users: User[] = [
    { id: 0, name: "All" },
    { id: 5, name: "Pradeep Gupta" },
    { id: 13, name: "Ian Dominic" },
    { id: 7, name: "Vinoth" },
    { id: 6, name: "Sachin Sharma" },
  ];
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
            <Typography>Select User</Typography>
            <Select
              size="small"
              value={userId}
              onChange={(e) => {
                onChange(year, Number(e.target.value));
                setUserId(Number(e.target.value));
              }}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography>Select Year</Typography>
            <Select
              size="small"
              value={year}
              onChange={(e) => {
                onChange(e.target.value, userId);
                setYear(e.target.value);
              }}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </Box>
        </MenuItem>
      </Menu>
    </>
  );
};

export default BarFilterFunction;
