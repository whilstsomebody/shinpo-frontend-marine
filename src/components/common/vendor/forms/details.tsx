import FormInputText from "@/components/atoms/input/text";
import { FormControl } from "@mui/material";
import FormHeading from "@/components/atoms/heading/form-heading";
import React from "react";
import InputGroup from "@/components/atoms/input/input-group";
import axios from "axios";
import FormInputSelect from "@/components/atoms/input/select";

interface VendorDetailsProperties {
  control: any;
}

const VendorDetails: React.FC<VendorDetailsProperties> = ({ control }) => {
  const [countries, setCountries] = React.useState([]);

  React.useEffect(() => {
    axios.get("https://restcountries.com/v3.1/all?fields=name").then((res) => {
      setCountries(
        res.data.map((country: any) => {
          return {
            id: country.name.common,
            name: country.name.common,
          };
        })
      );
    });
  }, []);
  return (
    <FormControl
      fullWidth
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <FormInputText
        label="Legal Name of Vendor"
        required
        name="name"
        control={control}
        rules={{ required: "This field is required" }}
      />
      <InputGroup inputs={2}>
        <FormInputText
          label="Vendor Email"
          name="email"
          control={control}
          required
          rules={{
            required: "This field is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          }}
        />
        <FormInputText
          label="Tax and Business Registration Number"
          name="regNumber"
          control={control}
        />
      </InputGroup>
      <FormHeading heading="Address" />
      <FormInputText
        label="Address"
        name="address"
        multiline
        rows={3}
        required
        control={control}
        rules={{ required: "This field is required" }}
      />
      <InputGroup inputs={2}>
        <FormInputText label="City" name="city" control={control} />
        <FormInputText label="Postal Code" name="zip" control={control} />
      </InputGroup>
      <FormInputSelect
        id="country"
        options={countries}
        label="Country"
        name="country"
        control={control}
      />
    </FormControl>
  );
};

export default VendorDetails;
