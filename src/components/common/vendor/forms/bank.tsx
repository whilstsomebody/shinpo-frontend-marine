import FormInputText from "@/components/atoms/input/text";
import { FormControl } from "@mui/material";
import FormHeading from "@/components/atoms/heading/form-heading";
import React from "react";
import InputGroup from "@/components/atoms/input/input-group";

interface BankDetailsProperties {
  control: any;
}

const BankDetails: React.FC<BankDetailsProperties> = ({ control }) => {
  return (
    <FormControl
      fullWidth
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <FormInputText label="Bank Name" name="bankName" control={control} />
      <InputGroup inputs={2}>
        <FormInputText
          label="Bank Country"
          name="bankcountry"
          control={control}
        />
        <FormInputText
          label="Bank Code / Routing Number"
          name="bankcode"
          control={control}
        />
      </InputGroup>
      <FormInputText
        label="Bank Account Name"
        name="accountname"
        control={control}
      />
      <InputGroup inputs={3}>
        <FormInputText
          label="Bank Account Number"
          name="accountnumber"
          control={control}
        />
        <FormInputText
          label="Swift Code / DFI Number"
          name="swiftcode"
          control={control}
        />
        <FormInputText
          label="IBAN Number"
          name="ibannumber"
          control={control}
        />
      </InputGroup>
    </FormControl>
  );
};

export default BankDetails;
