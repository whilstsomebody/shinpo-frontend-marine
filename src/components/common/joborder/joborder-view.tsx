import { Box, Typography } from "@mui/material";
import React from "react";
import Field from "@/components/atoms/field";
import { CiBarcode } from "react-icons/ci";
import formatDate from "@/utils/date-formatter";

interface JobOrderViewProperties {
  data?: JobType | null;
}

const JobOrderView: React.FC<JobOrderViewProperties> = ({ data }) => {
  return (
    <div className="flex flex-col gap-0">
      <Field icon={<CiBarcode />} title={"Job Code"} value={data?.jobCode} />
      <Field
        icon={<CiBarcode />}
        title={"Query Received on"}
        value={formatDate(data?.receivedAt) || "Not Available"}
      />
      <Field
        icon={<CiBarcode />}
        title={"Quotation Date"}
        value={formatDate(data?.quotedAt) || "Not Available"}
      />
      <Field
        icon={<CiBarcode />}
        title={"Ship Name"}
        value={data?.shipName || "Not Available"}
      />
      <Field
        icon={<CiBarcode />}
        title={"Company Name"}
        value={data?.company.name || "Not Available"}
      />
      <Field
        icon={<CiBarcode />}
        title={"Service Cordinator"}
        value={data?.assignedTo.fullname || "Not Available"}
      />
      <Field icon={<CiBarcode />} title={"Status"} value={data?.status} />
      <Field
        icon={<CiBarcode />}
        title={"PO Number"}
        value={data?.poNumber || "Not Available"}
      />
      <Field
        icon={<CiBarcode />}
        title={"Target Port"}
        value={data?.targetPort || "Not Available"}
      />
      <Field
        icon={<CiBarcode />}
        title={"Vessel ETA"}
        value={formatDate(data?.vesselETA) || "Not Available"}
      />
      <Field
        icon={<CiBarcode />}
        title={"Nature of Job"}
        value={data?.type || "Not Available"}
      />
    </div>
  );
};

export default JobOrderView;
