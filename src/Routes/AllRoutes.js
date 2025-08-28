import React from "react";
import { Navigate } from "react-router-dom";
import Dashboard from "../Screens/Admin/Dashboard";
import Login from "../Screens/Auth/Login";
import SignUp from "../Screens/Auth/SignUp";
import Membership from "../Screens/Admin/Membership";
// import MenuSetUp from "../Screens/Admin/MenuSetup";
// import Menu from "../Screens/Admin/Menu";
// import SubMenu from "../Screens/Admin/SubMenu";
// import SubSubMenu from "../Screens/Admin/SubSubMenu";

import Menu from "../Screens/Admin/Menu";
import SubMenu from "../Screens/Admin/SubMenu";
import AddSubMenu from "../Screens/Admin/AddSubMenu";

// -----------------------
import SubSubMenu from "../Screens/Admin/SubSubMenu";
import AddSubSubMenu from "../Screens/Admin/AddSubSubMenu";

import NewsAndEvents from "../Screens/Admin/NewsAndEvents";
import ActAndRules from "../Screens/Admin/ActAndRules";
import Footerlink from "../Screens/Admin/Footerlink";
import GenerateLink from "../Screens/Admin/GenerateLink";
import HomeAdmin from "../Screens/Admin/HomeAdmin";
import ManageGallary from "../Screens/Admin/ManageGallary";
import PhatoGalary from "../Screens/Admin/PhatoGalary";
import VideoGalary from "../Screens/Admin/VideoGalary";
import ImpotantLinks from "../Screens/Admin/ImpotantLinks";
import HomeConfiguration from "../Screens/Admin/HomeConfiguration";
import Notice from "../Screens/Admin/Notice";
import Advertisement from "../Screens/Admin/Advertisement";
import Scheme from "../Screens/Admin/Scheme";
import Policy from "../Screens/Admin/Policy";
import BedStrength from "../Screens/Admin/BedStrength";
import Holiday from "../Screens/Admin/Holiday";
import Forms from "../Screens/Admin/Forms_1";
import UserManagement from "../Screens/Admin/UserManagement";
import DirectorsDesk from "../Screens/Admin/DirectorsDesk";

import PageForm from "../Screens/Admin/ManageUser/PageForm"
import PageList from "../Screens/Admin/ManageUser/PageList"
import AssignPermissionPage from "../Screens/Admin/ManageUser/PagePermission"
import UserList from "../Screens/Admin/ManageUser/UserList";
import UserForm from "../Screens/Admin/ManageUser/UserForm";
import TenderFormPage  from "../Screens/Admin/Notifications/Tenders/AddTenderPage"
import TenderListPage from "../Screens/Admin/Notifications/Tenders/TenderListPage"
import ManageCorrigendumsPage from "../Screens/Admin/Notifications/Tenders/Corrigendum/CorrigendumPage"
import HomepageBannerList from "../Screens/Admin/ImageSetup/HomepageBannerList";
import HomePageBannerForm from "../Screens/Admin/ImageSetup/HomePageBannerForm"
import FormForm from "../Screens/Admin/FormForm";


//workflow

import NewsAndEventForm from "../Screens/Admin/NewsAndEventForm";
import ActAndRuleForm from "../Screens/Admin/ActAndRuleForm";
import FooterlinkForm from "../Screens/Admin/FooterLinkForm";
import PolicyForm from "../Screens/Admin/PolicyForm";   
import SchemeForm from "../Screens/Admin/SchemeForm";


//chatbot

import ChatBotTable from "../Screens/Admin/Chatbot/ChatBotTable";
import ChatBotQuestion from "../Screens/Admin/Chatbot/ChatBotQuestion"; 
import ChatBotAnswer from "../Screens/Admin/Chatbot/ChatBotAnswer";
import AddChatbotCategory from "../Screens/Admin/Chatbot/AddChatbotCategory";
import AddChatBotQuestion from "../Screens/Admin/Chatbot/AddChatBotQuestion"; 
import AddChatBotAnswer from "../Screens/Admin/Chatbot/AddChatBotAnswer";
import BedStrengthForm from "../Screens/Admin/BedStrengthForm";

