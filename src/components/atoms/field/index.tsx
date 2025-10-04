import React from "react";

interface FieldProperties {
  icon?: React.ReactNode;
  title?: string;
  value?: string;
}

const Field: React.FC<FieldProperties> = ({ icon, title, value }) => {
  return (
    <div className="grid border-[1.8px] border-yellow-600 grid-cols-[auto,1fr,auto] gap-2">
      <span className="text-2xl border-r-2 border-r-yellow-600 p-2">
        {icon}
      </span>
      <span className="text text-sm italic font-semibold uppercase p-2">
        {title}
      </span>
      <div className="p-2 border-l-2 border-l-yellow-600">{value}</div>
    </div>
  );
};

export default Field;
