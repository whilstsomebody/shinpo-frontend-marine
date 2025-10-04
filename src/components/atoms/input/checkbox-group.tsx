import React from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { Controller } from "react-hook-form";

interface FormInputCheckboxGroupProperties {
  control: any;
  name: string;
  labels: { title: string; id: string }[];
}

const FormInputCheckboxGroup: React.FC<FormInputCheckboxGroupProperties> = ({
  control,
  name,
  labels,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        if (!value) {
          value = [];
        }
        return (
          <FormGroup>
            {labels.map((label, index) => (
              <FormControlLabel
                key={index}
                control={
                  <Checkbox
                    checked={value.includes(label.id)}
                    onChange={(e) =>
                      onChange(
                        e.target.checked
                          ? [...value, label.id]
                          : value.filter((id: string) => id !== label.id)
                      )
                    }
                  />
                }
                label={label.title}
              />
            ))}
          </FormGroup>
        );
      }}
    />
  );
};

export default FormInputCheckboxGroup;
