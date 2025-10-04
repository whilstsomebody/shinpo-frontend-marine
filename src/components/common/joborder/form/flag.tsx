import {
  Box,
  Button,
  FormControl,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React, { useContext, useState } from "react";
import { FaFlag } from "react-icons/fa";
import FormInputText from "../../../atoms/input/text";
import { useForm } from "react-hook-form";
import instance from "@/config/axios.config";
import { toast } from "react-toastify";
import FormInputDateTime from "../../../atoms/input/datetime";
import { NotificationContext } from "@/context/NotificationContext";

type FlagForm = {
  title: string;
  body: string;
  timestamp: string;
};

const FlagForm = ({ job }: { job: JobType }) => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, isDirty, isValid },
  } = useForm<FlagForm>({
    defaultValues: {
      body: job.notification?.body || "",
      title: job.notification?.title || "",
      timestamp: job.notification?.timestamp
        ? job.notification?.timestamp
        : undefined,
    },
    mode: "onChange",
  });

  const n = useContext(NotificationContext);

  const onSubmit = async (data: FlagForm) => {
    setLoading(true);
    try {
      await instance.put(`/jobs/${job.id}`, {
        data: {
          ...job,
          notification: {
            title: data.title,
            body: data.body,
            timestamp: data.timestamp,
            viewed: false,
          },
        },
      });
      toast.success("Job flagged!");
    } catch (err) {
      console.error(err);
      toast.error("Error flagging job!");
    } finally {
      setLoading(false);
      n.replaceNotification(job.id.toString(), {
        title: data.title,
        body: data.body,
        timestamp: data.timestamp,
        viewed: false,
      });
    }
  };

  let overdue = n.checkOverdue(job.id.toString());

  return (
    <Box
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        borderRadius: "10px",
        p: 2,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <FormControl
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            textTransform: "uppercase",
          }}
          variant="subtitle1"
          component="body"
        >
          Flag Job {job.jobCode}
        </Typography>
        <FormInputText
          label="Title"
          control={control}
          rules={{ required: true }}
          className="w-full"
          multiline
          rows={3}
          name="title"
        />
        <FormInputDateTime
          label="Reminder set for"
          className="w-full"
          rules={{ required: true }}
          control={control}
          name="timestamp"
        />
        <FormInputText
          label="Body"
          control={control}
          rules={{ required: true }}
          className="w-full"
          multiline
          rows={3}
          name="body"
        />
        <LoadingButton
          variant="contained"
          className="bg-red-600 hover:bg-red-700 w-full flex gap-1"
          onClick={handleSubmit(onSubmit)}
          loading={loading}
          disabled={!isDirty || !isValid}
        >
          <FaFlag />
          {overdue ? "Update" : "Flag"}
        </LoadingButton>
      </FormControl>
    </Box>
  );
};

export default FlagForm;
