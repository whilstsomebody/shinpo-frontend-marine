import React from "react";
import { Bar } from "react-chartjs-2";
import { ChartOptions } from "chart.js/auto";
import { Card, CardContent, CardHeader, CardActions, Box } from "@mui/material";
import BarFilterFunction from "./filters";

interface Dataset {
  label: string;
  data: number[];
}

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

const options: ChartOptions<"bar"> = {
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
  responsive: true,
};

export default function BarChart({
  data,
  title,
  onChange,
}: {
  data: ChartData;
  title: string;
  onChange: (year: string, userId: number) => void;
}) {
  return (
    <Card
      sx={{
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <CardHeader title={title} />
        <CardActions>
          <BarFilterFunction onChange={onChange} />
        </CardActions>
      </Box>
      <CardContent>
        <Bar data={data} options={options} height={100} />
      </CardContent>
    </Card>
  );
}
