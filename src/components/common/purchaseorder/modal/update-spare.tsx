import React, { useState } from "react";
import {
  Slide,
  Modal,
  Box,
  Typography,
  Stack,
  Dialog,
  Button,
} from "@mui/material";
import UpdateSpareForm from "../../joborder/form/spare/update-spare";
import { TransitionProps } from "@mui/material/transitions";
import UpdateSpareCard from "@/components/atoms/card/update-spare-card";
import { IoClose } from "react-icons/io5";
import instance from "@/config/axios.config";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const UpdateSpareModal = ({
  open,
  onClose,
  job,
}: {
  open: boolean;
  onClose: () => void;
  job: JobType;
}) => {
  const [updateSpare, setUpdateSpare] = React.useState<{
    open: boolean;
    spare: any | null;
  }>({
    open: false,
    spare: null,
  });
  const [spares, setSpares] = useState(
    job.spares.map((spare: any) => ({ spare, updated: false }))
  );
  const [loading, setLoading] = useState(false);

  const updateSpares = async () => {
    try {
      toast.loading("Updating spares...");
      setLoading(true);
      for (let sp of spares) {
        const { spare, updated } = sp;
        if (!updated) {
          continue;
        }
        await instance.put(`/spare/${spare.id}`, {
          data: spare,
        });
      }
      toast.dismiss();
      toast.success("Spares updated successfully", {
        autoClose: 2000,
      });
      onClose();
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to update spares");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      TransitionComponent={Transition}
    >
      <Box
        sx={{
          p: 4,
          overflowY: "auto",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            p: 2,
          }}
        >
          <IoClose
            onClick={onClose}
            style={{
              cursor: "pointer",
            }}
          />
        </Box>
        <Typography variant="h6" gutterBottom>
          Update Spare
        </Typography>
        <Stack spacing={2}>
          {spares.map(({ spare }: any, index: number) => (
            <UpdateSpareCard
              key={index}
              name={spare.title}
              description={spare.description}
              quantity={spare.quantity}
              onEdit={() => {
                setUpdateSpare({
                  open: true,
                  spare: spare,
                });
              }}
            />
          ))}
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            disabled={!spares.some((spare: any) => spare.updated) || loading}
            onClick={updateSpares}
          >
            Update Spares
          </Button>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={onClose}
            color="error"
          >
            Cancel
          </Button>
        </Stack>
      </Box>
      <Modal
        open={updateSpare.open}
        onClose={() => {
          setUpdateSpare({ open: false, spare: null });
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Update Spare
          </Typography>
          <UpdateSpareForm
            onClose={() => setUpdateSpare({ open: false, spare: null })}
            spare={updateSpare.spare}
            onSpareUpdate={(updatedSpare: any) => {
              const updatedSpares = spares.map((spare: any) => {
                if (spare.id === updatedSpare.id) {
                  return updatedSpare;
                }
                return spare;
              });
              setSpares((spares: any) => {
                return spares.map((s: any) => {
                  if (s.spare.id === updatedSpare.id) {
                    return {
                      spare: updatedSpare,
                      updated: true,
                    };
                  }
                  return s;
                });
              });
              setUpdateSpare({ open: false, spare: null });
            }}
          />
        </Box>
      </Modal>
    </Dialog>
  );
};

export default UpdateSpareModal;
