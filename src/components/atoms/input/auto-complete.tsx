import React, { ChangeEvent } from "react";
import { Controller, RegisterOptions, FieldValues } from "react-hook-form";
import { TextField, Autocomplete, Checkbox } from "@mui/material";

const FormInputAutoComplete = ({
  title,
  label,
  control,
  options,
  rules,
  required,
  isOptionEqualToValue,
  className,
  disabled,
  defaultValue,
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
  defaultValue?: any;
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
            multiple
            defaultValue={defaultValue}
            options={options}
            disableCloseOnSelect
            value={value}
            isOptionEqualToValue={isOptionEqualToValue}
            getOptionLabel={(option: { id: any; title: string }) =>
              option.title
            }
            renderOption={(props, option) => (
              <li {...props}>
                <Checkbox
                  checked={value.findIndex((v: any) => v.id === option.id) > -1}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    onChange(
                      event.target.checked
                        ? [...value, option]
                        : value.filter((v: any) => v.id !== option.id)
                    );
                  }}
                />
                {option.title}
              </li>
            )}
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

export default FormInputAutoComplete;