const userRoutes = [
  { path: "/admin/dashboard", component: <Dashboard /> },
  {
    path: "/admin/",
    exact: true,
    component: <Navigate to="/admin/dashboard" />,
  },
  // { path: "/admin/menusetup", component: <MenuSetUp /> },

//s:menu
    { path: "/admin/menusetup/menu", component: <Menu /> },
    { path: "/admin/menusetup/submenu", component: <SubMenu /> },
    //Add sub menu link
    { path: "/admin/menusetup/submenu/create", component: <AddSubMenu /> },

//edit structure
  { path: "/admin/menusetup/menu/add", component: <Membership /> },
     { path: "/admin/menusetup/menu/edit/:id", component: <Membership /> },
// edit submenu
     { path: "/admin/menusetup/submenu/edit/:id", component: <AddSubMenu /> },

{path:"/admin/menusetup/subsubmenu", component: <SubSubMenu />},
// SubSubMenuForm
{path:"/admin/menusetup/subsubmenu/create", component: <AddSubSubMenu />},

{ path: "/admin/menusetup/subsubmenu/edit/:id", component: <AddSubSubMenu /> },
















  // { path: "/admin/manage-chatbot/chatbot-category", component: <ManageChatbot /> },
  {
    path: "/admin/manage-chatbot/chatbot-category",
    component: <ChatBotTable />,
  },
  { 
    path: "/admin/manage-chatbot/add-category", 
    component: <AddChatbotCategory /> 
  },
  { 
    path: "/admin/manage-chatbot/edit-category/:id", 
    component: <AddChatbotCategory /> 
  },
  {
    path: "/admin/manage-chatbot/chatbot-question",
    component: <ChatBotQuestion />, // Fixed: Capital B
  },
  { 
    path: "/admin/manage-chatbot/add-question", 
    component: <AddChatBotQuestion /> 
  },
  { 
    path: "/admin/manage-chatbot/edit-question/:id", 
    component: <AddChatBotQuestion /> 
  },
  {
    path: "/admin/manage-chatbot/chatbot-answer",
    component: <ChatBotAnswer />, // Fixed: Capital B
  },
  { 
    path: "/admin/manage-chatbot/add-answer", 
    component: <AddChatBotAnswer /> 
  },
  { 
    path: "/admin/manage-chatbot/edit-answer/:id", 
    component: <AddChatBotAnswer /> 
  },
  // Workflow routes
  {
    path: "/admin/workflow/news-and-events/add",
    component: <NewsAndEventForm />,
  },
   {
    path: "/admin/workflow/news-and-events",
    component: <NewsAndEvents />,
  },
  {
    path: "/admin/workflow/news-and-events/edit/:id",
    component: <NewsAndEventForm />,
  },
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
  // { path: "/admin/image-setup/homepage-banner", component: <HomepageBanner /> },
  { path: "/admin/image-setup/home-admin", component: <HomeAdmin /> },
  { path: "/admin/image-setup/manage-galary", component: <ManageGallary /> },
  { path: "/admin/image-setup/phato-galary", component: <PhatoGalary /> },
  { path: "/admin/image-setup/video-galary", component: <VideoGalary /> },
  { path: "/admin/image-setup/impotant-links", component: <ImpotantLinks /> },
  // Notification routes
  { path: "/admin/notifications/tenders", component: <TenderListPage /> },
    { path: "/admin/notifications/tenders/add", component: <TenderFormPage /> },
        { path: "/admin/notifications/tenders/edit/:id", component: <TenderFormPage /> },
           {path:"/admin/notifications/tenders/:tenderId/corrigendums", component: <ManageCorrigendumsPage /> },
  { path: "/admin/notifications/notice", component: <Notice /> },
  { path: "/admin/notifications/advertisement", component: <Advertisement /> },

  
//noti

  { path: "/admin/notifications/scheme", component: <Scheme /> },
  {
    path: "/admin/notifications/scheme/add",
    component: <SchemeForm />,
  },
  {
    path: "/admin/notifications/scheme/edit/:id",
    component: <SchemeForm />,
  },
  { path: "/admin/notifications/policy", component: <Policy /> },
  {
    path: "/admin/notifications/policy/add",
    component: <PolicyForm />,
  },
  {
    path: "/admin/notifications/policy/edit/:id",
    component: <PolicyForm />
  },


  { path: "/admin/notifications/bed-strength", component: <BedStrength /> },
  
  {
    path: "/admin/notifications/bed-strength/add",
    component: <BedStrengthForm />,
  },
  {
    path: "/admin/notifications/bed-strength/edit/:id",
    component: <BedStrengthForm />,
  },
  
  { path: "/admin/notifications/forms", component: <Forms /> },
  {
    path: "/admin/notifications/forms/add",
    component: <FormForm />,
  },
  {
    path: "/admin/notifications/forms/edit/:id",
    component: <FormForm />,
  },
  { path: "/admin/notifications/holiday", component: <Holiday /> },
  // Home configuration routes
  { path: "/admin/home-config", component: <HomeConfiguration /> },
  // Directors Desk route
  { path: "/admin/directors-desk", component: <DirectorsDesk /> },
  // Membership route
  { path: "/admin/membership", component: <Membership /> },


{ path: "/admin/image-setup/homepage-banner", component: <HomepageBannerList /> },
    { path: "/admin/image-setup/homepage-banner/add", component: <HomePageBannerForm/> },
    { path: "/admin/image-setup/homepage-banner/edit/:id", component: <HomePageBannerForm/> },





  {
    path: "/admin/user-management/manage-pages",
    component: <UserManagement />,
  },
    { path: "/admin/user-management/pages", component: <PageList /> },
    { path: "/admin/user-management/pages/add", component: <PageForm /> },
    { path: "/admin/user-management/pages/edit/:id", component: <PageForm /> },
    {
    path: "/admin/page-permission",
    component: <AssignPermissionPage />,
  },

    { path: "/admin/user-management/users", component: <UserList /> },
    { path: "/admin/user-management/users/add", component: <UserForm /> },
    { path: "/admin/user-management/users/edit/:id", component: <UserForm /> },
];

const authRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/sign-up", component: <SignUp /> },
];

export { userRoutes, authRoutes };
