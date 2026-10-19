import type { ReactNode } from "react";
import { NavLink, type NavLinkProps } from "react-router";

type FocusLinkProps = Omit<NavLinkProps, "to" | "children"> & {
  to: string | { pathname: string; search?: string };
  children: ReactNode;
};

const FocusLink = ({ to, children, ...props }: FocusLinkProps) => (
  <NavLink to={to} {...props}>
    {children}
  </NavLink>
);

export default FocusLink;
