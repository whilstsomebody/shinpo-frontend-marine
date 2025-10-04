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
} from "@react-pdf/renderer";

type QuotePDFProps = {
  items: {
    title: string;
    description: string;
    quantity: number;
    quantityUnit?: string;
    unitPrice: number;
    finalPrice: number;
  }[];
  job: JobType;
  currencyCode: string;
  connectPort: string;
  remarks?: string;
  deliveryTime: number;
  deliveryCharges: number;
  spareQuality: string;
};

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
  logo: {
    width: 100,
  },
  tableContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: 20,
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
    backgroundColor: "#dce9f1",
    fontFamily: "Helvetica-Bold",
    color: "#5090bb",
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
  tableColShipName: {
    padding: 5,
    width: "33%",
  },
  tableColSubject: {
    padding: 5,
    width: "33%",
  },
  tableColDate: {
    padding: 5,
    width: "33%",
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
    width: "12%",
  },
  tableColDescription: {
    padding: 5,
    width: "40%",
  },
  tableColUnitPrice: {
    padding: 5,
    width: "20%",
  },
  tableColTotal: {
    padding: 5,
    width: "20%",
  },
  tableFooter: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  tableFooterContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
  },
  billingSection: {
    fontSize: 12,
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    columnGap: 5,
    rowGap: 5,
    flexWrap: "wrap",
  },
  deliveryDetailSection: {
    fontSize: 12,
    marginTop: 20,
    marginBottom: 20,
    display: "flex",
    flexDirection: "column",
    columnGap: 5,
    rowGap: 5,
    flexWrap: "wrap",
  },
  deliveryRow: {
    display: "flex",
    flexDirection: "row",
    columnGap: 5,
    flexWrap: "wrap",
  },
  deliveryHeader: {
    color: "#5090bb",
    fontFamily: "Helvetica",
    fontWeight: "medium",
  },
  bankDetails: {
    fontSize: 9,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
});

function QuoteHeader() {
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

function BillingDetails({ job }: { job: JobType }) {
  return (
    <View style={styles.billingSection}>
      <Text style={styles.boldText}>Billing Address:</Text>
      <View>
        <Text>{job.company.name}</Text>
        <Text>{job.company.address}</Text>
        <Text>{job.company.city}</Text>
        <Text>{job.company.state}</Text>
        <Text>{job.company.country}</Text>
      </View>
    </View>
  );
}

function Details({ job }: { job: JobType }) {
  const now = new Date();
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={styles.tableColShipName}>Ship Name</Text>
        <Text style={styles.tableColSubject}>Subject</Text>
        <Text style={styles.tableColDate}>Date</Text>
      </View>
      <View style={styles.tableRowEven}>
        <Text style={styles.tableColShipName}>{job.shipName}</Text>
        <Text style={styles.tableColSubject}>{job.description}</Text>
        <Text
          style={styles.tableColDate}
        >{`${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`}</Text>
      </View>
    </View>
  );
}

