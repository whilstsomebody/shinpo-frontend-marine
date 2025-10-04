import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
  Image,
  Link,
  PDFViewer,
  Line,
  Svg,
} from "@react-pdf/renderer";

type POType = {
  currencyCode: string;
  poNo: string;
  vesselName: string;
  spares: {
    name: string;
    description: string;
    quantity: number;
    qtyUnit: string;
    unitPrice: number;
    total: number;
  }[];
  aggregate: {
    discount: number;
    deliveryCharge: number;
  };
  vendor: VendorType;
  deliveryAddress: string;
  remarks?: string;
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    lineHeight: 1.25,
    fontSize: 10,
    padding: 40,
  },
  logo: {
    width: 100,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  boldText: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    fontWeight: "bold",
  },
  companyName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 20,
  },
  poDetails: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detail: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "40%",
  },
  poDetail: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxWidth: "30%",
  },
  heading: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    fontWeight: "bold",
  },
  value: {
    fontSize: 11,
  },

  detailRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  detailColumn: {
    display: "flex",
    flexDirection: "column",
    gap: 40,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#2980ba",
    fontFamily: "Helvetica-Bold",
    color: "#fff",
    textAlign: "center",
  },
  tableRowEven: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    textAlign: "center",
    gap: 5,
    alignItems: "center",
  },
  tableRowOdd: {
    display: "flex",
    flexDirection: "row",
    textAlign: "center",
    gap: 5,
    alignItems: "center",
  },
  tableColSNo: {
    padding: 5,
    width: "5%",
  },
  tableColName: {
    padding: 5,
    width: "25%",
  },
  tableColQuantity: {
    padding: 5,
    width: "10%",
  },
  tableColDescription: {
    padding: 5,
    width: "30%",
  },
  tableColUnitPrice: {
    padding: 5,
    width: "15%",
  },
  tableColTotal: {
    padding: 5,
    width: "15%",
  },
  tableAgg: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  tableAggDetails: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  tableAggHeading: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    fontWeight: "bold",
  },
  tableAggDetail: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});

const termsandConditions = [
  "Kindly send the copy of invoice as per our policy to avoid any rejections and delay in process.",
  "All the invoices shall only be addressed to accounts@shinpoengineering.com",
  "Send only one invoice per email as a PDF file ",
  "Ensure that the purchase order no ,Job code no are clearly stated on the invoice",
  "Ensure that full banking details are clearly stated on the invoice",
  "Ensure that vessel name, job description and pricing are clearly mentioned on the invoice",
  "Ensure the copy of quotes is/are attached with the invoice",
  "Ensure time sheets are attached and signed off by Shinpo representative",
  "Ask your Shinpo Engineering representative for clarification if any doubt",
];

function POHeader({
  poNumber,
  shipName,
}: {
  poNumber: string;
  shipName: string;
}) {
  return (
    <View>
      <View style={styles.header}>
        <Image
          src="https://jobs.shinpoengineering.com/logo.png"
          style={styles.logo}
        />
        <Text style={styles.boldText}>Purchase Order</Text>
      </View>
      <Text style={styles.companyName}>Shinpo Engineering PTE. LTD.</Text>
      <View style={styles.poDetails}>
        <View style={styles.poDetail}>
          <Text style={styles.heading}>Purchase Order</Text>
          <Text style={styles.value}>{poNumber}</Text>
        </View>
        <View style={styles.poDetail}>
          <Text style={styles.heading}>Order Date</Text>
          <Text style={styles.value}>{new Date().toLocaleDateString()}</Text>
        </View>
      </View>
    </View>
  );
}

function PODetails({
  vendorName,
  vendorAddress,
  deliveryAddress,
  remarks,
}: {
  vendorName: string;
  vendorAddress: string;
  deliveryAddress: string;
  remarks: string;
}) {
  return (
    <View style={styles.detailColumn}>
      <View style={styles.detailRow}>
        <View style={styles.detail}>
          <Text style={styles.heading}>Supplier Address</Text>
          <Text style={styles.value}>{vendorName}</Text>
          <Text style={styles.value}>{vendorAddress}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.heading}>Delivery Address</Text>
          <Text style={styles.value}>{deliveryAddress}</Text>
        </View>
      </View>
      <View style={styles.detailRow}>
        <View style={styles.detail}>
          <Text style={styles.heading}>Remarks</Text>
          <Text style={styles.value}>{remarks}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.heading}>Billing Address</Text>
          <View>
            <Text style={styles.value}>Shinpo Engineering PTE. LTD.</Text>
            <Text style={styles.value}>1 Tuas South Avenue 6, #05-20</Text>
            <Text style={styles.value}>S-637021 Singapore</Text>
            <Text style={styles.value}>Tel: 65 6265 1234</Text>
            <Text style={styles.value}>Fax: 65 6265 1234</Text>
            <Link src="mailto:admin@shinpoengineering.com">
              admin@shinpoengineering.com
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
}

