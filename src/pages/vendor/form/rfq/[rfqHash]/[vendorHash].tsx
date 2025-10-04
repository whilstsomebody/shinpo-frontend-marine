import React, { useEffect } from "react";
import instance from "@/config/axios.config";
import { decrypt } from "@/utils/crypt";
import { GetServerSideProps } from "next";
import Header from "@/components/layout/header/rfq";
import parseAttributes from "@/utils/parse-data";
import { Button, InputLabel, TextField } from "@mui/material";
import { Form, useForm } from "react-hook-form";
import Head from "next/head";
import LoadingButton from "@mui/lab/LoadingButton";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import createAckPDF from "@/utils/create-rfq-ack";
import downloadBlob from "@/utils/download-utils";
import FormInputSelect from "@/components/atoms/input/select";

type PageProps = {
  rfqs: any[];
  job: JobType;
};

type RFQReplyFormType = {
  rfqs: {
    id: number;
    unitPrice: number | null;
    quantity: {
      value: number;
      unit?: string;
    };
    spare: {
      id: number;
      title: string;
      description: string;
      attachments: any[];
      quantity: number;
      quantityUnit: string;
    };
    total: number;
    vendor: VendorType;
  }[];
  common: {
    selected: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: any;
    discount: number;
    delivery: number;
    amount: number;
    deliveryTime: any;
    connectTime: any;
    connectPort: any;
    remark: any;
    quality: string;
    currency: string;
  };
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const downloadAttachments = async (spare: any) => {
  toast.loading("Preparing attachments");
  try {
    const data = await instance.get(`/spare/${spare.id}/attachments`, {
      responseType: "blob",
      timeout: 30000,
    });
    toast.dismiss();
    const attachments = data.data;
    downloadBlob(attachments, `${spare.title}-attachments.zip`);
  } catch (err) {
    toast.dismiss();
    toast.error(
      "Failed to download attachments\n" +
        (err instanceof Error ? err.message : ""),
      {
        autoClose: 10000,
      }
    );
  }
};

export default function RfqHash(props: PageProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RFQReplyFormType>({
    defaultValues: {
      rfqs: props.rfqs.map((rfq) => ({
        unitPrice: null,
        spare: {
          id: rfq.spare.id,
          title: rfq.spare.title,
          description: rfq.spare.description,
          attachments: rfq.spare.attachments,
          quantity: rfq.spare.quantity,
          quantityUnit: rfq.spare.quantityUnit,
        },
        vendor: rfq.vendor,
      })),
    },
  });

  const [loading, setLoading] = React.useState<boolean>(false);
  const [referenceNumber, setReferenceNumber] = React.useState<string>("");

  const unitPrices = watch("rfqs", []).map((rfq) => rfq.unitPrice);
  const quantities = watch("rfqs", []).map((rfq) => rfq.spare.quantity);
  const discount = watch("common.discount", 0);
  const delivery = watch("common.delivery", 0);

  const total = unitPrices.reduce((acc, cur, index) => {
    if (cur && quantities[index]) {
      return (acc ?? 0) + cur * quantities[index];
    }
    return acc;
  }, 0);

  const router = useRouter();

  useEffect(() => {
    setValue(
      "common.amount",
      (total || 0) - ((total || 0) * discount) / 100 + delivery
    );
  }, [total, discount, delivery]);

  const onSubmit = async (data: RFQReplyFormType) => {
    setLoading(true);
    try {
      for (let i = 0; i < data.rfqs.length; i++) {
        await instance.put(`/rfqs/${props.rfqs[i].id}`, {
          data: {
            unitPrice: (() => {
              const unitPrice = data.rfqs[i].unitPrice;
              if (unitPrice) {
                return unitPrice;
              }
              return null;
            })(),
            quantity: data.rfqs[i].quantity,
            remark: data.common.remark,
            discount: data.common.discount,
            delivery: data.common.delivery,
            connectPort: data.common.connectPort,
            connectTime: data.common.connectTime,
            total: 0,
            amount: data.common.amount,
            currencyCode: data.common.currency,
            quality: data.common.quality,
            filled: true,
          },
        });
      }
      const mailBody = `Dear Sir<br/><br/>Good Day!<br/><br/>We hereby acknowledge the receipt of the attached quotes. The provided information is currently under review, and we will revert to you with our confirmation with  a purchase order, if deemed suitable.<br/><br/>Regards<br/><br/>Team Shinpo`;
      const subject = `Acknowledgement of Quotes - ${props.job.jobCode}`;
      const pdf = await createAckPDF({
        shipName: props.job.shipName,
        spareDetails: data.rfqs.map((rfq) => ({
          title: rfq.spare.title,
          description: rfq.spare.description,
          quantity: `${rfq.spare.quantity}`,
          quantityUnit: `${rfq.spare.quantityUnit}`,
          unitPrice: rfq.unitPrice,
        })),
        jobCode: props.job.jobCode,
        portOfDelivery: props.job.targetPort,
        description: props.job.description || "No Description Available",
        vendor: props.rfqs[0].vendor,
        connectPort: data.common.connectPort,
        deliveryCharge: data.common.delivery,
        discount: data.common.discount,
        deliveryTime: data.common.connectTime,
        remarks: data.common.remark,
        reference: referenceNumber,
        grandTotal: data.common.amount,
        subtotal: total ?? 0,
        currencyCode: data.common.currency,
      });
      const formData = new FormData();
      formData.append("vendorId", props.rfqs[0].vendor.id);
      formData.append("attachment", pdf, `acknowledgement.pdf`);
      formData.append("subject", subject);
      formData.append("mailBody", mailBody);

      await instance.post(`/rfq/${props.rfqs[0].RFQNumber}/send-ack`, formData);
      router.push("/vendor/form/rfq/success");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit quotation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-rows-[1fr,auto]">
      <Head>
        <title>Vendor Requisition Form</title>
        <meta name="description" content="Vendor Requisition Form" />
      </Head>
      <Header />
      <main className="p-8">
        <p className="text-gray-500 text-lg">
          We would appreciate if you could kindly give us your Best Quotation by
          filling in the form below and clicking the{" "}
          <span className="font-bold italic">Submit Quotation</span> Button
          while connected to the Internet. Please indicate packing expenses
          expected if any. If no packing expense is mentioned separately, it
          will be assumed that packing expense is included in the quoted prices.
          <span className="font-bold italic">
            {" "}
            If you don&apos;t have any item mentioned below, please leave the
            respective field blank.
          </span>
        </p>
        <table className="table-auto w-full mt-8">
          <tbody className="border-b-2 border-gray-200">
            <tr className="text-gray-500">
              <td className="py-4 font-bold">RFQ Number:</td>
              <td className="py-4">{props.rfqs[0].RFQNumber}</td>
            </tr>
            <tr className="text-gray-500">
              <td className="py-4 font-bold">Ship Name:</td>
              <td className="py-4">{props.job.shipName}</td>
            </tr>
            <tr className="text-gray-500">
              <td className="py-4 font-bold">Description:</td>
              <td className="py-4">{props.job.description}</td>
            </tr>
            <tr className="text-gray-500">
              <td className="py-4 font-bold">Port Of Delivery:</td>
              <td className="py-4">{props.job.targetPort}</td>
            </tr>
            {props.rfqs[0].spare.make && (
              <tr className="text-gray-500">
                <td className="py-4 font-bold">Make:</td>
                <td className="py-4">{props.rfqs[0].spare.make}</td>
              </tr>
            )}
            {props.rfqs[0].spare.model && (
              <tr className="text-gray-500">
                <td className="py-4 font-bold">Make:</td>
                <td className="py-4">{props.rfqs[0].spare.model}</td>
              </tr>
            )}
          </tbody>
        </table>
        <table className="table-auto w-full mt-8">
          <thead className="border-b-2 border-gray-200">
            <tr className="text-gray-500">
              <th className="py-4 font-bold">No.</th>
              <th className="py-4 font-bold">Item Name</th>
              <th className="py-4 font-bold">Description</th>
              <th className="py-4 font-bold">Attachments</th>
              <th className="py-4 font-bold">Ordered Quantity</th>
              <th className="py-4 font-bold">Unit Price</th>
            </tr>
          </thead>
          <tbody className="border-b-2 text-center border-gray-200">
            {props.rfqs.map((rfq, index) => (
              <tr
                key={rfq.id}
                className={index == props.rfqs.length - 1 ? "border-b-2" : ""}
              >
                <td className="py-4 w-[5%]">{index + 1}</td>
                <td className="py-4 w-[20%]">{rfq.spare.title}</td>
                <td className="py-4 w-[35%]">{rfq.spare.description}</td>
                <td className="py-4 w-[15%]">
                  <Button
                    onClick={() => downloadAttachments(rfq.spare)}
                    disabled={!Array.isArray(rfq.spare.attachments)}
                  >
                    Download Attatchments
                  </Button>
                </td>
                <td className="py-4 w-[8%]">
                  {rfq.spare.quantity} {rfq.spare.quantityUnit || ""}
                </td>
                <td className="py-4 w-[10%]">
                  <TextField
                    variant="outlined"
                    size="small"
                    type="number"
                    sx={{
                      "& .MuiInputBase-root": {
                        color: "gray",
                      },
                    }}
                    {...register(`rfqs.${index}.unitPrice`, {
                      setValueAs: (value) => {
                        if (value === "") return null;
                        return parseFloat(value);
                      },
                    })}
                    error={errors.rfqs?.[index]?.unitPrice ? true : false}
                    helperText={
                      errors.rfqs?.[index]?.unitPrice?.message as string
                    }
                  />
                </td>
              </tr>
            ))}
            <tr className="border-t-2">
              <td colSpan={5} className="py-4 text-right font-bold">
                <span className="mr-2">Total</span>
              </td>
              <td className="py-4">
                <TextField
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiInputBase-root": {
                      color: "gray",
                    },
                  }}
                  value={total}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="grid grid-cols-[auto,1fr] gap-4 max-w-md mt-8">
          <InputLabel className="text-gray-500">Your Reference:</InputLabel>
          <TextField
            variant="outlined"
            sx={{
              "& .MuiInputBase-root": {
                color: "gray",
              },
            }}
            size="small"
            className="flex-1"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
          />
          <InputLabel className="text-gray-500">
            Your Primary Currency:
          </InputLabel>
          <div className="w-full flex flex-col">
            <FormInputSelect
              size="small"
              options={[
                {
                  id: "USD",
                  name: "USD($)",
                },
                {
                  id: "SGD",
                  name: "SGD($)",
                },
                {
                  id: "INR",
                  name: "INR(₹)",
                },
                {
                  id: "AUD",
                  name: "AUD($)",
                },
                {
                  id: "EURO",
                  name: "EURO(€)",
                },
                {
                  id: "GBP",
                  name: "GBP(£)",
                },
                {
                  id: "JPY",
                  name: "JPY(¥)",
                },
                {
                  id: "CNY",
                  name: "CNY(¥)",
                },
                {
                  id: "MYR",
                  name: "MYR(RM)",
                },
              ]}
              control={control}
              name="common.currency"
              id="currency"
              rules={{
                required: "This field is required",
              }}
            />
          </div>
          <InputLabel className="text-gray-500">Discount:</InputLabel>
          <TextField
            variant="outlined"
            sx={{
              "& .MuiInputBase-root": {
                color: "gray",
              },
            }}
            InputProps={{
              endAdornment: "%",
            }}
            size="small"
            className="flex-1"
            {...register("common.discount", {
              setValueAs: (value) => {
                return parseFloat(value || "0.0");
              },
            })}
          />
          <InputLabel className="text-gray-500">Delivery Charge:</InputLabel>
          <TextField
            variant="outlined"
            sx={{
              "& .MuiInputBase-root": {
                color: "gray",
              },
            }}
            size="small"
            className="flex-1"
            {...register("common.delivery", {
              setValueAs: (value) => {
                return parseInt(value || "0");
              },
            })}
          />
          <InputLabel className="text-gray-500">Amount Payable:</InputLabel>
          <TextField
            variant="outlined"
            sx={{
              "& .MuiInputBase-root": {
                color: "gray",
              },
            }}
            size="small"
            className="flex-1"
            disabled
            {...register("common.amount", {
              setValueAs: (value) => {
                return parseFloat(value || "0.0");
              },
            })}
          />
          <InputLabel className="text-gray-500">Delivery Time:</InputLabel>
          <TextField
            variant="outlined"
            sx={{
              "& .MuiInputBase-root": {
                color: "gray",
              },
            }}
            InputProps={{
              endAdornment: "Days",
            }}
            size="small"
            className="flex-1"
            {...register("common.connectTime", {
              required: "This field is required",
              pattern: {
                value: /^[0-9]*$/,
                message: "Only numbers are allowed",
              },
            })}
          />
          <InputLabel className="text-gray-500">Quality of Spares:</InputLabel>
          <div className="w-full flex flex-col">
            <FormInputSelect
              size="small"
              options={[
                {
                  id: "OEM-JAPAN",
                  name: "OEM JAPAN",
                },
                {
                  id: "OEM-KOREA",
                  name: "OEM KOREA",
                },
                {
                  id: "OEM-CHINA",
                  name: "OEM CHINA",
                },
                {
                  id: "OTHEROEM",
                  name: "OTHER OEM",
                },
                {
                  id: "GENUINE",
                  name: "GENUINE",
                },
                {
                  id: "MAKERS",
                  name: "MAKERS",
                },
                {
                  id: "REPLACEMENT",
                  name: "REPLACEMENT",
                },
                {
                  id: "COMPATIBLE",
                  name: "COMPATIBLE",
                },
              ]}
              control={control}
              name="common.quality"
              id="quality"
              rules={{
                required: "This field is required",
              }}
            />
          </div>
          <InputLabel className="text-gray-500">Connect Port:</InputLabel>
          <TextField
            variant="outlined"
            sx={{
              "& .MuiInputBase-root": {
                color: "gray",
              },
            }}
            size="small"
            className="flex-1"
            {...register("common.connectPort", {
              required: "This field is required",
            })}
            error={errors.common?.connectPort ? true : false}
            helperText={errors.common?.connectPort?.message as string}
          />
          <InputLabel className="text-gray-500">Remarks:</InputLabel>
          <TextField
            variant="outlined"
            multiline
            rows={4}
            sx={{
              "& .MuiInputBase-root": {
                color: "gray",
              },
            }}
            size="small"
            className="flex-1"
            {...register("common.remark")}
          />
        </div>
        <div className="flex justify-end mt-8">
          <LoadingButton
            loading={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            onClick={handleSubmit(onSubmit)}
          >
            Submit Quotation
          </LoadingButton>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  try {
    // Get the rfq hash
    const rfqHash = context.params?.rfqHash;

    const vendorHash = context.params?.vendorHash;

    if (
      !rfqHash ||
      typeof rfqHash !== "string" ||
      !vendorHash ||
      typeof vendorHash !== "string"
    ) {
      return {
        notFound: true,
      };
    }

    const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
    if (!ENCRYPTION_KEY) {
      console.warn("ENCRYPTION_KEY is not set");
      return {
        notFound: true,
      };
    }

    const rfqNumber = decrypt(rfqHash, ENCRYPTION_KEY);
    const vendorId = parseInt(decrypt(vendorHash, ENCRYPTION_KEY));

    // Fetch the vendor
    const vendor = await instance.get(`/vendors/${vendorId}`);

    if (!vendor) {
      return {
        notFound: true,
      };
    }

    const rfqs = parseAttributes(
      (
        await instance.get(
          `/rfqs?filters[RFQNumber][$eq]=${rfqNumber}&filters[vendor][id][$eq]=${vendorId}&filters[filled][$ne]=true&populate[0]=spare.attachments&populate[1]=vendor`
        )
      ).data
    );

    if (!rfqs || rfqs.length === 0) {
      return {
        notFound: true,
      };
    }

    const job = parseAttributes(
      (await instance.get(`/jobs?filters[spares][id]=${rfqs[0].spare.id}`)).data
    );

    if (!job || job.length === 0) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        rfqs: rfqs,
        job: job[0],
      },
    };
  } catch (err) {
    if (err instanceof Error) {
      console.error(err);
    }
    return {
      notFound: true,
    };
  }
};
