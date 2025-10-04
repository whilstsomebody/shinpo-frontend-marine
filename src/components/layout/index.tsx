import React, { useContext, useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import AuthContext, { AuthProvider } from "@/context/AuthContext";
import Protected from "./Protected";

interface DashboardLayoutProperties {
  children: React.ReactNode;
  rightbar?: React.ReactNode | (() => JSX.Element);
  sidebar?: boolean;
  header?: boolean;
  className?: string;
  decoration?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProperties> = ({
  children,
  rightbar,
  className,
  decoration,
  sidebar,
  header,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useContext(AuthContext);

  return (
    <Protected>
      <div className="grid grid-rows-[auto,1fr] overflow-hidden h-screen">
        {header && (
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={user}
          />
        )}
        <div className="grid relative grid-cols-[auto,1fr,auto] overflow-hidden">
          {sidebar && (
            <Sidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          )}
          <main
            className={`${
              decoration ? decoration : "bg-white p-4"
            } ${className} col-span-2 overflow-y-auto overflow-x-hidden`}
          >
            {children}
          </main>
        </div>
      </div>
    </Protected>
  );
};

export default DashboardLayout;
