import React, { useEffect, useState } from "react";
import instance from "@/config/axios.config";

export default function useStats({
  type = "ALL",
  status = "QUERYRECIEVED",
}: {
  type: "SERVICES" | "SPARES SUPPLY" | "ALL";
  status: "QUERYRECIEVED" | "ORDERCONFIRMED";
}) {
  const [stats, setStats] = useState<
    | {
        id: number;
        job_count: number;
        name: string;
      }[]
    | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      if (!type) {
        throw new Error("Please provide type of Job");
      }
      const res = await instance.get(
        type === "ALL"
          ? `/jobs/stats/companies?n=5&status=${status}`
          : `/jobs/stats/companies?n=5&jobType=${type}&status=${status}`
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
  }, [type, status]);

  return { stats, loading, error, fetchStats };
}
