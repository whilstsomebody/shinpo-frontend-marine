import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import arrowRight from "./../../../assets/svg/icon/arrow-right.svg";
import LogoutIcon from "./../../../assets/svg/icon/logout.svg";
import { sidebar as MenuData } from "../../../data/dashboard";
import Link from "../../atoms/link/nav-link";

import SidebarLinkGroup from "./link-group";
import AuthContext from "@/context/AuthContext";

interface DashboardSidebarProperties {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardSidebar: React.FC<DashboardSidebarProperties> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const { setAuthData } = useContext(AuthContext);
  const router = useRouter();
  const { pathname } = router;

  const trigger = useRef<React.LegacyRef<HTMLButtonElement>>(null);
  const sidebar = useRef<React.LegacyRef<HTMLElement | null>>(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  useEffect(() => {
    const storedSidebarExpanded =
      window.localStorage.getItem("sidebar-expanded");
    setSidebarExpanded(
      storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
    );
  }, []);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        // @ts-ignore
        sidebar.current.contains(target) ||
        // @ts-ignore
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };

    document.addEventListener("click", clickHandler);

    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };

    document.addEventListener("keydown", keyHandler);

    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());

    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar as React.LegacyRef<HTMLElement> | undefined}
      className={`dark:bg-boxdark shadow-lg overflow-hidden absolute left-0 top-0 z-20 flex h-full w-60 flex-col overflow-y-hidden bg-primary-white duration-300 ease-linear lg:static lg:max-w-[300px] lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="">
          <div className="mt-5 flex flex-col gap-1.5 px-4 lg:mt-4 lg:px-3">
            {MenuData.map((menu) => {
              if (menu.type === "menu") {
                const notification = 1;
                return (
                  <li key={menu.id} className="list-none">
                    <Link
                      href={`${menu.slug}`}
                      className={`relative flex items-center justify-between rounded-lg px-4 py-3 text-base font-light tracking-wide text-primary-cool-grey duration-300 ease-in-out hover:bg-primary-bright-blue/80 hover:text-primary-white ${
                        pathname === menu.slug &&
                        "bg-primary-bright-blue text-primary-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {typeof menu.icon === "string" ? (
                          <Image src={menu.icon} alt="" />
                        ) : (
                          menu.icon
                        )}
                        {menu.title}
                      </div>
                      {menu.notifications && (
                        <div className="flex items-center justify-center text-[12px] h-5 w-5 rounded-full bg-primary-bright-blue text-primary-white">
                          {notification}
                        </div>
                      )}
                    </Link>
                  </li>
                );
              } else if (menu.type === "dropdown") {
                return (
                  <SidebarLinkGroup
                    key={menu.id}
                    activeCondition={pathname.includes(menu.slug)}
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <Link
                            href={`${menu.slug}`}
                            className={`group relative flex items-center gap-2.5 rounded-lg px-4 py-2 text-base font-light tracking-wide text-primary-cool-grey duration-300 ease-in-out hover:bg-primary-bright-blue/80 hover:text-primary-white ${
                              pathname.includes(menu.slug)
                                ? " bg-primary-bright-blue text-primary-white"
                                : ""
                            }`}
                            onClick={(
                              event: React.MouseEvent<HTMLAnchorElement>
                            ) => {
                              event.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            {typeof menu.icon === "string" ? (
                              <Image src={menu.icon} alt="" />
                            ) : (
                              menu.icon
                            )}
                            {menu.title}
                            <Image
                              src={arrowRight}
                              alt=""
                              className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current transition-all ${
                                open && "rotate-90"
                              }`}
                            />
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                                fill="none"
                              />
                            </svg>
                          </Link>
                          <div
                            className={`translate transform overflow-hidden transition-all duration-300 ${
                              open ? "h-full opacity-100" : "h-0 opacity-0"
                            }`}
                          >
                            <ul className="mb-5.5 mt-4 flex flex-col gap-2 pl-2.5">
                              {menu.children.map((submenu) => {
                                return (
                                  <li key={submenu.id}>
                                    <Link
                                      href={`${menu.slug}${submenu.slug}`}
                                      className={({ isActive }) =>
                                        "group relative flex items-center gap-1.5 whitespace-nowrap rounded-md px-4 py-2 text-base text-primary-cool-grey duration-300 ease-in-out hover:bg-primary-light-bright-blue hover:text-primary-white " +
                                        (pathname.includes(submenu.slug)
                                          ? "bg-primary-bright-blue text-white"
                                          : "")
                                      }
                                    >
                                      {typeof submenu.icon === "string" ? (
                                        <Image src={submenu.icon} alt="" />
                                      ) : (
                                        submenu.icon
                                      )}
                                      {submenu.title}
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                );
              }
            })}
          </div>
          <div className="my-3 px-3"></div>
          <button
            className="center mx-auto my-2 w-10/12 justify-start gap-4 rounded-lg px-3 py-2 text-primary-cool-grey transition-all duration-300  ease-in-out hover:bg-primary-light-bright-blue/90 hover:text-white"
            onClick={() => {
              localStorage.removeItem("token");
              setAuthData(null);
              router.push("/auth/login");
            }}
          >
            <Image src={LogoutIcon} alt={""} />
            <h1 className="relative font-medium ">Logout</h1>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
