import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Popover,
} from "@mui/material";
import { FaFilter } from "react-icons/fa6";
import { MdChevronRight } from "react-icons/md";
import Dropdown from "@/components/atoms/dropdown";

const data = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "Sales",
      data: [3, 2, 2, 1, 5, 4, 7],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

const filters = [
  { label: "Select Timeline", value: "timeline" },
  { label: "Select Coordinator", value: "coordinator" },
];

export default function LineChart() {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handlePopoverClose = () => {
    setPopoverOpen(false);
  };

  const togglePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  return (
    <Card>
      <CardHeader
        title="Order Conversion"
        action={
          <Dropdown activeCondition={false}>
            {(handleClick, open) => (
              <div className="relative">
                <IconButton onClick={handleClick}>
                  <FaFilter />
                </IconButton>
                {open && (
                  <div className="absolute top-10 right-0 bg-white shadow-md p-4 min-w-[300px] flex flex-col gap-3">
                    {filters.map((el) => (
                      <div
                        key={el.value}
                        className="text-xl font-semibold flex justify-between items-center cursor-pointer hover:text-blue-500 transition-all duration-300 ease-in-out"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePopover();
                        }}
                      >
                        {el.label}
                        <MdChevronRight />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Dropdown>
        }
      />
      <CardContent>
        <Line data={data} options={options} height={400} />
      </CardContent>
      <Popover
        open={popoverOpen}
        anchorReference="anchorPosition"
        anchorPosition={{ top: 200, left: 800 }}
        onClose={handlePopoverClose}
      >
        <div className="bg-white shadow-md p-4 min-w-[300px] flex flex-col gap-3">
          {filters.map((el) => (
            <div
              key={el.value}
              className="text-xl font-semibold flex justify-between items-center cursor-pointer hover:text-blue-500 transition-all duration-300 ease-in-out"
            >
              {el.label}
              <MdChevronRight />
            </div>
          ))}
        </div>
      </Popover>
    </Card>
  );
}
