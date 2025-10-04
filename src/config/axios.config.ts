import axios from "axios";

const token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;

if (!token) {
  throw new Error("API_SALT_TOKEN is not defined");
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export default instance;
