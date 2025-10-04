import axios from "axios";
import { writeFileSync } from "fs";
import React, { useState } from "react";

export const getCurrencies = async () => {
  const res = await axios.get(
    "https://restcountries.com/v3.1/all?fields=currencies"
  );
  const visitedCurrencies = new Set();
  const currencies = res.data
    .map((c: any) =>
      Object.keys(c.currencies).map((cur) => {
        if (visitedCurrencies.has(cur)) return null;
        visitedCurrencies.add(cur);
        return {
          name: cur,
          symbol: c.currencies[cur].symbol,
        };
      })
    )
    .flat()
    .filter((c: any) => c !== null);

  return currencies;
};

getCurrencies().then((cur) =>
  writeFileSync("./currencies.json", JSON.stringify(cur))
);
