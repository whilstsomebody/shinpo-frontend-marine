import React from "react";
import { useContext } from "react";
import AuthContext from "@/context/AuthContext";
import tickgif from "@/assets/gif/tick.gif";
import Image from "next/image";
import Button from "@/components/atoms/button";
import { useRouter } from "next/router";

const VendorRegisterSuccess = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Image src={tickgif} alt="tick" />
        <h1 className="text-2xl font-semibold">
          Thank you for registering with us
        </h1>
        <p className="text-center">Now you can close this tab.</p>
      </div>
    </div>
  );
};

export default VendorRegisterSuccess;
