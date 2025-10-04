import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import React, { useCallback, useState } from "react";

interface Props {
  data: any[];
  callback: (status: JobType["status"][]) => void;
}

const Tabs: React.FC<Props> = ({ callback, data }) => {
  const getCounts = useCallback(() => {
    const counts = {
      query: 0,
      quoted: 0,
      order: 0,
      completed: 0,
    };
    data.forEach((item) => {
      if (item.status === "QUERYRECEIVED") {
        counts.query++;
      } else if (item.status === "QUOTEDTOCLIENT") {
        counts.quoted++;
      } else if (item.status === "ORDERCONFIRMED") {
        counts.order++;
      } else if (item.status === "INVOICEAWAITED") {
        counts.completed++;
      }
    });
    return counts;
  }, [data]);

  const counts = getCounts();

  const [statuses, setStatuses] = useState<JobType["status"][]>([]);

  const handleStatusSelection = (
    event: React.MouseEvent<HTMLElement>,
    newStatuses: JobType["status"][]
  ) => {
    setStatuses(() => {
      callback(newStatuses);
      return newStatuses;
    });
  };

  const buttons: { name: string; value: JobType["status"]; count: number }[] = [
    {
      name: "Query",
      value: "QUERYRECEIVED",
      count: counts.query,
    },
    {
      name: "Quoted",
      value: "QUOTEDTOCLIENT",
      count: counts.quoted,
    },
    {
      name: "Order Confirmed",
      value: "ORDERCONFIRMED",
      count: counts.order,
    },
    {
      name: "Job Completed",
      value: "INVOICEAWAITED",
      count: counts.completed,
    },
  ];
  return (
    <ToggleButtonGroup
      value={statuses}
      onChange={handleStatusSelection}
      aria-label="status selection"
    >
      {buttons.map(({ count, name, value }) => (
        <ToggleButton value={value} key={value} color="primary">
          {`${name} (${count})`}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default Tabs;
