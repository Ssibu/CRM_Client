import React from "react";
import { Navigate } from "react-router-dom";
import Dashboard from "../Screens/Admin/Dashboard";
import Login from "../Screens/Auth/Login";
import SignUp from "../Screens/Auth/SignUp";
import Membership from "../Screens/Admin/Membership";
// import MenuSetUp from "../Screens/Admin/MenuSetup";
import Menu from "../Screens/Admin/Menu";
import SubMenu from "../Screens/Admin/SubMenu";
import SubSubMenu from "../Screens/Admin/SubSubMenu";
// import ManageChatbot from "../Screens/Admin/ManageChatbot";
import ChatbotCategory from "../Screens/Admin/ChatbotCategory";
import ChatbotQuestion from "../Screens/Admin/ChatbotQuestion";
import ChatbotAnswer from "../Screens/Admin/ChatbotAnswer";
import NewsAndEvents from "../Screens/Admin/NewsAndEvents";
import ActAndRules from "../Screens/Admin/ActAndRules";
import Footerlink from "../Screens/Admin/Footerlink";
import GenerateLink from "../Screens/Admin/GenerateLink";
import HomepageBanner from "../Screens/Admin/HomepageBanner";
import HomeAdmin from "../Screens/Admin/HomeAdmin";
import ManageGallary from "../Screens/Admin/ManageGallary";
import PhatoGalary from "../Screens/Admin/PhatoGalary";
import VideoGalary from "../Screens/Admin/VideoGalary";
import ImpotantLinks from "../Screens/Admin/ImpotantLinks";
import HomeConfiguration from "../Screens/Admin/HomeConfiguration";
import Tender from "../Screens/Admin/Tender";
import Notice from "../Screens/Admin/Notice";
import Advertisement from "../Screens/Admin/Advertisement";
import Scheme from "../Screens/Admin/Scheme";
import Policy from "../Screens/Admin/Policy";
import BedStrength from "../Screens/Admin/BedStrength";
import Holiday from "../Screens/Admin/Holiday";
import Forms from "../Screens/Admin/Forms_1";
import UserManagement from "../Screens/Admin/UserManagement";
import DirectorsDesk from "../Screens/Admin/DirectorsDesk";

// Import the new form component
import NewsAndEventForm from "../Screens/Admin/NewsAndEventForm"; // Assuming this is the correct path
import ActAndRuleForm from "../Screens/Admin/ActAndRuleForm";
import FooterlinkForm from "../Screens/Admin/FooterlinkForm";
import PolicyForm from "../Screens/Admin/PolicyForm";   

const userRoutes = [
  { path: "/admin/dashboard", component: <Dashboard /> },
  {
    path: "/admin/",
    exact: true,
    component: <Navigate to="/admin/dashboard" />,
  },
  // { path: "/admin/menusetup", component: <MenuSetUp /> },
  { path: "/admin/menusetup/Menu", component: <Menu /> },
  { path: "/admin/menusetup/Submenu", component: <SubMenu /> },
  { path: "/admin/menusetup/Sub-submenu", component: <SubSubMenu /> },
  // Chatbot management routes
  // { path: "/admin/manage-chatbot/chatbot-category", component: <ManageChatbot /> },
  {
    path: "/admin/manage-chatbot/chatbot-category",
    component: <ChatbotCategory />,
  },
  {
    path: "/admin/manage-chatbot/chatbot-question",
    component: <ChatbotQuestion />,
  },
  {
    path: "/admin/manage-chatbot/chatbot-answer",
    component: <ChatbotAnswer />,
  },
  // Workflow routes
  { path: "/admin/workflow/news-and-events", component: <NewsAndEvents /> },
  // ===== NEW ROUTE ADDED HERE =====
  {
    path: "/admin/workflow/news-and-events/add",
    component: <NewsAndEventForm />,
  },
  {
    path: "/admin/workflow/news-and-events/edit/:id",
    component: <NewsAndEventForm />,
  },
  // ================================
  { path: "/admin/workflow/act-and-rules", component: <ActAndRules /> },
  {
    path: "/admin/workflow/act-and-rules/add",
    component: <ActAndRuleForm />,
  },

  // Route to the "Edit" form, with a dynamic ':id' parameter
  {
    path: "/admin/workflow/act-and-rules/edit/:id",
    component: <ActAndRuleForm />,
  },
  { path: "/admin/workflow/footerlink", component: <Footerlink /> },
  {
    path: "/admin/workflow/footerlink/add",
    component: <FooterlinkForm />, // Points to the new form
  },
  {
    path: "/admin/workflow/footerlink/edit/:id",
    component: <FooterlinkForm />, // Also points to the new form
  },
  // Generate Link route
  { path: "/admin/generate-link", component: <GenerateLink /> },
  // Image Setup routes
  { path: "/admin/image-setup/homepage-banner", component: <HomepageBanner /> },
  { path: "/admin/image-setup/home-admin", component: <HomeAdmin /> },
  { path: "/admin/image-setup/manage-galary", component: <ManageGallary /> },
  { path: "/admin/image-setup/phato-galary", component: <PhatoGalary /> },
  { path: "/admin/image-setup/video-galary", component: <VideoGalary /> },
  { path: "/admin/image-setup/impotant-links", component: <ImpotantLinks /> },
  // Notification routes
  { path: "/admin/notifications/tender", component: <Tender /> },
  { path: "/admin/notifications/notice", component: <Notice /> },
  { path: "/admin/notifications/advertisement", component: <Advertisement /> },
  { path: "/admin/notifications/scheme", component: <Scheme /> },
  { path: "/admin/notifications/policy", component: <Policy /> },
  {
    path: "/admin/notifications/policy/add",
    component: <PolicyForm />,
  },
  {
    path: "/admin/notifications/policy/edit/:id",
    component: <PolicyForm />,
  },
  { path: "/admin/notifications/bed-strength", component: <BedStrength /> },
  { path: "/admin/notifications/forms", component: <Forms /> },
  { path: "/admin/notifications/holiday", component: <Holiday /> },
  // Home configuration routes
  { path: "/admin/home-config", component: <HomeConfiguration /> },
  // Directors Desk route
  { path: "/admin/directors-desk", component: <DirectorsDesk /> },
  // Membership route
  { path: "/admin/membership", component: <Membership /> },
  // User Management routes
  {
    path: "/admin/user-management/manage-users",
    component: <UserManagement />,
  },
  {
    path: "/admin/user-management/manage-pages",
    component: <UserManagement />,
  },
  { path: "/admin/user-management/pages", component: <UserManagement /> },
];

const authRoutes = [
  { path: "/", component: <Login /> },
  { path: "/sign-up", component: <SignUp /> },
];

export { userRoutes, authRoutes };