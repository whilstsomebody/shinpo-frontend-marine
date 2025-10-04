import React, { useEffect } from "react";
import { Box, Button, Modal, Typography } from "@mui/material";
import instance from "@/config/axios.config";
import parseAttributes from "@/utils/parse-data";

interface DownloadModalProps {
  open: boolean;
  onClose: () => void;
  id: string | number | null;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ open, onClose, id }) => {
  const [purchaseOrders, setPurchaseOrders] = React.useState([]);

  useEffect(() => {
    instance
      .get(
        `/purchase-orders?filters\[job\][id][$eq]=${id}&populate[0]=vendor&populate[1]=attachments`
      )
      .then((res) => {
        setPurchaseOrders(parseAttributes(res.data.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [open, id]);

  const downloadAttachment = (url: string) => () => {
    const link = document.createElement("a");
    link.setAttribute("hidden", "");
    link.setAttribute("href", url);
    link.setAttribute("target", "_blank");
    link.setAttribute("download", "purchase-order.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" id="modal-modal-title" component="h2">
          Download Purchase Orders
        </Typography>
        <div className="flex flex-col gap-4 mt-4">
          {purchaseOrders.map((order: any) => (
            <div key={order.id} className="flex justify-between">
              <p className="">{order.vendor.name}</p>
              <Button
                variant="outlined"
                color="primary"
                onClick={downloadAttachment(order.attachments[0].url)}
              >
                Download
              </Button>
            </div>
          ))}
        </div>
      </Box>
    </Modal>
  );
};

export default DownloadModal;
