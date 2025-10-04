import FormInputText from "@/components/atoms/input/text";
import FormHeading from "@/components/atoms/heading/form-heading";
import { FormControl } from "@mui/material";
import React from "react";
import InputGroup from "@/components/atoms/input/input-group";

interface ContactDetailsProperties {
  control: any;
}

const ContactDetails: React.FC<ContactDetailsProperties> = ({ control }) => {
  return (
    <FormControl
      fullWidth
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <FormHeading heading="Sales Incharge" />
      <FormInputText
        label="Contact Name Title"
        name="salesname"
        required
        control={control}
        rules={{ required: "This field is required" }}
      />
      <InputGroup inputs={2}>
        <FormInputText
          label="Mobile Number"
          name="salesmobile"
          control={control}
          rules={{
            pattern: {
              value: /^[0-9]*$/i,
              message: "Only numbers are allowed",
            },
          }}
        />
        <FormInputText
          label="Land Line Number"
          name="saleslandline"
          control={control}
          rules={{
            pattern: {
              value: /^[0-9]*$/i,
              message: "Only numbers are allowed",
            },
          }}
        />
      </InputGroup>
      <FormInputText
        label="Email Address"
        name="salesemail"
        required
        control={control}
        rules={{
          required: "This field is required",
          pattern: {
            value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
            message: "Invalid email address",
          },
        }}
      />
      <FormHeading heading="Emergency Contact" />
      <InputGroup inputs={2}>
        <FormInputText
          label="Emergency Contact Person Name"
          name="emergencyname"
          control={control}
        />
        <FormInputText
          label="Emergency Contact Number"
          name="emergencymobile"
          control={control}
        />
        <FormInputText
          label="Emergency Contact Email"
          name="emergencyemail"
          control={control}
          rules={{
            pattern: {
              value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
              message: "Invalid email address",
            },
          }}
        />
        <FormInputText
          label="Emergency Contact Landline"
          name="emergencylandline"
          control={control}
        />
      </InputGroup>
      <FormHeading heading="Receivables" />
      <FormInputText
        label="Contact Name Title"
        required
        name="accountsname"
        control={control}
        rules={{ required: "This field is required" }}
      />
      <InputGroup inputs={2}>
        <FormInputText
          label="Mobile Number"
          name="accountsmobile"
          control={control}
          rules={{
            pattern: {
              value: /^[0-9]*$/i,
              message: "Only numbers are allowed",
            },
          }}
        />
        <FormInputText
          label="Land Line Number"
          name="accountslandline"
          control={control}
        />
      </InputGroup>
      <FormInputText
        label="Email Address"
        name="accountsemail"
        control={control}
        required
        rules={{
          required: "This field is required",
          pattern: {
            value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
            message: "Invalid email address",
          },
        }}
      />
    </FormControl>
  );
};

export default ContactDetails;
