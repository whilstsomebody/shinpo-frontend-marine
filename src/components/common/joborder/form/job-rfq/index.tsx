import FormInputAutoComplete from "@/components/atoms/input/auto-complete";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { IoMdCloudUpload } from "react-icons/io";
import { parse } from "csv-parse";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm, useFieldArray, set } from "react-hook-form";
import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import instance from "@/config/axios.config";
import parseAttributes from "@/utils/parse-data";
import FormInputText from "@/components/atoms/input/text";
import FormHeading from "@/components/atoms/heading/form-heading";
import { MdDelete, MdAdd, MdEdit } from "react-icons/md";
import logo from "@/assets/image/logo.jpg";
import Image from "next/image";
import createRfqPdf from "@/utils/create-rfq-pdf";
import { toast } from "react-toastify";
import SpareCard from "@/components/atoms/card/spare-card";
import MultiFileInput from "@/components/atoms/input/multiple-file";
import AuthContext from "@/context/AuthContext";
import axios from "axios";

const RFQForm = ({
  job,
  again,
  setModalOpen,
  refresh,
}: {
  again?: boolean;
  job: JobType;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: () => void;
}) => {
  const [vendors, setVendors] = React.useState<VendorType[]>([]);
  const [selectedVendors, setSelectedVendors] = React.useState<VendorType[]>(
    []
  );
  const [spares, setSpares] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [showVesselName, setShowVesselName] = React.useState(false);
  const [spareDetails, setSpareDetails] = React.useState<Omit<SpareType, "id">>(
    {
      title: "",
      description: "",
      quantity: "",
      attachments: null,
    }
  );
  const editing = useRef<number | null>(null);

  const { user } = useContext(AuthContext);

  const { control, handleSubmit, watch } = useForm<RFQFormType>({
    defaultValues: {
      jobId: job.id as string,
      description: job.description,
      vendors: [],
      shipName: job.shipName,
      make: job.spares[0]?.make || "",
      model: job.spares[0]?.model || "",
      spareDetails: [],
    },
  });

  const vendorsWatch = watch("vendors");

  useEffect(() => {
    instance
      .get(`/vendors?pagination[page]=1&pagination[pageSize]=1000`)
      .then((res) => {
        const data = parseAttributes(res.data.data);
        setVendors(data.filter((vendor: VendorType) => vendor.name));
      });
  }, []);

  useEffect(() => {
    instance.get(`/jobs/${job.id}?populate=rfqs`).then((res) => {
      const data = parseAttributes(res.data.data);
      const filteredVendors = data.rfqs.filter(
        (rfq: any, index: number, self: any) =>
          index ===
          self.findIndex(
            (t: any) => t.vendor.id === rfq.vendor.id && t.vendor.name
          )
      );
      setSelectedVendors(filteredVendors.map((rfq: any) => rfq.vendor));
    });
  }, []);

  const { fields, append, remove, update } = useFieldArray({
    name: "spareDetails",
    control,
  });

  useEffect(() => {
    instance.get(`/jobs/${job.id}?populate=spares.attachments`).then((res) => {
      const data = parseAttributes(res.data.data);
      console.log("spares", data.spares);
      setSpares(data.spares);
    });
  }, []);

  useEffect(() => {
    if (spares.length == 0) return;
    const sparesToAppend = spares.filter(
      (spare: any) => !fields.find((field) => field.title == spare.title)
    );
    append(sparesToAppend);
  }, [spares]);

  const baseUrl = location.origin;

  const onSubmit = async (data: RFQFormType) => {
    setLoading(true);
    for (let i = 0; i < data.vendors.length; i++) {
      const vendor = vendors.find((vendor) => vendor.id == data.vendors[i].id);
      if (!vendor) continue;
      const blob = await createRfqPdf({
        ...data,
        vendor,
        jobCode: job.jobCode,
        description: job.description || "N/A",
        portOfDelivery: job.targetPort,
        shipName: job.shipName,
        spareDetails: data.spareDetails,
      });
      data.vendors[i].attachment = blob;
    }

    const getLink = async (vendorId: number, rfqNumber: string) => {
      const { data } = await axios.post(`${baseUrl}/api/rfq-form-link`, {
        rfqNumber,
        vendorId: `${vendorId}`,
      });
      return data.link;
    };

    const vs = await Promise.allSettled(
      data.vendors.map(async ({ attachment, ...vendor }) => {
        const link = await getLink(vendor.id, `RFQ-${job.jobCode}`);

        return {
          ...vendor,
          ...(attachment ? { attachment: `${vendor.id}.pdf` } : {}),
          body: `Dear Sir / Madam<br/>
      Good day,<br/><br/>
      
      Kindly note attached requisition, please advise best price and availability of the requested parts.<br/><br/>
      
      <table style="width:80%;">
      <tr>
      <th style="padding: 8px;text-align: left;">RFQ Number:</th>
      <td style="style="padding: 8px;text-align: left;">RFQ-${job.jobCode}</td>
      </tr>
      <tr>
      <th style="padding: 8px;text-align: left;">Job Description:</th>
      <td style="style="padding: 8px;text-align: left;">${job.description}</td>
      </tr>
      ${
        showVesselName
          ? `<tr>
      <th style="padding: 8px;text-align: left;">Vessel Name:</th>
      <td style="style="padding: 8px;text-align: left;">${job.shipName}</td>
      </tr>`
          : ""
      }
      <tr>
      <th style="padding: 8px;text-align: left;">Port of Delivery:</th>
      <td style="style="padding: 8px;text-align: left;">${job.targetPort}</td>
      </tr>
      <tr>
      <th style="padding: 8px;text-align: left;">ETA:</th>
      <td style="style="padding: 8px;text-align: left;">${job.vesselETA}</td>
      </tr>
      ${
        data.make
          ? `<tr> 
      <th style="padding: 8px;text-align: left;">Maker:</th>
      <td style="style="padding: 8px;text-align: left;">${data.make}</td>
      </tr>`
          : ""
      }
      ${
        data.model
          ? `<tr>
      <th style="padding: 8px;text-align: left;">Model:</th>
      <td style="style="padding: 8px;text-align: left;">${data.model}</td>
      </tr>`
          : ""
      }
      </table> <br/><br/>
      <table style="width: 100%; border-collapse: collapse;">
  <tr>
    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Sl No.</th>
    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Item Name</th>
    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Description</th>
    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Quantity</th>
  </tr>
  ${data.spareDetails
    .map(
      (spare, index) => `
  <tr>
    <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${
      index + 1
    }</td>
    <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${
      spare.title
    }</td>
    <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${
      spare.description
    }</td>
    <td style="padding: 8px; text-align: left; border: 1px solid #ddd;">${
      spare.quantity
    } ${spare.quantityUnit || ""}</td>
  </tr>
  `
    )
    .join("")}
      </table> <br/><br/>
      Please place your offer online on <a href="${link}">this link</a>.<br/>
      In case you are hesitant in quoting through link or not able to open above link, kindly quote by replying this mail<br/><br/>
      <table style="width:80%;">
      <tr>
      <th style="padding: 8px;text-align: left;">Your Reference:</th>
      <td style="style="padding: 8px;text-align: left;"></td>
      </tr>
      <tr>
      <th style="padding: 8px;text-align: left;">Discount:</th>
      <td style="style="padding: 8px;text-align: left;"></td>
      </tr>
      <tr>
      <th style="padding: 8px;text-align: left;">Delivery Charge</th>
      <td style="style="padding: 8px;text-align: left;"></td>
      </tr>
      <tr>
      <th style="padding: 8px;text-align: left;">Delivery Time:</th>
      <td style="style="padding: 8px;text-align: left;"></td>
      </tr>
      <tr>
      <th style="padding: 8px;text-align: left;">Connect Port</th>
      <td style="style="padding: 8px;text-align: left;"></td>
      </tr>
      <tr>
      <th style="padding: 8px;text-align: left;">Remarks:</th>
      <td style="style="padding: 8px;text-align: left;"></td>
      </tr>
      </table> <br/><br/>
      We are looking forward to your offer and like to thank you for your assistance.<br/><br/><div style="display:flex;gap:20px"><img src="https://jobs.shinpoengineering.com/email.png" alt="Shinpo Engineering Pte Ltd" style="margin-right:10px;width:150px;height:65px"/><div><p style="font-weight: 700;color:#008ac9;font-size:20;margin:0">${
        user?.fullname
      }</p>Shinpo Engineering Pte. Ltd.<br/><br/><p style="margin:0;padding:0">${
            user?.designation
          }</p><p style="margin:0;padding:0">${
            user?.phone
          }</p><p style="margin:0;padding:0;color:#008ac9;">Email: purchase@shinpoengineering.com</p><p style="color:#008ac9;padding:0;margin:0;">1 Tuas South Avenue 6 #05-20 
      The Westcom Singapore 637021</p>Tel: +65 65399007<br/>www.shinpoengineering.com
      </div></div>`,
        };
      })
    );

    const form = new FormData();

    form.append("jobId", data.jobId);
    form.append("description", data.description);
    form.append("shipName", data.shipName);
    form.append(
      "vendors",
      JSON.stringify(vs.map((v) => (v.status === "fulfilled" ? v.value : "")))
    );
    if (!again) {
      form.append(
        "spareDetails",
        JSON.stringify(
          data.spareDetails.map(({ attachments, ...spare }) => ({
            attachments: attachments
              ? Array.from(attachments).map((attachment) => attachment.name)
              : undefined,
            ...spare,
            make: data.make,
            model: data.model,
          }))
        )
      );
    }
    if (!again) {
      data.spareDetails.forEach(({ attachments }) => {
        if (attachments) {
          Array.from(attachments).forEach((attachment) => {
            form.append("spareAttachments", attachment, attachment.name);
          });
        }
      });
    }

    try {
      await instance.post("/job/send-rfq", form);
      toast.success("RFQ Sent");
      setModalOpen(false);
      refresh();
    } catch (err) {
      toast.error("Failed to send RFQ");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setSpareDetails((prev) => ({
      ...prev,
      attachments: e.target.files,
    }));
  };

  const handleCSVUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (file.type !== "text/csv") {
      toast.error("Invalid file format. Please upload a CSV file");
      return;
    }
    const reader = new FileReader();
    reader.onload = async (e) => {
      const csv = e.target?.result as string;
      const records = await new Promise<Array<any>>((resolve, reject) => {
        parse(csv, { columns: true }, (err, records) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          resolve(records);
        });
      });
      const spares = records.map((record: any) => ({
        title: record["Spare Name"],
        description: record["Spare Description"],
        quantity: record["Quantity"],
        quantityUnit: record["Quantity Unit"],
      }));
      append(spares);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <FormControl
        fullWidth
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <div className="flex justify-between items-center border-b-2 pb-2">
          <Image src={logo} alt="logo" width={100} height={100} />
          <Typography variant="h5" sx={{ color: "#1bb1d8" }}>
            Vendor Requisition Form
            <small className="block text-sm">
              Shinpo Engineering PTE. LTD.
            </small>
            <small className="block text-sm">
              1 Tuas South Avenue 6, #05-20, S-637021
            </small>
          </Typography>
        </div>
        <FormInputAutoComplete
          control={control}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          title="vendors"
          label="Vendors"
          options={vendors
            .filter(
              (vendor) => !selectedVendors.find((v) => v.id === vendor.id)
            )
            .map((vendor) => ({ id: vendor.id, title: vendor.name }))}
        />
        <FormInputText
          control={control}
          name="shipName"
          label="Ship Name"
          disabled
        />
        <FormInputText
          control={control}
          name="make"
          label="Maker"
          disabled={again}
        />
        <FormInputText
          control={control}
          name="model"
          label="Model"
          disabled={again}
        />
        <div className="flex w-max items-center">
          <Checkbox
            checked={showVesselName}
            onChange={(e) => setShowVesselName(e.target.checked)}
          />
          <Typography>Show Vessel Name</Typography>
        </div>
        <div>
          <FormHeading heading="Item Details" />
          {!again && (
            <div className="flex justify-end">
              <input
                className="sr-only"
                id="file"
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
              />
              <label htmlFor="file">
                <Tooltip title="Upload CSV File">
                  <IconButton component="span">
                    <IoMdCloudUpload />
                  </IconButton>
                </Tooltip>
              </label>
            </div>
          )}
        </div>
        {fields.length == 0 ? (
          <Button onClick={() => setOpen(true)}>
            <IoMdCloudUpload />
            Add Item
          </Button>
        ) : (
          fields.map((field, index) => (
            <SpareCard
              key={index}
              disableActions={again}
              description={field.description}
              quantity={field.quantity}
              quantityUnit={field.quantityUnit}
              title={field.title}
              onSpareDelete={() => remove(index)}
              onSpareAdd={() => {
                setOpen(true);
              }}
              onSpareEdit={() => {
                editing.current = index;
                setSpareDetails({
                  title: field.title,
                  description: field.description,
                  quantity: field.quantity,
                  quantityUnit: field.quantityUnit,
                  attachments: field.attachments,
                });
                setOpen(true);
              }}
            />
          ))
        )}
        <LoadingButton
          variant="contained"
          loading={loading}
          disabled={fields.length == 0 || vendorsWatch.length == 0}
          sx={{ mt: 2 }}
          onClick={handleSubmit(onSubmit)}
          className="bg-blue-500 hover:bg-blue-700 text-white"
        >
          Send RFQ to Vendors
        </LoadingButton>
      </FormControl>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setSpareDetails({
            title: "",
            description: "",
            quantity: "",
            quantityUnit: "",
            attachments: null,
          });
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 500,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" align="center">
            Add Spare
          </Typography>
          <TextField
            name="spareDetails.title"
            label="Item name"
            required
            value={spareDetails.title}
            onChange={(e) => {
              setSpareDetails((prev) => ({
                ...prev,
                title: e.target.value,
              }));
            }}
          />
          <TextField
            name="spareDetails.description"
            multiline
            rows={4}
            required
            value={spareDetails.description}
            label="Remarks / Drawing No. / Part No."
            onChange={(e) => {
              setSpareDetails((prev) => ({
                ...prev,
                description: e.target.value,
              }));
            }}
          />
          <TextField
            type="number"
            name="spareDetails.quantity"
            required
            value={spareDetails.quantity}
            label="Quantity"
            onChange={(e) => {
              setSpareDetails((prev) => ({
                ...prev,
                quantity: e.target.value,
              }));
            }}
          />
          <TextField
            name="spareDetails.quantityUnit"
            value={spareDetails.quantityUnit}
            label="Quantity Unit"
            onChange={(e) => {
              setSpareDetails((prev) => ({
                ...prev,
                quantityUnit: e.target.value,
              }));
            }}
          />
          <MultiFileInput
            label="Attachment"
            loading={loading}
            onChange={handleChange}
            files={spareDetails.attachments}
            handleFilesDelete={() => {
              setSpareDetails((prev) => ({
                ...prev,
                attachments: null,
              }));
            }}
          />
          {editing.current === null ? (
            <Button
              onClick={() => {
                setOpen(false);
                append(spareDetails);
                setSpareDetails({
                  title: "",
                  description: "",
                  quantity: "",
                  attachments: null,
                });
              }}
              disabled={
                !spareDetails.title ||
                !spareDetails.description ||
                !spareDetails.quantity
              }
            >
              <MdAdd />
              Add
            </Button>
          ) : (
            <Button
              onClick={() => {
                setOpen(false);
                if (editing.current === null) return;
                update(editing.current, spareDetails);
                setSpareDetails({
                  title: "",
                  description: "",
                  quantity: "",
                  attachments: null,
                });
                editing.current = null;
              }}
            >
              <MdEdit />
              Update
            </Button>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default RFQForm;
