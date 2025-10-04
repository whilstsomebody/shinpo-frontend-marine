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

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    lineHeight: 1.25,
    fontSize: 10,
    padding: 40,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  head: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 150,
  },
  address: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  boldText: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    fontWeight: "bold",
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 5,
    fontFamily: "Helvetica-Bold",
  },
  details: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: 5,
  },
  detailCol: {
    minWidth: "30%",
    maxWidth: "35%",
    display: "flex",
    flexDirection: "column",
    columnGap: 5,
    rowGap: 5,
    flexWrap: "wrap",
  },
  detail: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 20,
    flexWrap: "wrap",
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
    width: "10%",
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
    width: "40%",
  },
  tableColUnitPrice: {
    padding: 5,
    width: "15%",
  },
});

function RFQHeader() {
  return (
    <View style={styles.head}>
      <View style={styles.address}>
        <Text style={styles.boldText}>SHINPO ENGINEERING PTE LTD</Text>
        <Text>1 Tuas South Avenue 6 , #05-20</Text>
        <Text>The Westcom</Text>
        <Text>Singapore 637021</Text>
        <Text>Tel: +65 81321465</Text>
        <Link src="mailto:admin@shinpoengineering.com">
          admin@shinpoengineering.com
        </Link>
        <Text>GST Registration No. : 202215215M</Text>
      </View>
      <Image
        src="https://jobs.shinpoengineering.com/logo.png"
        style={styles.logo}
      />
    </View>
  );
}

function RFQDetails({
  rfqNumber,
  vesselName,
  jobDescription,
  portOfDelivery,
  vendorName,
  vendorAddress,
}: {
  rfqNumber: string;
  vesselName: string;
  jobDescription: string;
  portOfDelivery: string;
  vendorName: string;
  vendorAddress: string;
}) {
  return (
    <View style={styles.details}>
      <View style={styles.detailCol}>
        <View style={styles.detail}>
          <Text style={styles.boldText}>RFQ Number:</Text>
          <Text>{rfqNumber}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.boldText}>Job Description:</Text>
          <Text>{jobDescription}</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.boldText}>Port of Delivery:</Text>
          <Text>{portOfDelivery}</Text>
        </View>
      </View>
      <View style={styles.detailCol}>
        <Text style={styles.boldText}>Supplier Details:</Text>
        <Text>{vendorName}</Text>
        <Text>{vendorAddress}</Text>
      </View>
    </View>
  );
}

function RFQTable({
  data,
}: {
  data: {
    name: string;
    quantity: number;
    description: string;
    unitPrice: string;
  }[];
}) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableColSNo}>S/N</Text>
        <Text style={styles.tableColName}>Item Name</Text>
        <Text style={styles.tableColQuantity}>Quantity</Text>
        <Text style={styles.tableColDescription}>Description</Text>
        <Text style={styles.tableColUnitPrice}>Unit Price</Text>
      </View>
      {data.map((item, index) => (
        <View
          key={index}
          style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
        >
          <Text style={styles.tableColSNo}>{index + 1}</Text>
          <Text style={styles.tableColName}>{item.name}</Text>
          <Text style={styles.tableColQuantity}>{item.quantity}</Text>
          <Text style={styles.tableColDescription}>{item.description}</Text>
          <Text style={styles.tableColUnitPrice}>{item.unitPrice}</Text>
        </View>
      ))}
    </View>
  );
}

function RFQFooter() {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginTop: 20,
        ...styles.boldText,
      }}
    >
      <Text>Your Reference:</Text>
      <Text>Discount:</Text>
      <Text>Delivery Charge:</Text>
      <Text>Delivery Time:</Text>
      <Text>Connect Port:</Text>
      <Text>Remarks:</Text>
    </View>
  );
}

export const RFQTemplate = {
  Header: RFQHeader,
  Details: RFQDetails,
  Table: RFQTable,
  Footer: RFQFooter,
};

const RFQDocument = ({
  rfqNumber,
  vesselName,
  jobDescription,
  portOfDelivery,
  vendorName,
  vendorAddress,
  spares,
}: {
  rfqNumber: string;
  vesselName: string;
  jobDescription: string;
  portOfDelivery: string;
  vendorName: string;
  vendorAddress: string;
  spares: {
    name: string;
    quantity: number;
    description: string;
    unitPrice: string;
  }[];
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <RFQTemplate.Header />
      <Text style={styles.header}>Requisition for Quote</Text>
      <Svg height="20" width="500">
        <Line
          x1={0}
          y1={0}
          x2={"100%"}
          y2={0}
          strokeWidth={2}
          stroke="rgb(0, 0, 0)"
        />
      </Svg>
      <RFQTemplate.Details
        jobDescription={jobDescription}
        portOfDelivery={portOfDelivery}
        rfqNumber={rfqNumber}
        vesselName={vesselName}
        vendorAddress={vendorAddress}
        vendorName={vendorName}
      />
      <RFQTemplate.Table
        data={spares.map((spare) => ({
          name: spare.name,
          quantity: spare.quantity,
          description: spare.description,
          unitPrice: spare.unitPrice,
        }))}
      />
      <RFQFooter />
    </Page>
  </Document>
);

type RFQPdfType = {
  shipName?: string;
  spareDetails: {
    title?: string;
    description?: string;
    quantity?: string;
  }[];
  vendor: {
    name?: string;
    address?: string;
  };
  jobCode?: string;
  description?: string;
  portOfDelivery?: string;
};

const parseText = (text?: string) => {
  return text || "N/A";
};

export default async function createRfqPdf(data: RFQPdfType) {
  return await pdf(
    <RFQDocument
      jobDescription={parseText(data.description)}
      portOfDelivery={parseText(data.portOfDelivery)}
      rfqNumber={`RFQ-${data.jobCode}`}
      spares={data.spareDetails.map((spare) => ({
        name: parseText(spare.title),
        quantity: parseInt(spare.quantity || "0"),
        description: parseText(spare.description),
        unitPrice: "",
      }))}
      vesselName={parseText(data.shipName)}
      vendorAddress={parseText(data.vendor.address)}
      vendorName={parseText(data.vendor.name)}
    />
  ).toBlob();
}
