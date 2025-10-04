import DashboardLayout from "@/components/layout";
import React, { useEffect, useState, useRef, use } from "react";
import DeleteVendor from "@/components/atoms/button/delete-vendor";
import { MdAdd, MdEdit } from "react-icons/md";
import Button from "@/components/atoms/button";
import { useRouter } from "next/router";
import instance from "@/config/axios.config";
import Loading from "@/components/atoms/loading";
import Dropdown from "@/components/atoms/dropdown";
import { DataGrid, GridColDef, GridFilterModel } from "@mui/x-data-grid";
import parseAttributes from "@/utils/parse-data";
import MailFormLink from "@/components/atoms/button/mail-formlink";
import VendorFilters, {
  VendorFilterType,
} from "@/components/common/vendor/filters";
import EditVendor from "@/components/atoms/button/edit-vendor";
import { useSearchParams } from "next/navigation";
import Search from "@/components/common/joborder/joborder-search";
import qs from "qs";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { toast } from "react-toastify";

const VendorPage = () => {
  const router = useRouter();
  const [tableLoading, setTableLoading] = useState(false);
  const [vendors, setVendors] = useState<{
    totalPages: number;
    total: number;
    data: any[];
  }>({
    total: 0,
    totalPages: 0,
    data: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const [vendorStatus, setVendorStatus] = useState<"APPROVED" | "NONAPPROVED">(
    "APPROVED"
  );

  const [filters, setFilters] = useState<VendorFilterType>({
    categories: [],
  });

  const searchTimeout = useRef<any>(null);

  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      const { page, ...realQuery } = router.query;
      router.push({
        pathname: router.pathname,
        query: realQuery,
      });
    }, 1000);
    if (page === 1) getVendors();
  }, [search, filters, vendorStatus]);

  const handleApprove = (id: string) => {
    toast.info("Approving Vendor");
    instance
      .put(`/vendors/${id}`, {
        data: {
          registered: true,
        },
      })
      .then((res) => {
        toast.dismiss();
        toast.success("Vendor Approved", {
          autoClose: 3000,
        });
        getVendors();
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  const hendleReject = (id: string) => {
    toast.info("Deleting Vendor");
    instance
      .delete(`/vendors/${id}`)
      .then((res) => {
        toast.dismiss();
        toast.error("Vendor Rejected", {
          autoClose: 3000,
        });
        getVendors();
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  const getVendors = async (page: number = 1) => {
    const apiqueries = qs.stringify({
      filters: {
        $and: [
          {
            $or: [
              {
                name: {
                  $containsi: search,
                },
              },
              {
                services: {
                  title: {
                    $containsi: search,
                  },
                },
              },
              {
                country: {
                  $containsi: search,
                },
              },
            ],
          },
          filters.categories.length > 0 && {
            services: {
              id: {
                $in: filters.categories.map((category) => category.id),
              },
            },
          },
          vendorStatus === "APPROVED"
            ? { registered: true }
            : { registered: false },
        ].filter(Boolean),
      },
    });

    setTableLoading(true);
    const res = await instance.get(
      `/vendors?pagination[page]=${page}&pagination[pageSize]=10&${apiqueries}&populate=*`
    );

    setVendors({
      total: res.data.meta.pagination.total,
      totalPages: res.data.meta.pagination.pageCount,
      data: parseAttributes(res.data.data),
    });
    setTableLoading(false);
  };

  useEffect(() => {
    getVendors(page);
  }, [page]);

  const handleRegisterVendor = () => {
    setIsLoading(true);
    instance.post("/vendors/form/generate-vendor-hash").then((res) => {
      setIsLoading(false);
      const hash = res.data.hash;
      if (!hash) {
        toast.error("Something went wrong");
        return;
      }
      const base =
        process.env.NEXT_PUBLIC_BASE_FRONTEND_URL || window.location.origin;
      window.open(`${base}/vendor/form/${hash}`, "_blank");
    });
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Vendor Name",
      width: 200,
      filterable: false,
      editable: true,
    },
    {
      field: "email",
      headerName: "Vendor Email",
      width: 200,
      editable: true,
      filterable: false,
    },
    {
      field: "country",
      headerName: "Country",
      width: 200,
      filterable: false,
      editable: true,
    },
    {
      field: "categories",
      headerName: "Categories",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="flex flex-wrap gap-2 overflow-y-scroll max-h-20">
            {params.value.map((category: any, index: number) => (
              <span key={index} className="bg-gray-200 rounded-md p-1">
                {category.title}
              </span>
            ))}
          </div>
        );
      },
    },
    {
      field: "sales",
      headerName: "Sales",
      sortable: false,
      width: 200,
      editable: true,
      filterable: false,
      renderCell: (params) => {
        return (
          <div className="flex flex-col gap-1 overflow-y-scroll max-h-20">
            <span className="text-sm">{params?.value?.name}</span>
            <span className="text-sm">{params?.value?.mail}</span>
            <span className="text-sm">{params?.value?.mobile}</span>
          </div>
        );
      },
    },
    {
      field: "accounts",
      headerName: "Accounts",
      sortable: false,
      width: 200,
      editable: true,
      filterable: false,
      renderCell: (params) => {
        return (
          <div className="flex flex-col gap-1 overflow-y-scroll max-h-20">
            <span className="text-sm">{params?.value?.name}</span>
            <span className="text-sm">{params?.value?.mail}</span>
            <span className="text-sm">{params?.value?.mobile}</span>
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      editable: true,
      filterable: false,
      sortable: false,
      renderCell: (params) => {
        return vendorStatus === "APPROVED" ? (
          <div className="flex gap-4">
            <EditVendor id={params.row.id} callback={getVendors} />
            <DeleteVendor id={params.row.id} callback={getVendors} />
          </div>
        ) : (
          <div className="flex gap-4">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={(e) => {
                e.stopPropagation();
                handleApprove(params.row.id);
              }}
            >
              Approve
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={(e) => {
                e.stopPropagation();
                hendleReject(params.row.id);
              }}
            >
              Reject
            </Button>
          </div>
        );
      },
    },
  ];

  const rows = vendors.data.map((vendor: any) => {
    return {
      id: vendor.id,
      name: vendor.name,
      email: vendor.email,
      country: vendor.country,
      categories: vendor.services,
      sales: vendor.salescontact,
      accounts: vendor.accountscontact,
    };
  });
  if (isLoading) return <Loading />;
  return (
    <DashboardLayout header sidebar>
      <div className="flex gap-4">
        <Dropdown activeCondition={false}>
          {(handleClick, open) => (
            <div className="relative">
              <Button
                className="bg-blue-500 flex gap-1 hover:bg-blue-600 text-white"
                onClick={handleClick}
              >
                <MdAdd />
                <span>Register Vendor</span>
              </Button>
              {open && (
                <div className="absolute flex flex-col z-50 bg-white top-12 border-y-primary-light-grey w-[300px] rounded-md shadow-xl">
                  <Button
                    className="!text-black rounded-none bg-transparent hover:bg-gray-100"
                    onClick={handleRegisterVendor}
                  >
                    Register Manually
                  </Button>
                  <MailFormLink />
                </div>
              )}
            </div>
          )}
        </Dropdown>
      </div>
      <div className="my-4">
        <Search
          placeholder="Search Vendor by Name or Category"
          className="mb-4"
          onChange={(event) => {
            setSearch(() => event.target.value);
          }}
        />
        <ToggleButtonGroup
          sx={{ mb: 2 }}
          color="primary"
          exclusive
          value={vendorStatus}
          onChange={(event, newVendorStatus) => {
            if (!newVendorStatus) return;
            setVendorStatus(newVendorStatus);
          }}
        >
          <ToggleButton value="APPROVED">Approved</ToggleButton>
          <ToggleButton value="NONAPPROVED">Non Approved</ToggleButton>
        </ToggleButtonGroup>
        <VendorFilters
          setFilters={(filters) => {
            setFilters(filters);
          }}
        />
      </div>
      <Box sx={{ height: 520, width: "100%" }}>
        <DataGrid
          rows={rows}
          rowHeight={120}
          rowCount={vendors.total}
          onPaginationModelChange={(params) => {
            router.push({
              pathname: router.pathname,
              query: { page: params.page + 1 },
            });
          }}
          paginationModel={{
            page: page - 1,
            pageSize: 10,
          }}
          columns={columns}
          loading={tableLoading}
          getRowClassName={(params) => {
            return "cursor-pointer";
          }}
          disableRowSelectionOnClick
          onRowClick={(params) => {
            router.push(`/vendor/view/${params.row.id}`);
          }}
          paginationMode="server"
        />
      </Box>
    </DashboardLayout>
  );
};

export default VendorPage;
