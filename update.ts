import parseAttributes from "@/utils/parse-data";

const axios = require("axios");

const getRFQS = async (RFQNumber: string) => {
  const response = await axios.get(
    `https://strapi.shinpoengineering.com/api/rfqs?publicationState=preview&filters[RFQNumber][$eq]=${RFQNumber}`,
    {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzA2ODgyMzI5LCJleHAiOjE3MDk0NzQzMjl9.KbyPt4Wcg7Maz0Tsb1Tk2f5ftkOmvCgVed3cXM9wzUI`,
      },
    }
  );
  return parseAttributes(response.data);
};
