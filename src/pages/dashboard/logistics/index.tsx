import DashboardLayout from "@/components/layout";
import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const LogisticsDashboard = () => {
  const [filters, setFilters] = React.useState({
    status: "QUERYRECEIVED",
  });
  const handleFilter = (
    event: React.MouseEvent<HTMLElement>,
    newFilters: any
  ) => {
    setFilters({ ...filters, status: newFilters });
  };
  return (
    <DashboardLayout header sidebar>
      <ToggleButtonGroup
        sx={{ mb: 2 }}
        color="primary"
        value={filters.status}
        exclusive
        onChange={handleFilter}
      >
        <ToggleButton value="QUERYRECEIVED">Logistics Query</ToggleButton>
        <ToggleButton value="RFQSENT">RFQ Sent</ToggleButton>
        <ToggleButton value="RFQSENT">Quotes Recieved</ToggleButton>
        <ToggleButton value="RFQSENT">Order Placed</ToggleButton>
        <ToggleButton value="RFQSENT">Logistics Completed</ToggleButton>
      </ToggleButtonGroup>
    </DashboardLayout>
  );
};

export default LogisticsDashboard;