function QuoteTable({
  items,
  currencyCode,
}: {
  items: QuotePDFProps["items"];
  currencyCode: QuotePDFProps["currencyCode"];
}) {
  return (
    <View style={styles.tableContainer}>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.tableColSNo}>S/N</Text>
          <Text style={styles.tableColName}>Item Name</Text>
          <Text style={styles.tableColQuantity}>Quantity</Text>
          <Text style={styles.tableColDescription}>Description</Text>
          <Text style={styles.tableColUnitPrice}>Rate</Text>
          <Text style={styles.tableColTotal}>Amount</Text>
        </View>
        {items.map((item, index) => (
          <View
            key={index}
            style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
          >
            <Text style={styles.tableColSNo}>{index + 1}</Text>
            <Text style={styles.tableColName}>{item.title}</Text>
            <Text style={styles.tableColQuantity}>
              {item.quantity} {item.quantityUnit}
            </Text>
            <Text style={styles.tableColDescription}>{item.description}</Text>
            <Text style={styles.tableColUnitPrice}>
              {`${currencyCode} ${item.finalPrice}`}
            </Text>
            <Text style={styles.tableColTotal}>
              {`${currencyCode} ${
                Math.round(item.quantity * item.finalPrice * 100) / 100
              }`}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.tableFooter}>
        <View style={styles.tableFooterContainer}>
          <Text
            style={{
              color: "#5090bb",
              fontFamily: "Helvetica-Bold",
              fontWeight: "bold",
            }}
          >
            TOTAL:
          </Text>
          <Text
            style={{
              fontSize: 13,
            }}
          >
            {`${currencyCode} ${items.reduce(
              (acc, item) => acc + item.quantity * item.finalPrice,
              0
            )}`}
          </Text>
        </View>
      </View>
    </View>
  );
}

function DeliveryDetails({
  deliveryTime,
  deliveryCharges,
  currencyCode,
  remarks,
  connectPort,
  spareQuality,
}: {
  deliveryTime: number;
  currencyCode: string;
  deliveryCharges: number;
  remarks?: string;
  connectPort: string;
  spareQuality: string;
}) {
  return (
    <View style={styles.deliveryDetailSection}>
      <Text style={styles.boldText}>Delivery Details:</Text>
      <View style={styles.deliveryRow}>
        <Text style={styles.deliveryHeader}>Delivery Time:</Text>
        <Text>{deliveryTime} Days</Text>
      </View>
      <View style={styles.deliveryRow}>
        <Text style={styles.deliveryHeader}>Delivery Charges:</Text>
        <Text>{`${currencyCode} ${deliveryCharges}`}</Text>
      </View>
      <View style={styles.deliveryRow}>
        <Text style={styles.deliveryHeader}>Ex Works:</Text>
        <Text>{connectPort}</Text>
      </View>
      <View style={styles.deliveryRow}>
        <Text style={styles.deliveryHeader}>Spare Quality</Text>
        <Text>{spareQuality}</Text>
      </View>
      <View style={styles.deliveryRow}>
        <Text style={styles.deliveryHeader}>Remarks:</Text>
        <Text>{remarks ? remarks : "NA"}</Text>
      </View>
    </View>
  );
}

function BankDetails() {
  return (
    <View style={styles.bankDetails}>
      <Text style={styles.boldText}>Bank Details:</Text>
      <View>
        <Text>Account Name : SHINPO ENGINEERING PTE LTD</Text>
        <Text>CURRENCY : SGD</Text>
        <Text>Branch Code: 001</Text>
        <Text>BANK NAME : OCBC BANK</Text>
        <Text>ACCOUNT NUMBER : 601813538001</Text>
        <Text>SWIFT CODE : OCBCSGSG</Text>
      </View>
      <View>
        <Text>Account Name : SHINPO ENGINEERING PTE LTD</Text>
        <Text>CURRENCY : USD</Text>
        <Text>BANK NAME : OCBC BANK</Text>
        <Text>ACCOUNT NUMBER : 601477987201</Text>
        <Text>OCBC - 601477987201</Text>
        <Text>SWIFT CODE - OCBCSGSG</Text>
      </View>
    </View>
  );
}

const QuoteDocument = ({
  items,
  job,
  currencyCode,
  connectPort,
  deliveryTime,
  deliveryCharges,
  remarks,
  spareQuality,
}: QuotePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <QuoteHeader />
      <Text style={styles.header}>Quotation for {job.jobCode}</Text>
      <BillingDetails job={job} />
      <Details job={job} />
      <QuoteTable items={items} currencyCode={currencyCode} />
      <DeliveryDetails
        spareQuality={spareQuality}
        deliveryTime={deliveryTime}
        deliveryCharges={deliveryCharges}
        remarks={remarks}
        connectPort={connectPort}
        currencyCode={currencyCode}
      />
    </Page>
  </Document>
);

export default async function createQuotePDF({
  items,
  job,
  currencyCode,
  connectPort,
  deliveryTime,
  remarks,
  deliveryCharges,
  spareQuality,
}: QuotePDFProps) {
  return await pdf(
    <QuoteDocument
      items={items}
      job={job}
      currencyCode={currencyCode}
      connectPort={connectPort}
      deliveryTime={deliveryTime}
      remarks={remarks}
      deliveryCharges={deliveryCharges}
      spareQuality={spareQuality}
    />
  ).toBlob();
}
