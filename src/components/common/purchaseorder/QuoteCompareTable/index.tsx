// @ts-nocheck

import styles from "./QuoteComparision.module.css";
import { useContext } from "react";
import { CurrencyContext } from "@/context/CurrencyContext";

export type DeliveryTime = {
  value: number;
  unit: "D" | "W" | "M" | "Y";
};

function displayNum(val: any) {
  return typeof val === "number" ? val.toFixed(2) : val === null ? "-" : val;
}

export default function QuoteCompareTable<
  S extends string[],
  C extends string[],
  A extends string[]
>({
  spareCols,
  companyCols,
  spares,
  companies,
  aggregateCols,
  aggregate,
  onChange,
  mode,
}: {
  spareCols: S;
  companyCols: C;
  aggregateCols: A;
  spares: ({
    [x in S[number]]: string;
  } & { name: string; orderQty: number; unit: number | null; id: number })[];
  companies: ({
    [s in (typeof spares)[number]["id"]]: { [x in C[number]]: string } & {
      selected: boolean;
      total: number;
    };
  } & {
    vendor: VendorType;
    currencyCode: string;
  })[];
  aggregate: {
    [company in (typeof companies)[number]["name"]]: {
      [x in A[number]]: string;
    };
  };
  onChange?: (c: typeof companies, s: typeof spares) => void;
  mode?: "view" | "edit";
}) {
  const totals = Object.fromEntries(
    companies.map((company) => [
      company.vendor.name,
      (() => {
        const { vendor, currencyCode, ...s } = company;
        return Object.keys(s).reduce((acc, cur) => {
          const spare = company[cur as (typeof spares)[number]["id"]];
          return spare.total === null || acc === null
            ? null
            : acc + spare.total;
        }, 0);
      })(),
    ])
  ) as { [x in (typeof companies)[number]["id"]]: number };

  const sortedTotals = (Object.entries(totals) as [string, number][])
    .sort(([, a], [, b]) => a - b)
    .filter(([, a]) => a !== null) as [string, number][];

  const minCompanyForEachSpare = spares.map((spare) => {
    const spareName = spare.name as (typeof spares)[number]["name"];
    const spareId = spare.id;
    const min = companies.reduce(
      (acc, cur) => {
        const spareData = cur[spareId];
        if (spareData.total === null) {
          return acc;
        }
        if (spareData?.total < acc.total) {
          return {
            name: cur.vendor.name,
            total: spareData.total,
            id: spareData.id,
            spareName,
          };
        }
        return acc;
      },
      { name: "", total: Infinity, spareName: "", id: 0 }
    );
    return min;
  });

  const { rates } = useContext(CurrencyContext);

  return (
    <table className={styles["quote-comparison-table"]}>
      {/* 1st row */}
      <tr>
        <th colSpan={spareCols.length + 3}></th>
        {/* Company names */}
        {companies.map((company, idx) => (
          <th colSpan={companyCols.length + 2} key={idx}>
            {company.vendor.name}
          </th>
        ))}
      </tr>

      {/* 2nd row */}
      <tr>
        <th rowSpan={2}>No.</th>
        <th rowSpan={2}>Item</th>
        {spareCols.map((col, idx) => (
          <th key={idx} rowSpan={2}>
            {col}
          </th>
        ))}
        <th rowSpan={2}>Order Quantity</th>
        {companies.map((company, idx) => (
          <th key={idx} colSpan={companyCols.length + 2}>
            1 USD = {rates[company.currencyCode] || 1} {company.currencyCode}
          </th>
        ))}
      </tr>

      {/* 3rd row */}
      <tr>
        {companies.map((company, idx) => (
          <>
            {companyCols.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
            <th>Total</th>
            {mode === "edit" && (
              <th>
                Order{" "}
                <input
                  type="checkbox"
                  name=""
                  id=""
                  checked={(() => {
                    const { vendor, currencyCode, ...s } = company;
                    return (
                      Object.keys(s) as (typeof spares)[number]["id"][]
                    ).reduce((acc, cur) => acc && company[cur].selected, true);
                  })()}
                  onChange={(ev) => {
                    const selected = ev.target.checked;
                    const { vendor, currencyCode, ...s } = company;
                    (
                      Object.keys(s) as (typeof spares)[number]["name"][]
                    ).forEach((key) => {
                      if (company[key].total === null) return;
                      company[key].selected = selected;
                    });

                    onChange?.([...companies], [...spares]);
                  }}
                />
              </th>
            )}
          </>
        ))}
      </tr>

      {/* Spare rows */}
      {spares.map((spare, idx) => (
        <tr key={idx}>
          <td>{idx + 1}</td>
          <td>{spare.name}</td>
          {spareCols.map((col, i) => {
            return (
              <td key={i}>
                {col === "Supply Qty"
                  ? displayNum(spare[col as S[number]]) +
                    " " +
                    (spare.qtyUnit || "")
                  : displayNum(spare[col as S[number]])}
              </td>
            );
          })}
          <td>
            <div className="flex">
              <input
                value={spare.orderQty}
                className={styles["order-qty-inp"]}
                onChange={(ev) => {
                  const orderQty = parseInt(ev.target.value || "0");
                  spares[idx].orderQty = orderQty;
                  companies.forEach((company) => {
                    const spareName = spare.id as (typeof spares)[number]["id"];
                    const spareData = company[spareName];
                    spareData.total =
                      spareData.unit === null
                        ? null
                        : spareData.unit * orderQty;
                  });
                  onChange?.([...companies], [...spares]);
                }}
              />
            </div>
          </td>
          {companies.map((company, idx) => {
            const spareName = spare.id as (typeof spares)[number]["name"];
            const spareData = company[spareName];
            return (
              <>
                {companyCols.map((col, i) => {
                  return (
                    <td
                      key={i}
                      className={`${
                        spareData.selected ? styles.selected : ""
                      } ${
                        minCompanyForEachSpare.find(
                          (min) =>
                            min.name === company.vendor.name &&
                            min.id === spareName
                        )
                          ? styles.highligted
                          : ""
                      }`}
                    >
                      {displayNum(spareData[col as C[number]])}
                    </td>
                  );
                })}
                <td
                  className={`${styles.number} ${
                    spareData.selected ? styles.selected : ""
                  } ${
                    minCompanyForEachSpare.find(
                      (min) =>
                        min.name === company.vendor.name &&
                        min.spareName === spareName
                    )
                      ? styles.highligted
                      : ""
                  }`}
                >
                  {displayNum(spareData.total)}
                </td>
                {mode === "edit" && (
                  <td>
                    <input
                      disabled={spareData.total === null}
                      type="checkbox"
                      name=""
                      id=""
                      checked={
                        spareData.total === null ? false : spareData["selected"]
                      }
                      onChange={(ev) => {
                        const selected = ev.target.checked;
                        spareData["selected"] = selected;
                        onChange?.([...companies], [...spares]);
                      }}
                    />
                  </td>
                )}
              </>
            );
          })}
        </tr>
      ))}

      {/* Aggregate Rows */}
      {/* TOTAL Row First */}
      <tr>
        <td colSpan={spareCols.length + 3}>Total</td>
        {companies.map((company, idx) => {
          const companyName = company.vendor
            .name as (typeof companies)[number]["name"];
          return (
            <>
              <td></td>
              <td
                className={`${styles.number} ${
                  sortedTotals?.[0]?.[0] === companyName
                    ? styles.highligted
                    : ""
                }`}
              >
                {displayNum(totals[companyName])}
              </td>
              {mode === "edit" && <td></td>}
            </>
          );
        })}
      </tr>
      {aggregateCols.map((agg, idx) => (
        <tr key={idx}>
          <td colSpan={spareCols.length + 3}>{agg}</td>
          {companies.map((company, idx) => {
            const companyName = company.vendor
              .name as (typeof companies)[number]["name"];
            return (
              <>
                <td></td>
                <td
                  className={
                    typeof aggregate[companyName][agg as A[number]] === "number"
                      ? styles.number
                      : ""
                  }
                >
                  {displayNum(aggregate[companyName][agg as A[number]])}
                </td>
                {mode === "edit" && <td></td>}
              </>
            );
          })}
        </tr>
      ))}
    </table>
  );
}
