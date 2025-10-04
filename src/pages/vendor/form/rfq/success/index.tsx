import React from "react";
import tickgif from "@/assets/gif/tick.gif";
import Image from "next/image";

const SuccessPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Image src={tickgif} alt="tick" />
        <h1 className="text-2xl font-semibold">
          You have successfully submitted your RFQ
        </h1>
        <p className="text-center">Now you can close this tab.</p>
      </div>
    </div>
  );
};

export default SuccessPage;
