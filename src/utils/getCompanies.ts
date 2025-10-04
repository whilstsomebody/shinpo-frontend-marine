import instance from "@/config/axios.config";
import parseAttributes from "./parse-data";

export default async function getCompanies() {
  const response = await instance.get(
    "/companies?pagination[page]=1&pagination[pageSize]=1000"
  );
  return response.data || [];
}
