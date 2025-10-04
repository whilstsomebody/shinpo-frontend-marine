import React from "react";
import clsx from "clsx";

interface IconButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
}

const IconButton: React.FC<IconButtonProps> = ({
  children,
  type,
  onClick,
  className,
}) => {
  return (
    <button
      className={clsx("w-max rounded-full p-2 text-white text-lg", className)}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick();
      }}
      type={type}
    >
      {children}
    </button>
  );
};

export default IconButton;
