import { BiSolidDashboard } from "react-icons/bi";
import { IoBag } from "react-icons/io5";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaTruck } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";

export const sidebar: SidebarMenu[] = [
  {
    id: 0,
    type: "menu",
    title: "Home",
    icon: <IoHome />,
    slug: "/",
    children: [],
    api: "",
    notifications: false,
  },
  {
    id: 1,
    type: "dropdown",
    title: "Dashboard",
    icon: <BiSolidDashboard />,
    slug: "/dashboard",
    children: [
      {
        id: "3a",
        type: "menu",
        title: "Purchase Dashboard",
        icon: <BiSolidPurchaseTag />,
        slug: "/purchase",
        children: [],
        api: "",
        notifications: false,
      },
      {
        id: "3b",
        type: "menu",
        title: "Sales Dashboard",
        icon: <IoBag />,
        slug: "/sales",
        children: [],
        api: "",
        notifications: false,
      },
      {
        id: "3c",
        type: "menu",
        title: "Logistics Dashboard",
        icon: <FaTruck />,
        slug: "/logistics",
        children: [],
        api: "",
        notifications: false,
      },
    ],
    api: "",
    notifications: false,
  },
  {
    id: 2,
    type: "menu",
    title: "Vendor Management",
    icon: <FaPeopleGroup className="text-xl" />,
    slug: "/vendor",
    children: [],
    api: "",
    notifications: false,
  },
];

export const tableHeaders: { name: string; show: boolean }[] = [
  {
    name: "Job Code",
    show: true,
  },
  {
    name: "Job Description",
    show: true,
  },
  {
    name: "Quoted Date",
    show: true,
  },
  {
    name: "Recieve Date",
    show: true,
  },
  {
    name: "Ship Name",
    show: true,
  },
  {
    name: "Company Name",
    show: false,
  },
  {
    name: "Service Coordinator",
    show: false,
  },
  {
    name: "Status",
    show: true,
  },
  {
    name: "Action",
    show: true,
  },
];
