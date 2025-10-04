import React from "react";
import { Controller } from "react-hook-form";
import { FormControlLabel, Checkbox } from "@mui/material";

interface FormInputCheckboxProperties {
  name: string;
  control: any;
  label: string;
  required?: boolean;
}

const FormInputCheckbox: React.FC<FormInputCheckboxProperties> = ({
  name,
  control,
  label,
  required,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={value}
              required={required}
              onChange={(e) => onChange(e.target.checked)}
            />
          }
          label={label}
        />
      )}
    />
  );
};

export default FormInputCheckbox;
