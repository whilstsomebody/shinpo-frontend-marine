import React from "react";
import { Controller, FieldValues, RegisterOptions } from "react-hook-form";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const FormInputDateTime = ({
  name,
  label,
  control,
  className,
  rules,
}: {
  name: string;
  label: string;
  control: any;
  className?: string;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
}) => {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            className={className}
            label={label}
            value={value}
            format="DD/MM/YYYY hh:mm A"
            {...(value && { value: dayjs(value as Date) })}
            onChange={(value: any) => {
              onChange(value.$d.toISOString());
            }}
            slotProps={{
              textField: {
                helperText: error ? error.message : null,
                error: !!error,
              },
            }}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default FormInputDateTime;
