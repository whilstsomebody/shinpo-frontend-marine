import React from "react";
import { Controller, FieldValues, RegisterOptions } from "react-hook-form";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const FormInputDate = ({
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
          <DatePicker
            className={className}
            label={label}
            value={value}
            format="DD/MM/YYYY"
            {...(value && { value: dayjs(value as Date) })}
            onChange={(value: any) => {
              if (!value) return onChange(null);
              var os = value.$d.getTimezoneOffset() * 60 * 1000;
              var date = new Date(value.$d.getTime() - os);
              onChange(date);
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

export default FormInputDate;
