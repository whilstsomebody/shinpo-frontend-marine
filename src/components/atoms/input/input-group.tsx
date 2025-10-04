import React from "react";
import clsx from "clsx";

interface InputGroupProperties {
  children: React.ReactNode;
  className?: string;
  inputs?: number;
}

const InputGroup: React.FC<InputGroupProperties> = ({
  children,
  className,
  inputs,
}) => {
  return (
    <div className={clsx(`grid grid-cols-${inputs} gap-4`, className)}>
      {children}
    </div>
  );
};

export default InputGroup;
