import instance from "@/config/axios.config";

export const getEngineers: () => Promise<
  {
    id: number;
    username: string;
    fullname: string;
    email: string;
    phone: string;
    designation: string;
  }[]
> = async () => {
  const response = await instance.get(
    "/users?pagination[page]=1&pagination[pageSize]=1000"
  );
  return response.data || [];
};
