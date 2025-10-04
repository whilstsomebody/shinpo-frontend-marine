import React from "react";
import { IconButton } from "@mui/material";
import { MdDelete } from "react-icons/md";
import { Modal, Box } from "@mui/material";
import instance from "@/config/axios.config";
import { toast } from "react-toastify";

const DeleteVendor = ({ id, callback }: { id: string; callback: any }) => {
  const [open, setOpen] = React.useState(false);
  const handleDeleteVendor = (id: string) => {
    instance
      .delete(`/vendors/${id}`)
      .then(() => {
        toast.error("Vendor Deleted!");
      })
      .finally(() => {
        callback && callback();
        setOpen(false);
      });
  };
  return (
    <>
      <IconButton
        className="bg-red-500 text-sm hover:bg-red-600 text-white"
        onClick={(e) => {
          setOpen(true);
          e.stopPropagation();
        }}
      >
        <MdDelete />
      </IconButton>
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
            Are you sure you want to delete this vendor?
          </h1>
          <div className="flex justify-center gap-4 mt-4">
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteVendor(id);
              }}
            >
              Confirm
            </button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default DeleteVendor;
