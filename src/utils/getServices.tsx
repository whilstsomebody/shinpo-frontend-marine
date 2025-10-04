import instance from "@/config/axios.config";
import parseAttributes from "./parse-data";

const getServices = async () => {
  const response = await instance.get(
    "/services?pagination[page]=1&pagination[pageSize]=1000"
  );
  return parseAttributes(response.data.data);
};

export default getServices;
