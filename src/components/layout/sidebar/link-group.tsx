import React, { useState } from "react";

type DashboardSidebarLinkGroupProperties = {
  children: (handleClick: () => void, open: boolean) => React.ReactNode;
  activeCondition: boolean;
};

const DashboardSidebarLinkGroup = ({
  children,
  activeCondition,
}: DashboardSidebarLinkGroupProperties) => {
  const [open, setOpen] = useState(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return <li className="list-none">{children(handleClick, open)}</li>;
};

export default DashboardSidebarLinkGroup;
