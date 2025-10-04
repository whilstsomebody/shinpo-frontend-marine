import instance from "@/config/axios.config";
import parseAttributes from "@/utils/parse-data";
import { createContext, useContext, useEffect, useRef, useState } from "react";

export const CurrencyContext = createContext({
  rates: {} as { [x: string]: number },
  base: "USD",
  lastUpdated: new Date(),
  loading: true,
  refreshRates: () => {},
});

export function useCurrency(code: string) {
  const { rates } = useContext(CurrencyContext);
  return rates[code] || null;
}

export const CurrencyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const lastUpdated = useRef(new Date());

  const updateRates = async () => {
    const res = await instance.get(
      "/currencies?pagination[page]=1&pagination[pageSize]=200"
    );

    const data = parseAttributes(res.data.data) as any[];
    lastUpdated.current = new Date();

    setRates(
      Object.fromEntries(
        data.map(({ code, rate }) => [code, Math.round(rate * 100) / 100])
      )
    );
  };

  const refreshRates = () => {
    setLoading(true);
    updateRates().then(() => setLoading(false));
  };

  useEffect(() => {
    refreshRates();
  }, []);

  return (
    <CurrencyContext.Provider
      value={{
        rates,
        base: "USD",
        lastUpdated: lastUpdated.current,
        loading,
        refreshRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};
