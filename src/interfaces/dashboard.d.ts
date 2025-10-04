declare interface SidebarMenu {
  id: number | string;
  type: "menu" | "dropdown" | "item";
  title: string;
  icon: React.ReactNode | string;
  slug: string;
  children: SidebarMenu[];
  api: string;
  notifications: boolean;
}

declare interface JobType {
  id: number | string;
  jobCode: string;
  spares: SpareType[];
  receivedAt: string | undefined;
  quotedAt: string | undefined;
  shipName: string;
  rfqs?: any;
  company: CompanyType;
  assignedTo: ServiceCoordinatorType;
  poNumber: string | undefined;
  status: JobStatus;
  purchaseStatus: PurchaseStatus;
  type: JobNature | undefined;
  jobClosedStatus: "JOBCOMPLETED" | "JOBCANCELLED" | undefined;
  services: ServiceType[];
  invoiceDate: Date | undefined;
  targetPort: string;
  vesselETA: string | undefined;
  description: string | undefined;
  notification:
    | {
        body: string;
        title: string;
        timestamp: string;
        viewed: boolean;
      }
    | undefined;
}

declare type JobStatus =
  | "QUERYRECEIVED"
  | "QUOTEDTOCLIENT"
  | "ORDERCONFIRMED"
  | "INVOICEAWAITED"
  | "JOBCANCELLED"
  | "PODAWAITED";

declare type PurchaseStatus =
  | "QUERYRECEIVED"
  | "RFQSENT"
  | "POISSUED"
  | "COMPLETED";

declare type JobNature = "SPARES SUPPLY" | "SERVICES";

declare interface TableHeader {
  name: string;
  show: boolean;
}

declare interface ActionModalType {
  view: {
    show: boolean;
    job: JobType | undefined;
  };
  edit: {
    show: boolean;
    job: JobType | undefined;
  };
  cancel: {
    show: boolean;
    job: JobType | undefined;
  };
  flag: {
    show: boolean;
    job: JobType | undefined;
  };
}
