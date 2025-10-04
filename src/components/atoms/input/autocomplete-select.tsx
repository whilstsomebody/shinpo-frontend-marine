import React, { ChangeEvent } from "react";
import { Controller, RegisterOptions, FieldValues } from "react-hook-form";
import { TextField, Autocomplete } from "@mui/material";

const FormInputAutoCompleteSelect = ({
  title,
  label,
  control,
  options,
  rules,
  required,
  isOptionEqualToValue,
  className,
  disabled,
}: {
  title: string;
  label: string;
  control: any;
  options: {
    id: any;
    title: string;
  }[];
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
  required?: boolean;
  isOptionEqualToValue?: (
    option: {
      id: any;
      title: string;
    },
    value: {
      id: any;
      title: string;
    }
  ) => boolean;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <Controller
      name={title}
      rules={rules}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        if (!value) {
          value = [];
        }
        return (
          <Autocomplete
            disabled={disabled}
            loading={options.length === 0}
            options={options}
            value={value}
            isOptionEqualToValue={isOptionEqualToValue}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                variant="outlined"
                value={value}
                error={!!error}
                className={className}
                required={required}
                helperText={error ? error.message : null}
              />
            )}
            onChange={(_, data) => onChange(data)}
          />
        );
      }}
    />
  );
};

export default FormInputAutoCompleteSelect;
