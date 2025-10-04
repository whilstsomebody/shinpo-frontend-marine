import React from "react";

const status = (status: string) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`w-3 h-3 rounded-full ${
          status === "JOBCANCELLED"
            ? "bg-red-600"
            : status === "INVOICEAWAITED"
            ? "bg-green-600"
            : "bg-yellow-600"
        }`}
      ></div>
      <span className="ml-2">{status}</span>
    </div>
  );
};

export default status;
