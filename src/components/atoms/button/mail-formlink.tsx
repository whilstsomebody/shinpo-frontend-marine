import React, { useState, useContext } from "react";
import Button from "@/components/atoms/button";
import { Modal, Box, FormControl } from "@mui/material";
import FormInputText from "../input/text";
import { useForm } from "react-hook-form";
import { IoMdMail } from "react-icons/io";
import instance from "@/config/axios.config";
import { toast } from "react-toastify";
import AuthContext from "@/context/AuthContext";

const MailFormLink = () => {
  const { user } = useContext(AuthContext);
  const { control, handleSubmit, trigger } = useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const onSubmit = async (data: any) => {
    instance
      .post("/vendors/form/generate-vendor-id", {
        email: data.email,
        mailFooter: `<br/><br/><div style="display:flex;gap:20px"><img src="https://jobs.shinpoengineering.com/email.png" alt="Shinpo Engineering Pte Ltd" style="margin-right:10px;width:150px;height:65px"/><div><p style="font-weight: 700;color:#008ac9;font-size:20;margin:0">${user?.fullname}</p>Shinpo Engineering Pte. Ltd.<br/><br/><p style="margin:0;padding:0">${user?.designation}</p><p style="margin:0;padding:0">${user?.phone}</p><p style="margin:0;padding:0;color:#008ac9;">Email: purchase@shinpoengineering.com</p><p style="color:#008ac9;padding:0;margin:0;">1 Tuas South Avenue 6 #05-20
        The Westcom Singapore 637021</p>Tel: +65 65399007<br/>www.shinpoengineering.com
        </div></div>`,
      })
      .then((res) => {
        toast.success("Invitation link sent");
      })
      .catch((err) => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        setModalOpen(false);
      });
  };

  return (
    <>
      <Button
        className="!text-black rounded-none bg-transparent hover:bg-gray-100"
        onClick={() => setModalOpen(true)}
      >
        Send Invitation Link to Vendor
      </Button>
      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
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
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
          onClick={(e: any) => {
            e.stopPropagation();
          }}
          component={"form"}
        >
          <FormControl
            fullWidth
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <FormInputText
              name="email"
              label="Email"
              control={control}
              endAdornment={<IoMdMail />}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Email must be valid",
                },
              }}
            />
            <Button
              className="bg-yellow-500 text-white"
              onClick={() =>
                trigger().then((noErrors) => {
                  if (!noErrors) return;
                  handleSubmit(onSubmit)();
                })
              }
            >
              Send Invitation Link
            </Button>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
};

export default MailFormLink;
