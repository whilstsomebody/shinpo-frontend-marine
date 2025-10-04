import { TiCancel } from "react-icons/ti";
import React from "react";
import instance from "@/config/axios.config";
import { Modal, Box } from "@mui/material";
import { toast } from "react-toastify";

interface CancelJobButtonProperties {
  className?: string;
  callback?: any;
  job: any;
}

const CancelJobButton: React.FC<CancelJobButtonProperties> = ({
  className,
  callback,
  job: data,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleCancel = () => {
    instance
      .put(`/jobs/${data.id}`, { data: { status: "JOBCANCELLED" } })
      .then(() => {
        toast.success("Job Cancelled!");
      })
      .catch((err) => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setOpen(false);
        callback();
      });
  };
  return (
    <>
      <button className="p-2 bg-red-500 rounded-full text-white" onClick={() => setOpen(true)}>
        <TiCancel />
      </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            borderRadius: "10px",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h1 className="text-lg font-semibold text-center">
            Are you sure you want to cancel this job?
          </h1>
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md"
              onClick={handleCancel}
            >
              Yes
            </button>
            <button
              className="bg-gray-300 text-gray-600 px-4 py-2 rounded-md"
              onClick={() => setOpen(false)}
            >
              No
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default CancelJobButton;
