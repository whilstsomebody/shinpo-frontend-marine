import React, { useContext, useState } from "react";
import DashboardLayout from "@/components/layout";
import AuthContext from "@/context/AuthContext";
import clsx from "clsx";
import BarChart from "@/components/charts/bar/service-cordinators";
import useStats from "@/hooks/useStats";
import PieChart from "@/components/charts/pie/top-companies";
import useCompanyStats from "@/hooks/useCompanyStats";
import { Truculenta } from "next/font/google";
import useSupplierStats from "@/hooks/useSupplierStats";
import Head from "next/head";
import SupplierPieChart from "@/components/charts/pie/supplier";

const truculenta = Truculenta({ subsets: ["latin-ext"] });

export default function HomePage() {
  const { user } = useContext(AuthContext);

  const [barFilters, setBarFilters] = useState<{
    startDate: string;
    endDate: string;
    userId: number | null;
  }>({
    startDate: new Date("2024-01-01").toISOString(),
    endDate: new Date("2024-12-31").toISOString(),
    userId: 0,
  });

  const [pieFilters, setPieFilters] = useState<{
    type: "SERVICES" | "SPARES SUPPLY" | "ALL";
    status: "QUERYRECIEVED" | "ORDERCONFIRMED";
  }>({
    type: "ALL",
    status: "QUERYRECIEVED",
  });

  const [supplierFilters, setSupplierFilters] = useState<{
    type: "SERVICES" | "SPARES SUPPLY" | "ALL";
  }>({
    type: "ALL",
  });

  const { stats, loading } = useStats({
    startDate: barFilters.startDate,
    endDate: barFilters.endDate,
    all: barFilters.userId === 0,
    userId: barFilters.userId ?? undefined,
  });

  const { stats: companyStats, loading: companyLoading } = useCompanyStats({
    type: pieFilters.type,
    status: pieFilters.status,
  });

  const { stats: supplierStats, loading: supplierLoading } = useSupplierStats({
    type: supplierFilters.type,
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const time = new Date().getHours();
  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Home Page" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <DashboardLayout header sidebar>
        <h1
          className={clsx("font-semibold text-2xl", truculenta.className)}
        >{`Good ${
          time < 12 ? "Morning" : time < 18 ? "Afternoon" : "Evening"
        }, ${user?.fullname.split(" ")[0]}`}</h1>
        <div className="mt-8">
          {loading || companyLoading || supplierLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex flex-col gap-8">
              <BarChart
                data={{
                  labels: months,
                  datasets: [
                    {
                      label: "Order Created",
                      data: [
                        0,
                        ...Object.keys(stats.aggregate).map(
                          (key) => stats.aggregate[key].created
                        ),
                      ],
                    },
                    {
                      label: "Order Quoted",
                      data: [
                        0,
                        ...Object.keys(stats.aggregate).map(
                          (key) => stats.aggregate[key].quoted
                        ),
                      ],
                    },
                    {
                      label: "Order Confirmed",
                      data: [
                        0,
                        ...Object.keys(stats.aggregate).map(
                          (key) => stats.aggregate[key].confirmed
                        ),
                      ],
                    },
                  ],
                }}
                title="Stats for Service Coordinators"
                onChange={(year, userId) => {
                  setBarFilters({
                    ...barFilters,
                    startDate: new Date(`${year}-01-01`).toISOString(),
                    endDate: new Date(`${year}-12-31`).toISOString(),
                    userId,
                  });
                }}
              />
              <div className="grid grid-cols-2 gap-8">
                <PieChart
                  title="Top 5 Companies"
                  data={{
                    labels: companyStats?.map((stat) => stat.name) ?? [],
                    datasets: [
                      {
                        label: "Job Count",
                        data: companyStats?.map((stat) => stat.job_count) ?? [],
                      },
                    ],
                  }}
                  onChange={(type, status) => {
                    setPieFilters({ type, status });
                  }}
                />
                <SupplierPieChart
                  title="Top 5 Suppliers"
                  data={{
                    labels: supplierStats?.map((stat) => stat.name) ?? [],
                    datasets: [
                      {
                        label: "Job Count",
                        data: supplierStats?.map((stat) => stat.num_jobs) ?? [],
                      },
                    ],
                  }}
                  onChange={(type) => {
                    setSupplierFilters({ type });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </>
  );
}
