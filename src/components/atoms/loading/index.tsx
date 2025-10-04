import React from "react";
import { RingLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <RingLoader color="#1ab3e0" />
    </div>
  );
};

export default Loading;
