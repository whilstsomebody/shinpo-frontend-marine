import React, { useEffect } from "react";
import { Button, FormControl, FormGroup } from "@mui/material";
import FormHeading from "@/components/atoms/heading/form-heading";
import FormInputText from "@/components/atoms/input/text";
import InputGroup from "@/components/atoms/input/input-group";
import FormInputRadioGroup from "@/components/atoms/input/radio-group";
import instance from "@/config/axios.config";
import parseAttributes from "@/utils/parse-data";
import { useForm } from "react-hook-form";
import FormInputAutoComplete from "@/components/atoms/input/auto-complete";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

interface VendorDetailFormProperties {
  data: any;
  mode: "view" | "edit";
}

const VendorDetailForm: React.FC<VendorDetailFormProperties> = ({
  mode,
  data,
}) => {
  const router = useRouter();
  const { handleSubmit, control } = useForm({
    defaultValues: data || {},
  });
  const { id } = data || {};
  const [categories, setCategories] = React.useState([]);

  useEffect(() => {
    instance
      .get("/services?pagination[page]=1&pagination[pageSize]=1000")
      .then((res) => {
        setCategories(parseAttributes(res.data.data));
      });
  }, []);

  const onSubmit = (data: any) => {
    instance
      .put(`/vendors/${id}`, {
        data: {
          ...data,
          salescontact: {
            name: data.salesname,
            mail: data.salesemail,
            mobile: data.salesmobile,
            landline: data.saleslandline,
          },
          accountscontact: {
            name: data.accountsname,
            mail: data.accountsemail,
            mobile: data.accountsmobile,
            landline: data.accountslandline,
          },
          emergencycontact: {
            name: data.emergencyname,
            mail: data.emergencyemail,
            mobile: data.emergencymobile,
            landline: data.emergencylandline,
          },
        },
      })
      .then(() => {
        router.push("/vendor");
        toast.success("Vendor updated successfully");
      })
      .catch((err) => {
        console.warn(err);
        toast.error("Something went wrong");
      });
  };

  return (
    <FormControl
      fullWidth
      sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormHeading heading="Vendor Details" />
      <FormInputText
        name="name"
        control={control}
        rules={{ required: "This field is required" }}
        label="Legal Name of Vendor"
        readOnly={mode === "view"}
      />
      <FormInputText
        name="regNumber"
        control={control}
        rules={{ required: "This field is required" }}
        label="Tax and Business Registration Number"
        readOnly={mode === "view"}
      />
      <FormInputText
        multiline
        rows={3}
        name="address"
        control={control}
        rules={{ required: "This field is required" }}
        label="Address"
        readOnly={mode === "view"}
      />
      <InputGroup inputs={3}>
        <FormInputText
          name="city"
          control={control}
          label="City"
          readOnly={mode === "view"}
        />
        <FormInputText
          name="zip"
          control={control}
          label="Postal Code"
          readOnly={mode === "view"}
        />
        <FormInputText
          name="country"
          control={control}
          rules={{ required: "This field is required" }}
          label="Country"
          readOnly={mode === "view"}
        />
      </InputGroup>
      <FormHeading heading="Contact Details" />
      <InputGroup inputs={3}>
        <FormInputText
          name="salesName"
          control={control}
          rules={{ required: "This field is required" }}
          label="Sales Incharge Name"
          readOnly={mode === "view"}
        />
        <FormInputText
          name="salesMobile"
          control={control}
          rules={{ required: "This field is required" }}
          label="Sales Incharge Number"
          readOnly={mode === "view"}
        />
        <FormInputText
          name="salesEmail"
          control={control}
          rules={{ required: "This field is required" }}
          label="Sales Incharge Email"
          readOnly={mode === "view"}
        />
      </InputGroup>
      <InputGroup inputs={3}>
        <FormInputText
          name="accountsName"
          control={control}
          rules={{ required: "This field is required" }}
          label="Accounts Incharge Name"
          readOnly={mode === "view"}
        />
        <FormInputText
          name="accountsMobile"
          control={control}
          rules={{ required: "This field is required" }}
          label="Accounts Incharge Number"
          readOnly={mode === "view"}
        />
        <FormInputText
          name="accountsEmail"
          control={control}
          rules={{ required: "This field is required" }}
          label="Accounts Incharge Email"
          readOnly={mode === "view"}
        />
      </InputGroup>
      <InputGroup inputs={3}>
        <FormInputText
          name="emergencyName"
          control={control}
          label="Emergency Contact Name"
          readOnly={mode === "view"}
        />
        <FormInputText
          name="emergencyMobile"
          control={control}
          label="Emergency Contact Number"
          readOnly={mode === "view"}
        />
        <FormInputText
          name="emergencyEmail"
          control={control}
          label="Emergency Contact Email"
          readOnly={mode === "view"}
        />
      </InputGroup>
      <FormHeading heading="Bank Details" />
      <InputGroup inputs={2}>
        <FormInputText
          name="bankname"
          control={control}
          label="Bank Name"
          readOnly={mode === "view"}
        />
        <FormInputText
          name="bankcountry"
          control={control}
          label="Bank Country"
          readOnly={mode === "view"}
        />
      </InputGroup>
      <FormInputText
        name="accountname"
        control={control}
        label="Bank Account Name"
        readOnly={mode === "view"}
      />
      <InputGroup inputs={4}>
        <FormInputText
          name="accountnumber"
          control={control}
          label="Bank Account Number"
          readOnly={mode === "view"}
        />
        <FormInputText
          name="swiftcode"
          control={control}
          label="Swift Code / DFI Number"
          readOnly={mode === "view"}
        />
        <FormInputText
          name="bankcode"
          control={control}
          // rules={{ required: "This field is required" }}
          label="Bank Code / Routing Number"
          readOnly={mode === "view"}
        />
        <FormInputText
          name="ibannumber"
          control={control}
          // rules={{ required: "This field is required" }}
          label="IBAN Number"
        />
      </InputGroup>
      <FormHeading heading="Commercial Details" />
      <InputGroup inputs={3}>
        <FormInputText
          name="payterms"
          control={control}
          label="Payment Terms"
        />
        <FormInputText
          name="paymethod"
          control={control}
          label="Primary Currency"
        />
        <FormInputText
          name="freightterms"
          control={control}
          label="Freight Terms"
        />
      </InputGroup>
      <FormInputRadioGroup
        label="Ownership Type"
        required
        labels={[
          { value: "PUBLIC", label: "Public" },
          { value: "PRIVATE", label: "Private" },
          { value: "GOVERNMENTOWNED", label: "Government Owned" },
        ]}
        name="ownership"
        control={control}
      />
      <FormHeading heading="Category" />
      <FormInputAutoComplete
        title="services"
        control={control}
        label="Category"
        options={categories}
      />
      {mode == "edit" && (
        <Button
          variant="contained"
          className="bg-primary-bright-blue"
          type="submit"
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
        >
          Submit
        </Button>
      )}
    </FormControl>
  );
};

export default VendorDetailForm;
