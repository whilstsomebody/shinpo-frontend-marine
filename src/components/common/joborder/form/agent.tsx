import FormInputText from "@/components/atoms/input/text";
import { Box, FormControl, Typography, Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";

const Agent = () => {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      agentName: "",
      email: "",
      contact: "",
    },
  });
  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "35%",
        bgcolor: "background.paper",
        borderRadius: "5px",
        p: 4,
      }}
    >
      <FormControl
        fullWidth
        title="Agent Form"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Typography
          variant="h6"
          component="h2"
          gutterBottom
          className="text-center"
        >
          Add Company
        </Typography>
        <FormInputText name="agentName" label="Agent Name" control={control} />
        <FormInputText name="email" label="Email" control={control} />
        <FormInputText name="contact" label="Contact" control={control} />
        <Button
          variant="contained"
          fullWidth
          className="bg-primary-bright-blue"
        >
          Submit
        </Button>
      </FormControl>
    </Box>
  );
};

export default Agent;
