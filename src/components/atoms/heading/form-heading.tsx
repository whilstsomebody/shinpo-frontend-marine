import React from "react";

interface FormHeadingProperties {
  heading: string;
}

const FormHeading: React.FC<FormHeadingProperties> = ({ heading }) => {
  return (
    <div className="flex items-center gap-1 overflow-hidden">
      <h6 className="font-bold text-primary-bright-blue">{heading}</h6>
      <div className="flex-1 border-b-2 relative top-[3px] border-primary-bright-blue"></div>
    </div>
  );
};

export default FormHeading;
