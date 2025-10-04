import { encrypt } from "@/utils/crypt";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { rfqNumber, vendorId } = req.body;
    const origin = process.env.NEXT_PUBLIC_BASE_FRONTEND_URL;
    const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

    if (!rfqNumber || !vendorId) {
      return res.status(400).json({ message: "Malformed body" });
    }

    if (!ENCRYPTION_KEY) {
      console.error("Encryption key not found");
      return res.status(500).json({
        message: "Internal server error",
      });
    }

    return res.status(200).json({
      link: `${origin}/vendor/form/rfq/${encrypt(
        rfqNumber,
        ENCRYPTION_KEY
      )}/${encrypt(vendorId, ENCRYPTION_KEY)}`,
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
