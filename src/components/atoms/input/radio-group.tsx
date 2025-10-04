import React from "react";
import { Controller, RegisterOptions, FieldValues } from "react-hook-form";
import {
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

interface FormInputRadioGroupProperties {
  labels: { label: string; value: string }[];
  name: string;
  control: any;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
  label: string;
  required?: boolean;
}

const FormInputRadioGroup: React.FC<FormInputRadioGroupProperties> = ({
  labels,
  name,
  control,
  rules,
  label,
  required,
}) => {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <FormLabel component="legend" required={required}>
            {label}
          </FormLabel>
          <RadioGroup
            row
            aria-label={name}
            name={name}
            value={value}
            onChange={onChange}
          >
            {labels.map(({ label, value }) => (
              <FormControlLabel
                key={label}
                value={value}
                control={<Radio />}
                label={label}
              />
            ))}
          </RadioGroup>
          <FormHelperText error={!!error}>{error?.message}</FormHelperText>
        </>
      )}
    />
  );
};

export default FormInputRadioGroup;
