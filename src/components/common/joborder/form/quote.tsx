import React, { useEffect, useRef } from "react";
import { CurrencyContext } from "@/context/CurrencyContext";
import {
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { useFieldArray, useForm } from "react-hook-form";
import instance from "@/config/axios.config";
import parseAttributes from "@/utils/parse-data";
import createQuotePDF from "@/utils/create-quote";

interface QuotationFormProps {
  job: JobType | null;
}

interface ItemType {
  spareId: number;
  title: string;
  description: string;
  quantity: number;
  quantityUnit?: string;
  unitPrice: number;
}

const QuotationForm: React.FC<QuotationFormProps> = ({ job }) => {
  const { rates } = React.useContext(CurrencyContext);
  const [marginRate, setMarginRate] = React.useState<any>(1);
  const [rfqs, setRfqs] = React.useState<any[]>([]);
  const [lowestPriceRFQs, setLowestPriceRFQs] = React.useState<any[]>([]);
  const [selectedCurrency, setSelectedCurrency] = React.useState<string>("USD");
  const [conversionRate, setConversionRate] = React.useState<any>(1);
  const [selectedQuality, setSelectedQuality] = React.useState<string>("");

  const finalPrices = useRef<{
    [id: number]: {
      finalPrice: number;
    };
  }>({});

  useEffect(() => {
    if (job) {
      const getRFQs = async () => {
        const res = await instance.get(
          `/rfqs?filters[RFQNumber][$eq]=RFQ-${job.jobCode}&populate=spare`
        );
        const rfqs = parseAttributes(res.data);
        setRfqs(rfqs);
      };
      getRFQs();
    }
  }, [job]);

  const { control, register, handleSubmit, watch, setValue } = useForm<{
    items: ItemType[];
    deliveryTime: number;
    deliveryCharges: number;
    connectPort: string;
    remarks?: string;
  }>({
    defaultValues: {
      items: [],
    },
  });

  const onSubmit = (data: {
    job: JobType;
    items: {
      spareId: number;
      title: string;
      description: string;
      quantity: number;
      quantityUnit?: string;
      unitPrice: number;
      finalPrice: number;
    }[];
    currencyCode: string;
    deliveryTime: number;
    deliveryCharges: number;
    connectPort: string;
    remarks?: string;
    spareQuality: string;
  }) => {
    const pdfDownloadLink = createQuotePDF(data);
    pdfDownloadLink.then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Quotation-${data.job.jobCode}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (!rfqs.length) return;
    const groupedRfqsBySpare = rfqs.reduce((acc: any, rfq: any) => {
      rfq.unitPrice =
        Math.round((rfq.unitPrice / rates[rfq.currencyCode]) * 100) / 100;
      rfq.ogCurrencyCode = rfq.currencyCode;
      rfq.currencyCode = "USD";
      if (rfq.spare.id) {
        if (!acc[rfq.spare.id]) {
          acc[rfq.spare.id] = [];
        }
        acc[rfq.spare.id].push(rfq);
      }
      return acc;
    }, {});
    const rfqsWithSpare = Object.keys(groupedRfqsBySpare).map((key) => {
      const rfqs = groupedRfqsBySpare[key];

      const lowestPriceRFQ = rfqs.reduce((acc: any, rfq: any) => {
        if (acc.unitPrice > rfq.unitPrice) {
          return rfq;
        }
        return acc;
      }, rfqs[0]);

      return lowestPriceRFQ;
    });
    setLowestPriceRFQs(rfqsWithSpare);
  }, [rfqs]);

  useEffect(() => {
    lowestPriceRFQs.forEach((rfq) => {
      const idx = fields.findIndex((item) => item.spareId === rfq.spare.id);
      if (idx === -1) {
        append({
          spareId: rfq.spare.id,
          title: rfq.spare.title,
          description: rfq.spare.description,
          quantity: rfq.spare.quantity,
          quantityUnit: rfq.spare?.quantityUnit || "units",
          unitPrice: rfq.unitPrice,
        });
        finalPrices.current[rfq.spare.id] = {
          finalPrice: rfq.unitPrice,
        };
      } else {
        fields[idx].unitPrice = rfq.unitPrice;
      }
    });
    setSelectedQuality(lowestPriceRFQs[0]?.quality || "");
  }, [lowestPriceRFQs]);

  const handleMarginRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (!isNaN(parseFloat(input))) {
      setMarginRate(parseFloat(input));
    } else {
      setMarginRate(input);
    }
  };

  useEffect(() => {
    finalPrices.current = fields.reduce((acc: any, item) => {
      acc[item.spareId] = {
        finalPrice:
          Math.round(item.unitPrice * (1 + marginRate / 100) * 100) / 100,
      };
      return acc;
    }, {} as any);
  }, [marginRate]);

  const updateFinalPrices = () => {
    f.forEach((item, index) => {
      finalPrices.current[item.spareId] = {
        finalPrice:
          Math.round(item.unitPrice * (1 + marginRate / 100) * 100) / 100,
      };
    });
  };

  const updatePrices = () => {
    if (selectedCurrency === "USD") {
      setConversionRate(1);
      fields.forEach((item, index) => {
        setValue(
          `items.${index}.unitPrice`,
          Math.round(item.unitPrice * 100) / 100,
          {
            shouldValidate: true,
          }
        );
        finalPrices.current[item.spareId] = {
          finalPrice:
            Math.round(item.unitPrice * (1 + marginRate / 100) * 100) / 100,
        };
      });
    } else {
      fields.forEach((item, index) => {
        setValue(
          `items.${index}.unitPrice`,
          Math.round(item.unitPrice * conversionRate * 100) / 100,
          {
            shouldValidate: true,
          }
        );
        finalPrices.current[item.spareId] = {
          finalPrice:
            Math.round(
              item.unitPrice * conversionRate * (1 + marginRate / 100) * 100
            ) / 100,
        };
      });
    }
  };

  const f = watch("items");
  const remarks = watch("remarks");
  const deliveryTime = watch("deliveryTime");
  const deliveryCharges = watch("deliveryCharges");
  const connectPort = watch("connectPort");

  const spareQualities = [
    "OEM-JAPAN",
    "OEM-KOREA",
    "OEM-CHINA",
    "OTHER OEM",
    "GENUINE",
    "MAKERS",
    "REPLACEMENT",
    "COMPATIBLE",
  ];

  useEffect(() => {
    updatePrices();
  }, [conversionRate, selectedCurrency]);

  updateFinalPrices();

  return (
    <div>
      <Typography variant="h6">
        Quotation Generation for {job?.jobCode}
      </Typography>
      <div className="flex justify-between my-2 items-center">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <Typography variant="subtitle1">Currency</Typography>
            <Select
              defaultValue="USD"
              size="small"
              sx={{
                width: 200,
              }}
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
            >
              <MenuItem value="USD">USD</MenuItem>
              <MenuItem value="SGD">SGD</MenuItem>
            </Select>
          </div>
          {selectedCurrency !== "USD" && (
            <div className="flex flex-col">
              <Typography variant="subtitle1">Conversion Rate</Typography>
              <TextField
                size="small"
                value={conversionRate}
                onChange={(e) => setConversionRate(e.target.value)}
              />
            </div>
          )}
        </div>
        <TextField
          label="Margin Rate"
          type="number"
          value={marginRate}
          onChange={handleMarginRateChange}
        />
      </div>
      <Typography variant="h6">Items</Typography>
      <TableContainer component={Paper}>
        <Table
          sx={{
            marginTop: 2,
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>Serial No.</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Final Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {f.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <TextField
                    {...register(`items.${index}.title`)}
                    defaultValue={item.title}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    {...register(`items.${index}.description`)}
                    defaultValue={item.description}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <TextField
                      {...register(`items.${index}.quantity`)}
                      defaultValue={item.quantity}
                      type="number"
                    />
                    <TextField
                      {...register(`items.${index}.quantityUnit`)}
                      defaultValue={item.quantityUnit}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <TextField
                    {...register(`items.${index}.unitPrice`)}
                    defaultValue={item.unitPrice}
                    type="number"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    disabled
                    value={finalPrices.current[item.spareId].finalPrice}
                    type="number"
                  />
                </TableCell>
                <TableCell>
                  <Button onClick={() => remove(index)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        sx={{
          marginTop: 2,
        }}
        onClick={() => {
          append({
            spareId: 0,
            title: "",
            description: "",
            quantity: 0,
            quantityUnit: "units",
            unitPrice: 0,
          });
          finalPrices.current[0] = {
            finalPrice: 0,
          };
        }}
      >
        Add Item
      </Button>
      <div className="flex flex-col space-y-4 mt-4">
        <TextField
          label="Delivery Time"
          InputProps={{
            endAdornment: <span>Days</span>,
          }}
          {...register("deliveryTime")}
        />
        <TextField
          label="Delivery Charges"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {selectedCurrency}
              </InputAdornment>
            ),
          }}
          {...register("deliveryCharges")}
        />
        <TextField label="Ex Works" {...register("connectPort")} />
        <div className="flex flex-col">
          <Typography variant="caption">Spare Quality</Typography>
          <Select
            value={selectedQuality}
            onChange={(e) => setSelectedQuality(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                "& legend": {
                  "& span": {
                    color: "black",
                  },
                },
              },
            }}
          >
            {spareQualities.map((quality) => (
              <MenuItem key={quality} value={quality}>
                {quality}
              </MenuItem>
            ))}
          </Select>
        </div>
        <TextField
          label="Remarks"
          multiline
          rows={4}
          {...register("remarks")}
        />
      </div>
      <div className="flex justify-end mt-4">
        <Button
          disabled={
            f.length === 0 ||
            !job ||
            !deliveryTime ||
            !connectPort ||
            !selectedQuality ||
            !selectedCurrency
          }
          variant="outlined"
          onClick={() => {
            const data = f.map((item) => ({
              ...item,
              finalPrice: finalPrices.current[item.spareId].finalPrice,
            }));
            onSubmit({
              job: job!,
              items: data,
              remarks,
              deliveryTime,
              connectPort,
              currencyCode: selectedCurrency,
              deliveryCharges: deliveryCharges || 0,
              spareQuality: selectedQuality,
            });
          }}
        >
          Generate Quotation
        </Button>
      </div>
    </div>
  );
};

export default QuotationForm;
