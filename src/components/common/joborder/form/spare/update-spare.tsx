import React from "react";
import { Button, FormControl, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

const UpdateSpareForm = ({
  onClose,
  spare,
  onSpareUpdate,
}: {
  onClose: () => void;
  spare: any;
  onSpareUpdate: (updatedSpare: any) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      title: spare.title,
      description: spare.description,
      quantity: spare.quantity,
    },
  });

  const onSubmit = (data: any) => {
    onSpareUpdate({ ...data, id: spare.id });
    onClose();
  };
  return (
    <FormControl fullWidth component="form">
      <TextField
        label="Title"
        variant="outlined"
        margin="normal"
        fullWidth
        {...register("title")}
      />
      <TextField
        label="Description"
        variant="outlined"
        margin="normal"
        fullWidth
        {...register("description")}
      />
      <TextField
        label="Quantity"
        variant="outlined"
        margin="normal"
        fullWidth
        {...register("quantity")}
      />
      <Button
        variant="outlined"
        sx={{ mt: 2 }}
        onClick={() => {
          handleSubmit(onSubmit)();
          onClose();
        }}
        disabled={!isDirty}
      >
        Update
      </Button>
    </FormControl>
  );
};

export default UpdateSpareForm;
