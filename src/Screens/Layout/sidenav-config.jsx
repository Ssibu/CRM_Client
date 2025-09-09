import { BiFoodMenu, BiSolidDashboard } from "react-icons/bi";
import {
  MdImageSearch,
  MdSettingsSuggest,
} from "react-icons/md";
import { RiArrowDropRightFill } from "react-icons/ri";
import { Bot } from "lucide-react";
import { GiNetworkBars } from "react-icons/gi";
import { IoIosLink } from "react-icons/io";
import { IoNotifications } from "react-icons/io5";
import { FaPenToSquare, FaUsersRectangle } from "react-icons/fa6";

export const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <BiSolidDashboard size={24} />,
      permission:null
    },
    {
      path: "/admin/menusetup",
      label: "Menu Setup",
      icon: <BiFoodMenu size={24} />,
      submenu: [
        {
          label: "Menu",
          path: "/admin/menusetup/menu",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"MS"
        },
        {
          label: "Sub Menu",
          path: "/admin/menusetup/submenu",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"SMS"
        },
        {
          label: "Sub-sub Menu",
          path: "/admin/menusetup/subsubmenu",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"SSMS"
        },
      ],
    },
    {
      path: "/admin/manage-chatbot",
      label: "Manage Chatbot",
      icon: <Bot size={24} />,
      submenu: [
        {
          label: "Chatbot Category",
          path: "/admin/manage-chatbot/chatbot-category",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"CC"
        },
        {
          label: "Chatbot Question",
          path: "/admin/manage-chatbot/chatbot-question",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"CQ"
        },
        {
          label: "Chatbot Answer",
          path: "/admin/manage-chatbot/chatbot-answer",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"CA"
        },
      ],
    },
    {
      path: "/admin/workflow",
      label: "Workflow",
      icon: <GiNetworkBars size={24} />,
      submenu: [
        {
          label: "News and Events",
          path: "/admin/workflow/news-and-events",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"NE"
        },
        {
          label: "Act and Rules",
          path: "/admin/workflow/act-and-rules",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"AR"
        },
        {
          label: "Footer Link",
          path: "/admin/workflow/footerlink",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"FL"
        },
      ],
    },
    {
      path: "/admin/generate-link",
      label: "Generate Link",
      icon: <IoIosLink size={24} />,
      permission:"GL"
    },
    {
      path: "/admin/image-setup",
      label: "Image Setup",
      icon: <MdImageSearch size={24} />,
      submenu: [
        {
          label: "Homepage Banner",
          path: "/admin/image-setup/homepage-banner",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"HB"
        },
        {
          label: "Home Admin",
          path: "/admin/image-setup/home-admin",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"HA"
        },
        {
          label: "Manage Gallery",
          path: "/admin/image-setup/manage-galary",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"MG"
        },
        {
          label: "Photo Gallery",
          path: "/admin/image-setup/photo-galary",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"PG"
        },
        {
          label: "Video Gallery",
          path: "/admin/image-setup/video-galary",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"VG"
        },
        {
          label: "Important Links",
          path: "/admin/image-setup/important-links",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"IL"
        },
      ],
    },
    {
      path: "/admin/notifications",
      label: "Notification",
      icon: <IoNotifications size={24} />,
      submenu: [
        {
          label: "Tenders",
          path: "/admin/notifications/tenders",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"NT"
        },
        {
          label: "Notices",
          path: "/admin/notifications/notices",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"NN"
        },
        {
          label: "Advertisements",
          path: "/admin/notifications/advertisements",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"NA"
        },
        
        {
          label: "Holidays",
          path: "/admin/notifications/holidays",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"NH"
        },
        {
          label: "Scheme",
          path: "/admin/notifications/scheme",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"NS"
        },
        {
          label: "Policy",
          path: "/admin/notifications/policy",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"NP"
        },
        {
          label: "Bed Strength",
          path: "/admin/notifications/bed-strength",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"NBS"
        },
        {
          label: "Forms",
          path: "/admin/notifications/forms",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"NF"
        }
      ],
    },
    {
      path: "/admin/home-config",
      label: "Home Configuration",
      icon: <MdSettingsSuggest size={24} />,
      permission:"HC"
    },
    {
      path: "/admin/directors-desk",
      label: "Director's Desk",
      icon: <FaPenToSquare size={24} />,
      permission:"DD"
    },
    {
      path: "/admin/user-management",
      label: "User Setup",
      icon: <FaUsersRectangle size={24} />,
      submenu: [
        {
          label: "Manage Users",
          path: "/admin/user-management/users",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"MU"
        },
         {
          label: "Page Permissions",
          path: "/admin/page-permission",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"PP"
        },
        {
          label: "Pages",
          path: "/admin/user-management/pages",
          icon: <RiArrowDropRightFill size={30} />,
          permission:"P"
        },
      ],
    },
  ];
