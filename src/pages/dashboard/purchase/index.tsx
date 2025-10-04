import React from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout";
import { DataGrid } from "@mui/x-data-grid";
import usePurchaseTable from "@/hooks/purchase-table";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { MdAdd } from "react-icons/md";
import Search from "../../../components/common/joborder/joborder-search";
import RFQDialog from "@/components/atoms/button/job-rfq";
import { useRouter } from "next/router";
import { IoMdEye } from "react-icons/io";
import { RiFileDownloadFill } from "react-icons/ri";
import LongMenu from "@/components/atoms/dropdown/menu";
import UpdateModal from "@/components/common/purchaseorder/modal/update";
import instance from "@/config/axios.config";
import DownloadModal from "@/components/common/purchaseorder/modal/download";
import UpdateSpareModal from "@/components/common/purchaseorder/modal/update-spare";
import getUnique from "@/utils/unique";
import AuthContext from "@/context/AuthContext";
import { toast } from "react-toastify";
import TableHeader from "@/components/dashboard/purchase/tableHeader";
import downloadTable from "@/utils/download-table";

export type PurchaseTableFilter = {
  status: PurchaseStatus | null;
  search: string;
  assignedTo: number | null;
  services: number[];
  queriedFrom: Date | null;
  queriedUpto: Date | null;
};

