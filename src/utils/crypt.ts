import crypto from "node:crypto";

export function encrypt(data: string, key: string): string {
    const cipher = crypto.createCipher("aes-256-cbc", key);
    let encryptedData = cipher.update(data, "utf-8", "base64");
    encryptedData += cipher.final("base64");
    return encodeURIComponent(encryptedData);
  }
  
  export function decrypt(encryptedData: string, key: string): string {
    encryptedData = decodeURIComponent(encryptedData);
    const decipher = crypto.createDecipher("aes-256-cbc", key);
    let decryptedData = decipher.update(encryptedData, "base64", "utf-8");
    decryptedData += decipher.final("utf-8");
    return decryptedData;
  }