import React, { useState, useEffect } from "react";
import {
  FormControl,
  MenuItem,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import { Controller, FieldValues, RegisterOptions } from "react-hook-form";

const FormInputSelect = ({
  id,
  name,
  control,
  options,
  label,
  fullWidth,
  className,
  disabled,
  rules,
  size = "medium",
}: {
  id: string;
  name: string;
  control: any;
  options: { id: any; name: string }[];
  label?: string;
  className?: string;
  size?: "small" | "medium";
  fullWidth?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  rules?: Omit<
    RegisterOptions<FieldValues, string>,
    "disabled" | "valueAsNumber" | "valueAsDate" | "setValueAs"
  >;
}) => {
  const generateSingleOptions = () => {
    return options.map(
      (
        option: {
          id: any;
          name: string;
        },
        index
      ) => {
        return (
          <MenuItem key={index} value={option.id}>
            {option.name}
          </MenuItem>
        );
      }
    );
  };
  return (
    <FormControl>
      <InputLabel id={id}>{label}</InputLabel>
      <Controller
        name={name}
        rules={rules}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => {
          return (
            <>
              <Select
                label={label}
                disabled={disabled}
                fullWidth={fullWidth}
                value={value}
                size={size}
                onChange={onChange}
                id={id}
                className={className}
                error={!!error}
              >
                {generateSingleOptions()}
              </Select>
              <FormHelperText error={!!error}>{error?.message}</FormHelperText>
            </>
          );
        }}
      />
    </FormControl>
  );
};

export default FormInputSelect;
