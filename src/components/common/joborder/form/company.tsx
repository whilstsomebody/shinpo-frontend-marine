import FormInputText from "@/components/atoms/input/text";
import instance from "@/config/axios.config";
import { Box, FormControl, Typography, Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface CompanyFormProps {
  callback: () => void;
  onClose: () => void;
}

const CompanyForm = ({ callback, onClose }: CompanyFormProps) => {
  const { handleSubmit, control, trigger } = useForm({
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
    },
  });

  const onSubmit = (data: any) => {
    trigger().then((res) => {
      instance
        .post("/companies", {
          data,
        })
        .then((res) => {
          toast.success("Company Added Successfully", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
            pauseOnHover: true,
          });
        })
        .catch((err) => {
          toast.error("Error Adding Company", {
            position: "top-right",
            autoClose: 3000,
            theme: "colored",
            pauseOnHover: true,
          });
        })
        .finally(() => {
          callback();
          onClose();
        });
    });
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
        title="Company Form"
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
        <FormInputText
          name="name"
          label="Company Name"
          control={control}
          required
          rules={{
            required: {
              value: true,
              message: "Company Name is required",
            },
          }}
        />
        <FormInputText name="address" label="Address" control={control} />
        <FormInputText name="city" label="City" control={control} />
        <FormInputText name="state" label="State" control={control} />
        <FormInputText name="country" label="Country" control={control} />
        <Button
          onClick={handleSubmit(onSubmit)}
          type="submit"
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

export default CompanyForm;
