import React, { useEffect, useState } from "react";
import instance from "@/config/axios.config";

export default function useSupplierStats({
  type = "ALL",
}: {
  type: "SERVICES" | "SPARES SUPPLY" | "ALL";
}) {
  const [stats, setStats] = useState<
    | {
        id: number;
        num_jobs: number;
        name: string;
      }[]
    | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await instance.get(
        type === "ALL"
          ? `/purchase-order/stats?n=5`
          : `/purchase-order/stats?n=5&jobType=${type}`
      );

      setStats(res.data.companies);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [type]);

  return { stats, loading, error, fetchStats };
}
