import clsx from "clsx";
import React, { useEffect } from "react";

interface ModalProperties {
  children: React.ReactNode;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>> | any;
  className?: string;
  clickOutside?: boolean;
}

const Modal: React.FC<ModalProperties> = ({
  children,
  className,
  active,
  setActive,
  clickOutside = true,
}) => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEscape);
    return () => {
      clickOutside && document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      {active && (
        <div className="fixed z-30 cursor-default inset-0 overflow-hidden">
          <div className="flex items-center justify-center h-screen">
            <div
              className="fixed inset-0 bg-black opacity-30"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                clickOutside && setActive(false);
              }}
            ></div>
            <div
              className={clsx(
                "bg-white rounded-lg z-[100] py-8 px-6",
                className
              )}
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Modal as default };
