import { Mutable } from "@/utils/type-utils";
import { useContext, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import parseAttributes from "@/utils/parse-data";
import instance from "@/config/axios.config";
import dynamic from "next/dynamic";
import DashboardLayout from "@/components/layout";
import { Typography } from "@mui/material";
const QuoteCompareTable = dynamic(
  () => import("@/components/common/purchaseorder/QuoteCompareTable"),
  { ssr: false }
);

type PageProps = {
  rfqs: any[];
};

export default function QuoteComparisionPage({ rfqs }: PageProps) {
  const spareCols = ["Supply Qty"] as const;
  const companyCols = ["unit"] as const;
  const aggregateCols = [
    "Discount",
    "Delivery Charge",
    "Amount Payable",
    "Connect Date",
    "Connect Port",
    "Remark",
  ] as const;

  const { companies: initCompanies, spares: initSpares } = rfqs.reduce(
    (acc, cur) => {
      const vendor = cur.vendor;
      const spare = cur.spare;
      const company = acc.companies.find(
        (c: any) => c.vendor.name === vendor.name
      );
      if (!company) {
        acc.companies.push({
          vendor,
          [spare.title]: {
            ...spare,
            total: cur.unitPrice * spare.quantity,
            unit: cur.unitPrice,
            selected: false,
          },
        });
      } else {
        company[spare.title] = {
          ...spare,
          total: cur.unitPrice * spare.quantity,
          unit: cur.unitPrice,
        };
      }
      if (!acc.spares.find((s: any) => s.name === spare.title)) {
        acc.spares.push({
          name: spare.title,
          "Supply Qty": spare.quantity,
          orderQty: spare.quantity,
        });
      }
      return acc;
    },
    {
      companies: [],
      spares: [],
    }
  );

  const [companies, setCompanies] = useState<any[]>(initCompanies);
  const [spares, setSpares] = useState<any[]>(initSpares);

  const aggregate = rfqs.reduce((acc, cur) => {
    const rfqvendor = cur.vendor;
    const { vendor, ...spares } =
      companies.find((c) => c.vendor.id === rfqvendor.id) || {};

    const total = Object.keys(spares).reduce((acc, cur) => {
      return acc + spares[cur].total;
    }, 0);

    acc[vendor.name] = {
      Discount: `${cur.discount}%`,
      "Amount Payable": (1 - (cur.discount || 0) * 0.01) * total + cur.delivery,
      "Connect Date": `${cur.connectTime} Days`,
      "Connect Port": cur.connectPort,
      "Delivery Charge": cur.delivery,
      Remark: cur.remark,
    };
    return acc;
  }, {});

  return (
    <DashboardLayout header sidebar>
      <Typography
        variant="h4"
        textAlign="center"
        color="gray"
        sx={{
          mb: 2,
        }}
      >
        View Quote Comparison
      </Typography>
      <QuoteCompareTable
        mode="view"
        spareCols={spareCols as Mutable<typeof spareCols>}
        companyCols={companyCols as Mutable<typeof companyCols>}
        aggregateCols={aggregateCols as Mutable<typeof aggregateCols>}
        //@ts-ignore
        companies={companies}
        aggregate={aggregate}
        spares={spares}
        onChange={(companies, spares) => {
          setCompanies(companies);
          setSpares(spares);
        }}
      />
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context
) => {
  const rfqNumber = context.params?.rfq as string;
  if (!rfqNumber)
    return {
      notFound: true,
    };
  const rfqs = parseAttributes(
    await instance.get(
      `/rfqs?filters[RFQNumber][$eq]=${rfqNumber}&filters[filled]=true&populate[0]=spare.attachments&populate[1]=vendor&populate[2]=quantity`
    )
  );
  if (rfqs.length === 0) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      rfqs,
    },
  };
};
