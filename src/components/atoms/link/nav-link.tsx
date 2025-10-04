import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface NavLinkProperties
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
  href: string;
  className?: string | (({ ...properties }: { isActive: boolean }) => string);
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProperties> = ({
  children,
  className,
  href,
  ...properties
}) => {
  const { pathname } = useRouter();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      passHref
      className={
        typeof className === "string" ? className : className?.({ isActive })
      }
      {...properties}
    >
      {children}
    </Link>
  );
};

export default NavLink;
