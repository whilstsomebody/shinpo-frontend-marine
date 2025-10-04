import Head from "next/head";
import DashboardLayout from "@/components/layout";
import React, { useContext, useEffect, useState } from "react";
import { mainTabs, subTabs } from "@/data/sales";
import { MdAdd } from "react-icons/md";
import { BiPencil } from "react-icons/bi";
import Filters from "@/components/common/joborder/joborder-sort";
import JobOrderForm from "../../../components/common/joborder/joborder-form";
import Search from "../../../components/common/joborder/joborder-search";
import AuthContext from "@/context/AuthContext";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import useSalesTable from "@/hooks/sales-table";
import {
  Box,
  Modal,
  ToggleButtonGroup,
  ToggleButton,
  IconButton,
} from "@mui/material";
import { useRouter } from "next/router";
import { IoMdEye } from "react-icons/io";
import LongMenu from "@/components/atoms/dropdown/menu";
import JobOrderView from "@/components/common/joborder/joborder-view";
import FlagForm from "@/components/common/joborder/form/flag";
import QuotationForm from "@/components/common/joborder/form/quote";
import downloadTable from "@/utils/download-table";

export default function SalesDashboard() {
  const [modal, setModal] = useState<
    "create" | "edit" | "view" | "flag" | "quote" | null
  >(null);
  const [job, setJob] = useState<JobType | null>();
  const [maintab, setMainTab] = useState("live");
  const [subtab, setSubTab] = useState("");
  const { user } = useContext(AuthContext);
  const [filters, setFilters] = useState<FilterType>({
    queriedFrom: null,
    status: ["QUERYRECEIVED", "QUOTEDTOCLIENT", "ORDERCONFIRMED"],
    search: "",
    queriedUpto: null,
    quotedFrom: null,
    quotedUpto: null,
    type: null,
    assignedTo: null,
    jobClosedStatus: {
      $null: true,
    },
  });

  const [downloadSubroutine, setDownloadSubroutine] = useState<any>(null);

  useEffect(() => {
    if (maintab === "live") {
      setFilters((f) => ({
        ...f,
        status: ["QUERYRECEIVED", "QUOTEDTOCLIENT", "ORDERCONFIRMED"],
        jobClosedStatus: {
          $null: true,
        },
      }));
    } else if (maintab === "cancelled") {
      setFilters((filters) => ({
        ...filters,
        status: null,
        jobClosedStatus: "JOBCANCELLED",
      }));
    } else if (maintab === "history") {
      setFilters((filters) => ({
        ...filters,
        status: null,
        jobClosedStatus: "JOBCOMPLETED",
      }));
    }
  }, [maintab]);

  useEffect(() => {
    if (subtab === null) {
      setFilters((filters) => ({
        ...filters,
        status: ["QUERYRECEIVED", "QUOTEDTOCLIENT", "ORDERCONFIRMED"],
      }));
    } else if (subtab === "queryreceived") {
      setFilters((filters) => ({
        ...filters,
        status: "QUERYRECEIVED",
      }));
    } else if (subtab === "quotedtoclient") {
      setFilters((filters) => ({
        ...filters,
        status: "QUOTEDTOCLIENT",
      }));
    } else if (subtab === "orderconfirmed") {
      setFilters((filters) => ({
        ...filters,
        status: "ORDERCONFIRMED",
      }));
    } else if (subtab === "jobcompleted") {
      setFilters((filters) => ({
        ...filters,
        status: "INVOICEAWAITED",
        jobClosedStatus: {
          $null: true,
        },
      }));
    } else if (subtab === "podawaited") {
      setFilters((filters) => ({
        ...filters,
        status: "PODAWAITED",
      }));
    }
  }, [subtab]);

  const renderActions = (params: any) => {
    const actions = [
      {
        icon: <IoMdEye />,
        name: "View",
        onClick: (params: any) => {
          setJob(realData.find((item) => item.id === params.id));
          setModal("view");
        },
      },
      {
        icon: <BiPencil />,
        name: "Edit",
        onClick: (params: any) => {
          setJob(realData.find((item) => item.id === params.id));
          setModal("edit");
        },
      },
    ];
    if (params.row.status === "QUERYRECEIVED") {
      actions.push({
        icon: <BiPencil />,
        name: "Generate Quote",
        onClick: (params: any) => {
          setJob(realData.find((item) => item.id === params.id));
          setModal("quote");
        },
      });
    }
    if (
      params.row.status === "ORDERCONFIRMED" ||
      params.row.status === "QUOTEDTOCLIENT"
    )
      actions.push({
        icon: <BiPencil />,
        name: "Flag",
        onClick: (params: any) => {
          setJob(realData.find((item) => item.id === params.id));
          setModal("flag");
        },
      });
    return <LongMenu options={actions} params={params} />;
  };

  const {
    rows,
    columns,
    loading,
    refresh,
    page,
    data: realData,
    getAllRows,
  } = useSalesTable({
    filters,
    renderActions,
  });

  useEffect(() => {
    setDownloadSubroutine(null);
  }, [rows]);

  const router = useRouter();
  const apiRef = useGridApiRef();

  const startDownload = async () => {
    const { data, rows } = await getAllRows();
    setDownloadSubroutine({
      data,
      rows,
    });
    console.log("Download Subroutine", { data, rows });
    return { data, rows };
  };

  return (
    <>
      <Head>
        <title>Sales Dashboard</title>
        <meta name="description" content="Sales Dashboard" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <DashboardLayout header sidebar>
        <div className="flex gap-4">
          <IconButton
            onClick={() => {
              setModal("create");
            }}
          >
            <MdAdd />
          </IconButton>
          <ToggleButtonGroup
            color="primary"
            value={maintab}
            exclusive
            onChange={(e, value) => {
              if (value) setMainTab(value);
              if (value === "live") setSubTab("queryreceived");
            }}
          >
            {mainTabs.map((tab) => (
              <ToggleButton value={tab.value} key={tab.value}>
                {tab.name}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
        <div className="my-4 flex flex-col gap-3">
          <Search
            placeholder="Enter Job Code to search.."
            onChange={(e) =>
              setFilters((filters) => ({
                ...filters,
                search: e.target.value,
              }))
            }
          />
          {maintab === "live" && (
            <ToggleButtonGroup
              color="primary"
              value={subtab}
              exclusive
              onChange={(e, value) => {
                setSubTab(value);
              }}
            >
              {subTabs.map((tab) => (
                <ToggleButton value={tab.value} key={tab.value}>
                  {tab.name}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        </div>
        <div className="mb-4">
          <Filters
            setFilters={setFilters}
            onDownload={() => {
              startDownload().then(({ rows }) => {
                downloadTable(rows.data);
              });
            }}
            onPrint={() =>
              apiRef.current.exportDataAsPrint({
                fileName: "Job Orders",
              })
            }
          />
        </div>
        <DataGrid
          apiRef={apiRef}
          initialState={
            downloadSubroutine === null
              ? undefined
              : {
                  pagination: {
                    paginationModel: {
                      page: 1,
                      pageSize: 10,
                    },
                  },
                }
          }
          rows={
            downloadSubroutine === null
              ? rows.data
              : downloadSubroutine.rows.data
          }
          columnVisibilityModel={{
            quotedAt: filters.status === "QUERYRECEIVED" ? false : true,
            targetPort: false,
            cancelReason:
              filters.jobClosedStatus === "JOBCANCELLED" ? true : false,
          }}
          rowCount={
            downloadSubroutine === null
              ? rows.total
              : downloadSubroutine.rows.total
          }
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          paginationModel={
            downloadSubroutine === null
              ? {
                  page: page - 1,
                  pageSize: 10,
                }
              : undefined
          }
          pageSizeOptions={[10]}
          onPaginationModelChange={
            downloadSubroutine === null
              ? (params) => {
                  router.push({
                    pathname: router.pathname,
                    query: { page: params.page + 1 },
                  });
                }
              : undefined
          }
          pagination
          paginationMode={downloadSubroutine === null ? "server" : "client"}
        />
        <Modal open={Boolean(modal)} onClose={() => setModal(null)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: "80%",
              overflow: "scroll",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            {modal === "create" && (
              <JobOrderForm
                callback={refresh}
                authData={user}
                mode="create"
                onClose={() => setModal(null)}
              />
            )}
            {modal === "edit" && job && (
              <JobOrderForm
                callback={refresh}
                authData={user}
                mode="edit"
                onClose={() => setModal(null)}
                data={job}
              />
            )}
            {modal === "view" && job && <JobOrderView data={job} />}
            {modal === "flag" && job && <FlagForm job={job} />}
            {modal === "quote" && job && <QuotationForm job={job} />}
          </Box>
        </Modal>
      </DashboardLayout>
    </>
  );
}
