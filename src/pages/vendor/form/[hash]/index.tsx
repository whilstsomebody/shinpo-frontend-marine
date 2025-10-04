import Steps from "@/components/atoms/step";
import React from "react";
import { FaRegAddressCard } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";
import { Button, Typography } from "@mui/material";
import { BiSolidDetail } from "react-icons/bi";
import { useForm } from "react-hook-form";
import VendorDetails from "@/components/common/vendor/forms/details";
import ContactDetails from "@/components/common/vendor/forms/contact";
import BankDetails from "@/components/common/vendor/forms/bank";
import CommercialDetails from "@/components/common/vendor/forms/commercial";
import { GetServerSideProps } from "next";
import instance from "@/config/axios.config";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import Loading from "@/components/atoms/loading";

type VendorFormPageProps = {
  hash: string;
  vendorForm: VendorFormType;
};

export default dynamic(() => Promise.resolve(VendorFormPage), {
  ssr: false,
});

const VendorFormPage = ({ hash }: VendorFormPageProps) => {
  const cachedForm = JSON.parse(localStorage.getItem("vendorForm") || "{}") as
    | (VendorFormType & { step: number })
    | undefined;
  const { step: initStep, ...initValues } = cachedForm || {};

  const router = useRouter();

  const labels = [
    { label: "Vendor Details", icon: FaRegAddressCard },
    { label: "Contact Details", icon: FaPhone },
    { label: "Bank Details", icon: BsBank2 },
    { label: "Commercial & Company Details", icon: BiSolidDetail },
  ];
  const [activeStep, setActiveStep] = React.useState(initStep || 0);
  const [loading, setLoading] = React.useState(false);
  const { control, handleSubmit, getValues, trigger } = useForm({
    defaultValues: cachedForm ? initValues : {},
  });

  const onSubmit = (data: any) => {
    setLoading(true);
    instance
      .put(`/vendors/form/update/${hash}`, {
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
      })
      .then(() => {
        router.push("/vendor/form/success");
      })
      .catch((err) => {
        toast.error("Something went wrong");
      })
      .finally(() => {
        localStorage.removeItem("vendorForm");
        setLoading(false);
      });
  };

  const cacheData = async (step: number) => {
    // Store the form in local storage
    localStorage.setItem(
      "vendorForm",
      JSON.stringify({ ...getValues(), step })
    );
  };

  const stepcontrols = {
    nextStep: () => {
      cacheData(activeStep + 1);
      setActiveStep((prev) => prev + 1);
    },
    prevStep: () => {
      cacheData(activeStep);
      setActiveStep((prev) => prev - 1);
    },
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-8">
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          textTransform: "uppercase",
          color: "#2D2D2D",
          textDecoration: "underline",
          marginBottom: "2rem",
        }}
      >
        Shinpo Vendor Registration
      </Typography>
      <Steps steps={labels} activeStep={activeStep} />
      {(() => {
        switch (activeStep) {
          case 0:
            return <VendorDetails control={control} />;
          case 1:
            return <ContactDetails control={control} />;
          case 2:
            return <BankDetails control={control} />;
          case 3:
            return <CommercialDetails control={control} />;
          default:
            return null;
        }
      })()}
      <div className="flex gap-4 mt-6">
        {activeStep !== 0 && (
          <Button
            variant="contained"
            className="bg-gray-500 hover:bg-gray-600"
            onClick={stepcontrols.prevStep}
          >
            Previous
          </Button>
        )}
        {activeStep !== labels.length - 1 && (
          <Button
            variant="contained"
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => {
              trigger().then((noErrors) => {
                if (!noErrors) return;
                stepcontrols.nextStep();
              });
            }}
          >
            Next
          </Button>
        )}
        {activeStep === labels.length - 1 && (
          <Button
            variant="contained"
            className="bg-blue-500 hover:bg-blue-600"
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<
  VendorFormPageProps
> = async (context) => {
  // Get the hash from the URL
  const hash = context.params?.hash;

  if (!hash || typeof hash !== "string") {
    return {
      notFound: true,
    };
  }

  // Get the form data from the database
  let vendorForm;

  try {
    vendorForm = await instance.get(`/vendors/form/${hash}`);
    if (vendorForm.data.filled) throw new Error("Form already filled");
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      hash,
      vendorForm: vendorForm.data as VendorFormType,
    },
  };
};
