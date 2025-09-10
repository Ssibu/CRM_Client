// import "@/Components/User/i18n/i18n.js";
// import { LanguageProvider } from "@/context/LanguageContext.jsx";
// import Header from "@/Components/User/Layout/Header";
// import Navbar from "@/Components/User/Layout/Navbar";
// import Footer from "@/Components/User/Layout/Footer";
// import Chatbot from "@/Components/User/Layout/Chatbot";
// import Accessibility from "@/Components/User/Layout/Accessibility";
// import Sidebar from "@/Components/User/Layout/Sidebar";
// import { useLocation } from "react-router-dom";
// import { AccessibilityProvider } from "@/context/AccessibilityContext";

// const NonAuthLayout = ({ children }) => {
//   const location = useLocation();
//   const isHomePage = location.pathname === "/";

//   return (
//     <>
//       <div className="flex flex-col min-h-screen">
//         <AccessibilityProvider>
//           <LanguageProvider>
//             <Header />
//             <Navbar />
//             {isHomePage ? (
//               <main className="flex-grow pb-24 w-full overflow-y-auto">
//                 {children}
//               </main>
//             ) : (
//               <div className="flex flex-1 h-screen overflow-hidden">
//                 <Sidebar />
//                 <main className="flex-grow pb-24 w-full overflow-y-auto">
//                   {children}
//                 </main>
//               </div>
//             )}
//             <Footer />
//             <Accessibility />
//             <Chatbot />
//           </LanguageProvider>
//         </AccessibilityProvider>
//       </div>
//     </>
//   );
// };

// export default NonAuthLayout;


import React from "react";
import "@/Components/User/i18n/i18n.js";
import { useLocation } from "react-router-dom";
import { LanguageProvider } from "@/context/LanguageContext.jsx";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import { NavigationProvider, useNavigation } from "@/context/NavigationContext"; 
import Header from "@/Components/User/Layout/Header";
import Navbar from "@/Components/User/Layout/Navbar";
import Footer from "@/Components/User/Layout/Footer";
import Chatbot from "@/Components/User/Layout/Chatbot";
import Accessibility from "@/Components/User/Layout/Accessibility";
import Sidebar from "@/Components/User/Layout/Sidebar";

const LayoutContent = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const { settings, loading } = useNavigation(); 

  const showSidebar = !isHomePage && !loading && settings?.showInnerpageSidebar;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      {isHomePage ? (
        <main className="flex-grow pb-24 w-full overflow-y-auto">
          {children}
        </main>
      ) : (
        <div className="flex flex-1 h-screen overflow-hidden">
          {showSidebar && <Sidebar />}
          <main className="flex-grow pb-24 w-full overflow-y-auto">
            {children}
          </main>
        </div>
      )}
      <Footer />
      <Accessibility />
      {settings?.showChatbot && <Chatbot />}
    </div>
  );
};

const NonAuthLayout = ({ children }) => {
  return (
    <AccessibilityProvider>
      <LanguageProvider>
        <NavigationProvider> 
          <LayoutContent>{children}</LayoutContent>
        </NavigationProvider>
      </LanguageProvider>
    </AccessibilityProvider>
  );
};

export default NonAuthLayout;