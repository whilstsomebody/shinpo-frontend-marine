import { useEffect, useState } from "react";
import instance from "@/config/axios.config";
import parseAttributes from "@/utils/parse-data";
import { GridColDef } from "@mui/x-data-grid";
import qs from "qs";
import { useSearchParams } from "next/navigation";
import { PurchaseTableFilter } from "@/pages/dashboard/purchase";

export default function usePurchaseTable({
  renderActions,
  filters,
}: {
  renderActions?: (params: any) => React.ReactNode;
  filters: PurchaseTableFilter;
}) {
  const [rows, setRows] = useState<{
    total: number;
    data: JobType[];
  }>({
    total: 0,
    data: [],
  });
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const { search } = filters;
  const query = qs.stringify(
    {
      sort: "jobCode:desc",
      filters: {
        purchaseStatus: {
          $eq: filters.status,
        },
        ...(search
          ? {
              $or: [
                { jobCode: { $contains: search } },
                { description: { $containsi: search } },
                { shipName: { $containsi: search } },
                { targetPort: { $containsi: search } },
                { type: { $containsi: search } },
                {
                  company: {
                    name: {
                      $containsi: search,
                    },
                  },
                },
              ],
            }
          : {}),
        ...(filters.assignedTo ? { assignedTo: filters.assignedTo } : {}),
        ...(filters.queriedFrom || filters.queriedUpto
          ? {
              receivedAt: {
                ...(filters.queriedFrom
                  ? { $gte: filters.queriedFrom.toISOString() }
                  : {}),
                ...(filters.queriedUpto
                  ? { $lte: filters.queriedUpto.toISOString() }
                  : {}),
              },
            }
          : {}),
        ...(filters.services.length > 0
          ? {
              services: {
                id: {
                  $in: filters.services,
                },
              },
            }
          : {}),
      },
      pagination: {
        page,
        pageSize: 10,
      },
    },
    { encodeValuesOnly: true }
  );

  useEffect(() => {
    refresh();
  }, [filters, page]);
  const refresh = async () => {
    const route = filters.status
      ? `/jobs?${query}&populate[0]=rfqs&populate[1]=assignedTo&populate[2]=company&populate[3]=spares.attachments`
      : "/jobs?populate[0]=rfqs&populate[1]=assignedTo&populate[2]=company&populate[3]=spares.attachments";
    setLoading(true);
    instance
      .get(route)
      .then((res: any) => {
        setRows({
          total: res.data.meta.pagination.total,
          data: parseAttributes(res.data.data).map((el: any) =>
            Object.fromEntries(
              Object.entries(el).map(([x, y]: [string, any]) => {
                if (x == "assignedTo") return [x, y.fullname];
                return [x, y];
              })
            )
          ),
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  };
  const columns: GridColDef[] = [
    { field: "jobCode", headerName: "Job Code", width: 130, flex: 0.3 },
    {
      field: "description",
      headerName: "Job Description",
      width: 200,
      flex: 0.5,
    },
    { field: "receivedAt", headerName: "Received Date", width: 150, flex: 0.3 },
    {
      field: "response",
      headerName: "Responses",
      width: 150,
      flex: 0.3,
      renderCell: (params) => {
        const uniqueResponses = new Set(
          params.row.rfqs.map((el: any) => el.vendor.name)
        );
        const uniqueFilledResponses = new Set(
          params.row.rfqs
            .filter((el: any) => el.filled)
            .map((el: any) => el.vendor.name)
        );
        return `${uniqueFilledResponses.size} / ${uniqueResponses.size}`;
      },
    },
    { field: "type", headerName: "Type", width: 150, flex: 0.3 },
    { field: "assignedTo", headerName: "Assigned To", width: 150, flex: 0.3 },
    {
      field: "Action",
      headerName: "Action",
      headerAlign: "center",
      width: 150,
      renderCell: (params) => (
        <div className="flex justify-center items-center w-full gap-4">
          {renderActions && renderActions(params)}
        </div>
      ),
      flex: 0.2,
    },
  ];

  const getAllRows = async () => {
    const searchParams = new URLSearchParams(query);
    // Remove pagination from query
    searchParams.delete("pagination[page]");
    searchParams.delete("pagination[pageSize]");
    const res = await instance.get(
      `/jobs?populate=*&pagination[page]=1&${searchParams.toString()}&pagination[pageSize]=1000`
    );
    const data = parseAttributes(res.data.data);
    const rows = {
      data: parseAttributes(res.data.data).map((el: any) =>
        Object.fromEntries(
          Object.entries(el).map(([x, y]: [string, any]) => {
            if (x == "assignedTo") return [x, y?.fullname || ""];
            if (x == "company") return [x, y.name];
            return [x, y];
          })
        )
      ),
      total: res.data.meta.pagination.total,
    };

    return { rows, data };
  };

  return { columns, rows, loading, page, refresh, getAllRows };
}
