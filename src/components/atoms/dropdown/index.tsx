import React, { useState, useEffect, useRef } from "react";

type DropdownProperties = {
  children: (handleClick: () => void, open: boolean) => React.ReactNode;
  activeCondition: boolean;
};

const Dropdown = ({ children, activeCondition }: DropdownProperties) => {
  const [open, setOpen] = useState(activeCondition);
  const dropdownRef = useRef(null);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      // @ts-ignore
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };

  // useEffect(() => {
  //   if (open) {
  //     document.addEventListener("click", handleOutsideClick);
  //   } else {
  //     document.removeEventListener("click", handleOutsideClick);
  //   }

  //   return () => {
  //     document.removeEventListener("click", handleOutsideClick);
  //   };
  // }, [open]);

  return (
    <li className="list-none" ref={dropdownRef}>
      {children(handleClick, open)}
    </li>
  );
};

export default Dropdown;
