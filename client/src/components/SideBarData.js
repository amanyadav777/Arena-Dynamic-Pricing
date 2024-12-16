import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "Add Arena",
    path: "/add-arena",
    icon: <FaIcons.FaCartPlus />,
    cName: "nav-text",
  },
  {
    title: "Add Dynamic Pricing",
    path: "/add-dynamic-pricing",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
];