function POTable({
  data,
}: {
  data: {
    subtotal: number;
    discount: number;
    deliveryCharge: number;
    grandTotal: number;
    currencyCode: string;
    spares: {
      name: string;
      description?: string;
      quantity: number;
      qtyUnit: string;
      unitPrice: number;
      total: number;
    }[];
  };
}) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableColSNo}>S/N</Text>
        <Text style={styles.tableColName}>Item Name</Text>
        <Text style={styles.tableColDescription}>Description</Text>
        <Text style={styles.tableColQuantity}>Quantity</Text>
        <Text style={styles.tableColUnitPrice}>Unit Price</Text>
        <Text style={styles.tableColTotal}>Total</Text>
      </View>
      {data.spares.map((item, index) => (
        <View
          key={index}
          style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
        >
          <Text style={styles.tableColSNo}>{index + 1}</Text>
          <Text style={styles.tableColName}>{item.name}</Text>
          <Text style={styles.tableColDescription}>
            {item.description || "No Description Available"}
          </Text>
          <Text style={styles.tableColQuantity}>
            {item.quantity} {item.qtyUnit}
          </Text>
          <Text style={styles.tableColUnitPrice}>
            {data.currencyCode} {item.unitPrice}
          </Text>
          <Text style={styles.tableColTotal}>
            {data.currencyCode} {item.total}
          </Text>
        </View>
      ))}
      <View style={styles.tableAgg}>
        <View style={styles.tableAggDetails}>
          <View style={styles.tableAggDetail}>
            <Text style={styles.tableAggHeading}>Subtotal:</Text>
            <Text>
              {data.currencyCode} {data.subtotal}
            </Text>
          </View>
          <View style={styles.tableAggDetail}>
            <Text style={styles.tableAggHeading}>Discount:</Text>
            <Text>{data.discount}%</Text>
          </View>
          <View style={styles.tableAggDetail}>
            <Text style={styles.tableAggHeading}>Delivery Charge:</Text>
            <Text>
              {data.currencyCode} {data.deliveryCharge}
            </Text>
          </View>
          <View style={styles.tableAggDetail}>
            <Text style={styles.tableAggHeading}>Grand Total:</Text>
            <Text>
              {data.currencyCode} {data.grandTotal}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function POFooter({
  data,
}: {
  data: {
    termsAndConditions: string[];
  };
}) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginTop: 20,
      }}
    >
      <Text style={styles.boldText}>Terms & Conditions</Text>
      {data.termsAndConditions.map((term, index) => (
        <Text key={index}>{`${index + 1}. ${term}`}</Text>
      ))}
    </View>
  );
}

export const POTemplate = {
  Header: POHeader,
  Details: PODetails,
  Table: POTable,
  TermsAndConditions: POFooter,
};

const PODocument = (data: POType) => {
  const subtotal = data.spares.reduce((acc, cur) => acc + cur.total, 0);
  const discountDecimal = data.aggregate.discount / 100;
  const grandtotal =
    subtotal - subtotal * discountDecimal + data.aggregate.deliveryCharge;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <POTemplate.Header poNumber={data.poNo} shipName={data.vesselName} />
        <Svg height="20" width="520">
          <Line
            x1={0}
            y1={0}
            x2={"100%"}
            y2={0}
            strokeWidth={2}
            stroke="rgb(0, 0, 0)"
          />
        </Svg>
        <POTemplate.Details
          vendorName={data.vendor.name}
          vendorAddress={data.vendor.address}
          deliveryAddress={data.deliveryAddress}
          remarks={data.remarks || "No Remarks"}
        />
        <POTemplate.Table
          data={{
            deliveryCharge: data.aggregate.deliveryCharge,
            discount: data.aggregate.discount,
            grandTotal: grandtotal,
            subtotal: subtotal,
            currencyCode: data.currencyCode,
            spares: data.spares,
          }}
        />
        <POTemplate.TermsAndConditions
          data={{ termsAndConditions: termsandConditions }}
        />
      </Page>
    </Document>
  );
};

export default async function createPO(data: POType) {
  return await pdf(<PODocument {...data} />).toBlob();
}
