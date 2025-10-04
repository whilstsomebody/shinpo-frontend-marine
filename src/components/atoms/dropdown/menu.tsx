import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { BsThreeDotsVertical } from "react-icons/bs";

interface Props {
  options: {
    icon: React.ReactNode;
    name: string;
    onClick: (params: any) => void;
  }[];
  params: any;
}

export default function LongMenu({ options, params }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <BsThreeDotsVertical />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
              option.onClick(params);
            }}
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
