import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardActions } from "@mui/material";
import clsx from "clsx";
import { ChartOptions } from "chart.js";
import TopCompanyFilterFunction from "./filters";
import SupplierFilterFunction from "./supplier-filter";

interface Dataset {
  label: string;
  data: number[];
}

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

const options: ChartOptions<"pie"> = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export default function SupplierPieChart({
  className,
  data,
  title,
  onChange,
}: {
  className?: string;
  data: ChartData;
  title: string;
  onChange: (type: "ALL" | "SPARES SUPPLY" | "SERVICES") => void;
}) {
  return (
    <Card className={clsx(className)}>
      <CardHeader
        title={title}
        action={
          <CardActions>
            <SupplierFilterFunction onChange={onChange} />
          </CardActions>
        }
      />
      <CardContent>
        <Pie data={data} options={options} />
      </CardContent>
    </Card>
  );
}
