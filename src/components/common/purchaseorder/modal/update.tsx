import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  MenuItem,
  Modal,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import parseAttributes from "@/utils/parse-data";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import instance from "@/config/axios.config";
import { useRouter } from "next/router";

interface UpdateModalProps {
  open: boolean;
  onClose: () => void;
  jobCode: string;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  open,
  onClose,
  jobCode,
}) => {
  const rfqNumber = `RFQ-${jobCode}`;
  const [vendors, setVendors] = useState<VendorType[]>([]);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [loadVendor, setLoadVendor] = useState(false);
  const [loading, setLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_FRONTEND_URL;
  const router = useRouter();

  useEffect(() => {
    const fetchRFQ = async () => {
      try {
        setLoadVendor(true);
        const response = await instance.get(
          `/rfqs?filters[RFQNumber][$eq]=${rfqNumber}&filters[filled]=false&populate=vendor`
        );
        const rfqs = parseAttributes(response.data);
        const vendors = rfqs.map((rfq: any) => rfq.vendor);
        const uniqueVendors = vendors.filter(
          (v: any, i: any, a: any) =>
            a.findIndex((t: any) => t.id === v.id) === i
        );
        setVendors(uniqueVendors);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadVendor(false);
      }
    };
    fetchRFQ();
  }, [jobCode]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/api/rfq-form-link`, {
        rfqNumber,
        vendorId: `${selectedVendorId}`,
      });
      const { link } = response.data;
      setLoading(false);
      window.open(link, "_blank");
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setSelectedVendorId(null);
      onClose();
    }
  };

  return !loadVendor ? (
    vendors.length > 0 ? (
      <Modal
        open={open}
        onClose={() => {
          setSelectedVendorId(null);
          onClose();
        }}
      >
        <Box
          sx={{
            width: "30%",
            position: "absolute",
            top: "50%",
            left: "50%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            justifyContent: "center",
            alignItems: "center",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 3,
          }}
        >
          <FormControl
            fullWidth
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <div className="flex flex-col gap-3">
              <label className="text-gray-500 font-semibold" htmlFor="vendor">
                Choose a Vendor to Update Quotes
              </label>
              <Select
                placeholder="Select a Vendor to Update Quotes"
                id="vendor"
                size="small"
                value={selectedVendorId || ""}
                onChange={(e) => setSelectedVendorId(e.target.value)}
              >
                <MenuItem value="" disabled>
                  Select a Vendor to Update Quotes
                </MenuItem>
                {vendors.map((vendor) => (
                  <MenuItem key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <LoadingButton
              variant="outlined"
              color="primary"
              type="submit"
              loading={loading}
              onClick={handleSubmit}
            >
              Update Quotes
            </LoadingButton>
          </FormControl>
        </Box>
      </Modal>
    ) : (
      <Dialog open={open} onClose={onClose}>
        <DialogContent dividers>
          <Typography gutterBottom>No Vendors Found</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    )
  ) : (
    <Dialog open={open}>
      <DialogContent dividers>
        <Typography variant="h6" textAlign="center" gutterBottom>
          Please wait...
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateModal;
