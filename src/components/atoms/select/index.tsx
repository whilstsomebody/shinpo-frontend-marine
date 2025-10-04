import React, { forwardRef } from "react";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FormControl, MenuItem } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import clsx from "clsx";

interface SelectInputProperties {
  label?: string;
  className?: string;
  value?: string;
  onChange?: (event: SelectChangeEvent) => void;
  disabled?: boolean;
  fetchFunction: () => Promise<string[]>;
}

export default forwardRef(function SelectInput(
  {
    label,
    fetchFunction,
    className,
    value,
    onChange,
    disabled,
  }: SelectInputProperties,
  ref: any
) {
  const [options, setOptions] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchOptions = async () => {
      const fetchedOptions = await fetchFunction();
      setOptions(fetchedOptions);
    };
    fetchOptions();
  }, [fetchFunction]);

  return (
    <FormControl className="myclass w-full">
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        id="demo-simple-select"
        value={value}
        onChange={onChange}
        label={label}
        ref={ref}
        className={clsx("text-black", className)}
        disabled={disabled}
      >
        {options.map((option, index) => (
          <MenuItem value={option} key={index}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
});