export default function Home() {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const [filters, setFilters] = React.useState<PurchaseTableFilter>({
    status: "QUERYRECEIVED",
    search: "",
    assignedTo: null,
    services: [],
    queriedFrom: null,
    queriedUpto: null,
  });

  const handleNotifyVendors = async (rfqs: any[], job: JobType) => {
    try {
      toast.loading("Processing...");
      const uniqueRfqs = getUnique(
        rfqs,
        (rfq) => rfq.vendor.id,
        (rfq) => !rfq.filled
      );
      const bodies = uniqueRfqs.reduce((acc, rfq) => {
        const body = `Dear ${
          rfq.vendor.name
        },<br/><br/>I hope this email finds you well.<br/><br/>We wanted to kindly remind you that we are still awaiting your quotation for our subject enquiry. Your participation in this query is pivotal to us, and we highly value your prompt response.<br/><br/>
        <table style="width: 100%; border-collapse: collapse;">
  <tr>
    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Sl No.</th>
    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Item Name</th>
    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Description</th>
    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Quantity</th>
  </tr>
  ${job.spares
    .map(
      (spare, index) => `
  <tr>
    <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${
      index + 1
    }</td>
    <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${
      spare.title
    }</td>
    <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${
      spare.description
    }</td>
    <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${
      spare.quantity
    } ${spare.quantityUnit || ""}</td>
  </tr>
  `
    )
    .join("")}
      </table> <br/><br/>
        Please let us know if you require any further information or assistance to proceed with your quotation submission.<br/><br/>Thank you for your attention to this matter, and we look forward to receiving your quotes soon.<br/><br/><b>
        Please ignore this email if you have already submitted your quotation.</b><br/><br/>
        Warm regards,<br/><br/><br/><div style="display:flex;gap:20px"><img src="https://jobs.shinpoengineering.com/email.png" alt="Shinpo Engineering Pte Ltd" style="margin-right:10px;width:150px;height:65px"/><div><p style="font-weight: 700;color:#008ac9;font-size:20;margin:0">${
          user?.fullname
        }</p>Shinpo Engineering Pte. Ltd.<br/><br/><p style="margin:0;padding:0">${
          user?.designation
        }</p><p style="margin:0;padding:0">${
          user?.phone
        }</p><p style="margin:0;padding:0;color:#008ac9;">Email: purchase@shinpoengineering.com</p><p style="color:#008ac9;padding:0;margin:0;">1 Tuas South Avenue 6 #05-20
      The Westcom Singapore 637021</p>Tel: +65 65399007<br/>www.shinpoengineering.com
      </div></div>`;
        return {
          ...acc,
          [rfq.vendor.id]: {
            body,
            subject: `RE: RFQ-${job?.jobCode} - ${job?.description}`,
          },
        };
      }, {});
      await instance.post("/job/notify-vendors", {
        bodies,
      });
      toast.dismiss();
      toast.success("Vendors Notified");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };
  const actions =
    filters.status == "QUERYRECEIVED"
      ? [
          {
            icon: <MdAdd />,
            name: "Create an RFQ",
            onClick: (params: any) => {
              setRFQOpen(true);
              const job = rows.data.find((el) => el.id == params.row.id);
              job && setJob(job);
            },
            className: "bg-green-500 hover:bg-green-600",
          },
        ]
      : filters.status == "RFQSENT"
      ? [
          {
            icon: <MdAdd />,
            name: "Send RFQ Again",
            onClick: (params: any) => {
              setRFQOpen(true);
              setAgain(true);
              const job = rows.data.find((el) => el.id == params.row.id);
              job && setJob(job);
            },
            className: "bg-green-500 hover:bg-green-600",
          },
          {
            icon: <MdAdd />,
            name: "Notify Vendors",
            onClick: (params: any) => {
              handleNotifyVendors(params.row.rfqs, params.row);
            },
          },
          {
            icon: <MdAdd />,
            name: "Update Quotes",
            onClick: (params: any) => {
              setUpdateOpen(true);
              setJobCode(params.row.jobCode);
            },
            className: "bg-green-500 hover:bg-green-600",
          },
          {
            icon: <IoMdEye />,
            name: "Compare Quotes",
            onClick: (params: any) => {
              const job = rows.data.find((el) => el.id == params.row.id);
              job &&
                router.push(`/dashboard/purchase/quotes/RFQ-${job.jobCode}`);
            },
            className: "bg-green-500 hover:bg-green-600",
          },
        ]
      : filters.status == "POISSUED"
      ? [
          {
            icon: <MdAdd />,
            name: "View Quotes",
            onClick: (params: any) => {
              router.push(
                `/dashboard/purchase/quotes/view/RFQ-${params.row.jobCode}`
              );
            },
            className: "bg-green-500 hover:bg-green-600",
          },
          {
            icon: <RiFileDownloadFill />,
            name: "Download PO",
            onClick: (params: any) => {
              const job = rows.data.find((el) => el.id == params.row.id);
              job && setDownloadOpen({ open: true, id: job.id });
            },
          },
          {
            icon: <IoMdEye />,
            name: "Mark Purchase Complete",
            onClick: (params: any) => {
              const job = rows.data.find((el) => el.id == params.row.id);
              job && setPurchaseCompleted({ open: true, id: `${job.id}` });
            },
            className: "bg-green-500 hover:bg-green-600",
          },
        ]
      : [
          {
            icon: <MdAdd />,
            name: "View Quotes",
            onClick: (params: any) => {
              router.push(
                `/dashboard/purchase/quotes/view/RFQ-${params.row.jobCode}`
              );
            },
            className: "bg-green-500 hover:bg-green-600",
          },
        ];
  const renderActions = (params: any) => (
    <LongMenu options={actions} params={params} />
  );
  const { columns, rows, loading, page, refresh, getAllRows } =
    usePurchaseTable({
      renderActions,
      filters,
    });
  const handleFilter = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: any
  ) => {
    setFilters({ ...filters, status: newFilter });
    setFilters({
      ...filters,
      status: newFilter,
    });
  };

  const startDownload = async () => {
    const { data, rows } = await getAllRows();
    console.log("Download Subroutine", { data, rows });
    return { data, rows };
  };

  const [RFQOpen, setRFQOpen] = React.useState(true);
  const [again, setAgain] = React.useState(false);
  const [job, setJob] = React.useState<JobType | null>(null);
  const [updateOpen, setUpdateOpen] = React.useState(false);
  const [updateSpareOpen, setUpdateSpareOpen] = React.useState<{
    open: boolean;
    job: JobType | null;
  }>({
    open: false,
    job: null,
  });
  const [downloadOpen, setDownloadOpen] = React.useState<{
    open: boolean;
    id: string | number | null;
  }>({
    open: false,
    id: null,
  });
  const [jobCode, setJobCode] = React.useState<string | null>(null);
  const [purchaseComplted, setPurchaseCompleted] = React.useState({
    open: false,
    id: "",
  });

  const handlePurchaseComplete = (id: string) => {
    instance
      .put(`/jobs/${id}`, {
        data: { purchaseStatus: "COMPLETED" },
      })
      .then(() => {
        refresh();
      });
  };

  return (
    <>
      <Head>
        <title>Purchase Dashboard</title>
        <meta name="description" content="Sales Dashboard" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <DashboardLayout header sidebar>
        <Box sx={{ height: 600, width: "100%" }}>
          <ToggleButtonGroup
            sx={{ mb: 2 }}
            color="primary"
            value={filters.status}
            exclusive
            onChange={handleFilter}
          >
            <ToggleButton value="QUERYRECEIVED">Query</ToggleButton>
            <ToggleButton value="RFQSENT">RFQ Sent</ToggleButton>
            <ToggleButton value="POISSUED">PO Issued</ToggleButton>
            <ToggleButton value="COMPLETED">Completed</ToggleButton>
          </ToggleButtonGroup>
          <Search
            placeholder="Enter Job Code to search.."
            onChange={(e) =>
              setFilters((filters) => ({
                ...filters,
                search: e.target.value,
              }))
            }
            className="mb-4"
          />
          <TableHeader
            onCSVDownload={() => {
              startDownload().then(({ data, rows }) => {
                downloadTable(rows.data);
              });
            }}
            onFilterChange={(filter) => {
              setFilters((filters) => ({
                ...filters,
                ...filter,
              }));
            }}
          />
          <DataGrid
            rows={rows.data}
            rowCount={rows.total}
            scrollbarSize={20}
            columnVisibilityModel={{
              response: filters.status === "QUERYRECEIVED" ? false : true,
            }}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            paginationModel={{
              page: page - 1,
              pageSize: 10,
            }}
            pageSizeOptions={[10]}
            onPaginationModelChange={(params) => {
              router.push({
                pathname: router.pathname,
                query: { page: params.page + 1 },
              });
            }}
            pagination
            paginationMode="server"
          />
        </Box>
        {job && RFQOpen && (
          <RFQDialog
            open={RFQOpen}
            onClose={() => {
              setJob(null);
              setRFQOpen(false);
            }}
            setAgain={setAgain}
            again={again}
            setOpen={setRFQOpen}
            job={job}
            refresh={refresh}
          />
        )}
        {updateSpareOpen && updateSpareOpen.job && (
          <UpdateSpareModal
            open={updateSpareOpen.open}
            job={updateSpareOpen.job}
            onClose={() => {
              setUpdateSpareOpen({ open: false, job: null });
            }}
          />
        )}
        {downloadOpen.open && (
          <DownloadModal
            open={downloadOpen.open}
            onClose={() => setDownloadOpen({ open: false, id: null })}
            id={downloadOpen.id}
          />
        )}
        {jobCode && (
          <UpdateModal
            open={updateOpen}
            onClose={() => {
              setJobCode(null);
              setUpdateOpen(false);
            }}
            jobCode={jobCode}
          />
        )}
        {purchaseComplted && (
          <Dialog
            open={purchaseComplted.open}
            onClose={() => setPurchaseCompleted({ open: false, id: "" })}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Mark Purchase as Completed?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to mark this purchase as completed?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setPurchaseCompleted({ open: false, id: "" });
                }}
              >
                Disagree
              </Button>
              <Button
                onClick={() => {
                  handlePurchaseComplete(purchaseComplted.id);
                  setPurchaseCompleted({ open: false, id: "" });
                }}
                autoFocus
              >
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </DashboardLayout>
    </>
  );
}
