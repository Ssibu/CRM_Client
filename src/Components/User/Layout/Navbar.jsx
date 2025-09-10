



// import React, { useState } from "react";
// import { NavLink } from "react-router-dom";
// import { Home as HomeIcon, Menu, X } from "lucide-react";
// import { IoChevronDown, IoAddOutline } from "react-icons/io5";
// import { FiPlus } from "react-icons/fi";

// const Navbar = () => {
//   const [activeDropdown, setActiveDropdown] = useState(null);
//   const [activeSubmenu, setActiveSubmenu] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [mobileDropdown, setMobileDropdown] = useState(null);
//   const [mobileSubmenu, setMobileSubmenu] = useState(null);

//   const navItems = [
//     { name: "", path: "/", icon: <HomeIcon className="w-5 h-5" /> },
//     {
//       name: "About Us",
//       submenu: [
//         { name: "Organogram", path: "/about/organogram" },
//         {
//           name: "Who is Who",
//           path: "/about/who-is-who",
//           subsubmenu: [
//             { name: "Leadership", path: "/about/who-is-who/leadership" },
//             { name: "Department Heads", path: "/about/who-is-who/department-heads" },
//             { name: "Staff Directory", path: "/about/who-is-who/staff" },
//           ],
//         },
//       ],
//     },
//     {
//       name: "Act & Rules",
//       submenu: [
//         { name: "Act & Rules", path: "/act-rules" },
//         {
//           name: "Programs",
//           path: "/programs",
//           subsubmenu: [
//             { name: "Health Programs", path: "/programs/health" },
//             { name: "Education Programs", path: "/programs/education" },
//             { name: "Community Programs", path: "/programs/community" },
//           ],
//         },
//         {
//           name: "Forms",
//           path: "/forms",
//           subsubmenu: [
//             { name: "Application Forms", path: "/forms/application" },
//             { name: "Registration Forms", path: "/forms/registration" },
//             { name: "Request Forms", path: "/forms/request" },
//           ],
//         },
//       ],
//     },
//     { name: "Citizen Corner", path: "/citizen-corner" },
//     {
//       name: "Notice",
//       submenu: [
//         { name: "Notice and Advertisement", path: "/notice/advertisement" },
//         { name: "News & Events", path: "/notice/news-events" },
//         { name: "Tenders", path: "/notice/tenders" },
//       ],
//     },
//     { name: "RTI", path: "/rti" },
//     { name: "Health Institutions", path: "/health-institutions" },
//     {
//       name: "Gallery",
//       submenu: [
//         { name: "Photo Gallery", path: "/gallery/photos" },
//         { name: "Video Gallery", path: "/gallery/videos" },
//       ],
//     },
//     { name: "Contact Us", path: "/contact" },
//   ];

//   return (
//     <nav className="bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)] text-white px-6 py-3 shadow-lg relative">
//       {/* Mobile toggle */}
//       <div className="flex justify-between items-center md:hidden">
//         {/* <h1 className="font-bold text-lg">MySite</h1> */}
//         <button onClick={() => setMobileOpen(!mobileOpen)}>
//           {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//       </div>

//       {/* Desktop Menu */}
//       <ul className="hidden md:flex justify-center space-x-6">
//         {navItems.map((item, idx) => (
//           <li
//             key={idx}
//             className="relative group"
//             onMouseEnter={() => setActiveDropdown(idx)}
//             onMouseLeave={() => {
//               setActiveDropdown(null);
//               setActiveSubmenu(null);
//             }}
//           >
//             <NavLink
//               to={item.path || "#"}
//               className="flex items-center space-x-1 hover:text-yellow-300"
//             >
//               {item.icon && item.icon}
//               <span>{item.name}</span>
//               {item.submenu && <FiPlus  className="ml-1 w-4 h-4" />}
//             </NavLink>

//             {/* Submenu */}
//             {item.submenu && activeDropdown === idx && (
//               <ul className="absolute left-1/2 transform -translate-x-1/2 top-full mt-0 w-56 bg-white text-black shadow-lg rounded-lg py-2 z-20">
//                 {item.submenu.map((sub, subIdx) => (
//                   <li
//                     key={subIdx}
//                     className="relative group"
//                     onMouseEnter={() => setActiveSubmenu(subIdx)}
//                     onMouseLeave={() => setActiveSubmenu(null)}
//                   >
//                     <NavLink
//                       to={sub.path || "#"}
//                       className="flex justify-between items-center px-4 py-2 hover:bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)]"
//                     >
//                       <span>{sub.name}</span>
//                       {sub.subsubmenu && <IoAddOutline className="w-4 h-4" />}
//                     </NavLink>

//                     {/* Sub-submenu */}
//                     {sub.subsubmenu && activeSubmenu === subIdx && (
//                       <ul className="absolute left-full top-0 ml-1 w-56 bg-white text-black shadow-lg rounded-lg py-2 z-30">
//                         {sub.subsubmenu.map((subsub, subsubIdx) => (
//                           <li key={subsubIdx}>
//                             <NavLink
//                               to={subsub.path}
//                               className="block px-4 py-2 hover:bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)]"
//                             >
//                               {subsub.name}
//                             </NavLink>
//                           </li>
//                         ))}
//                       </ul>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <ul className="md:hidden mt-3 bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)] rounded-lg shadow-lg text-center">
//           {navItems.map((item, idx) => (
//             <li key={idx} className="border-b border-blue-500">
//               <button
//                 onClick={() =>
//                   setMobileDropdown(mobileDropdown === idx ? null : idx)
//                 }
//                 className="flex justify-between items-center w-full px-4 py-3 text-left"
//               >
//                 <span className="flex items-center space-x-2">
//                   {item.icon && item.icon}
//                   <span>{item.name}</span>
//                 </span>
//                 {item.submenu && <IoAddOutline className="w-4 h-4" />}
//               </button>

//               {/* Mobile Submenu */}
//               {item.submenu && mobileDropdown === idx && (
//                 <ul className="bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)]">
//                   {item.submenu.map((sub, subIdx) => (
//                     <li key={subIdx}>
//                       <button
//                         onClick={() =>
//                           setMobileSubmenu(mobileSubmenu === subIdx ? null : subIdx)
//                         }
//                         className="flex justify-between items-center w-full px-6 py-2 text-left"
//                       >
//                         <span>{sub.name}</span>
//                         {sub.subsubmenu && <IoAddOutline className="w-4 h-4" />}
//                       </button>

//                       {/* Mobile Sub-submenu */}
//                       {sub.subsubmenu && mobileSubmenu === subIdx && (
//                         <ul className="bg-blue-400">
//                           {sub.subsubmenu.map((subsub, subsubIdx) => (
//                             <li key={subsubIdx}>
//                               <NavLink
//                                 to={subsub.path}
//                                 className="block px-8 py-2 hover:bg-blue-300"
//                               >
//                                 {subsub.name}
//                               </NavLink>
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//           ))}
//         </ul>
//       )}
//     </nav>
//   );
// };

// export default Navbar;








// import React, { useState, useEffect } from "react";
// import { NavLink } from "react-router-dom";
// import axios from "axios";
// import { Home as HomeIcon, Menu, X } from "lucide-react";
// import { IoAddOutline } from "react-icons/io5";
// import { FiPlus } from "react-icons/fi";
// import { IoMdOpen } from "react-icons/io";
// import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";

// const getLinkPath = (level, slug) => {
//   if (level === 0) return `/page/${slug}`;
//   if (level === 1) return `/subpage/${slug}`;
//   if (level === 2) return `/sub-subpage/${slug}`;
//   return `/${slug}`;
// };

// const Navbar = () => {
//   const { translate } = useGlobalTranslation();
//   const [menuItems, setMenuItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [mobileDropdown, setMobileDropdown] = useState(null);
//   const [mobileSubmenu, setMobileSubmenu] = useState(null);

//   useEffect(() => {
//     const fetchNavItems = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_API_BASE_URL}/menus`
//         );
//         setMenuItems(response.data);
//       } catch (err) {
//         setError(err.message);
//         console.error("Failed to fetch navigation items:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchNavItems();
//   }, []);

//   if (isLoading) {
//     return (
//       <nav className="bg-white border-b border-gray-200">
//         <div className="text-center p-4">Loading...</div>
//       </nav>
//     );
//   }

//   if (error) {
//     return (
//       <nav className="bg-white border-b border-gray-200">
//         <div className="text-center p-4 text-red-500">Error: {error}</div>
//       </nav>
//     );
//   }

//   const LinkComponent = ({ item, level, className, children }) => {
//     const hasChildren =
//       (item.SubMenus && item.SubMenus.length > 0) ||
//       (item.SubSubMenus && item.SubSubMenus.length > 0);

//     if (hasChildren) {
//       return <div className={className}>{children}</div>;
//     }

//     if (item.link) {
//       return (
//         <a
//           href={item.link}
//           target="_blank"
//           rel="noopener noreferrer"
//           className={className}
//         >
//           <span className="flex gap-1 items-center">
//             {children} <IoMdOpen />
//           </span>
//         </a>
//       );
//     }

//     return (
//       <NavLink to={getLinkPath(level, item.slug)} className={className}>
//         {children}
//       </NavLink>
//     );
//   };

//   return (
//     <nav className="bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)] text-white px-6 py-3 shadow-lg relative">
//       {/* Mobile Toggle */}
//       <div className="flex justify-between items-center md:hidden">
//         <button onClick={() => setMobileOpen(!mobileOpen)}>
//           {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//         </button>
//       </div>

//       {/* Desktop Menu (hover with CSS only) */}
//       <ul className="hidden md:flex justify-center items-center space-x-6">
//         <li className="relative group">
//           <NavLink
//             to="/"
//             className="flex items-center space-x-1 hover:text-yellow-300"
//           >
//             <HomeIcon className="w-5 h-5" />
//           </NavLink>
//         </li>

//         {menuItems.map((item) => {
//           const hasChildren = item.SubMenus && item.SubMenus.length > 0;
//           return (
//             <li key={item.id} className="relative group">
//               <LinkComponent
//                 item={item}
//                 level={0}
//                 className="flex items-center space-x-1 hover:text-yellow-300 cursor-pointer"
//               >
//                 <span>{translate(item, "title")}</span>
//                 {hasChildren && <FiPlus className="ml-1 w-4 h-4" />}
//               </LinkComponent>

//               {hasChildren && (
//                 <ul className="absolute left-1/2 transform -translate-x-1/2 top-full mt-0 w-56 bg-white text-black shadow-lg rounded-lg py-2 z-20 hidden group-hover:block">
//                   {item.SubMenus.map((sub) => {
//                     const hasSubChildren =
//                       sub.SubSubMenus && sub.SubSubMenus.length > 0;
//                     return (
//                       <li key={sub.id} className="relative group">
//                         <LinkComponent
//                           item={sub}
//                           level={1}
//                           className="flex justify-between items-center px-4 py-2 hover:bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)]"
//                         >
//                           <span>{translate(sub, "title")}</span>
//                           {hasSubChildren && (
//                             <IoAddOutline className="w-4 h-4" />
//                           )}
//                         </LinkComponent>

//                         {hasSubChildren && (
//                           <ul className="absolute left-full top-0 ml-1 w-56 bg-white text-black shadow-lg rounded-lg py-2 z-30 hidden group-hover:block">
//                             {sub.SubSubMenus.map((subsub) => (
//                               <li key={subsub.id}>
//                                 <LinkComponent
//                                   item={subsub}
//                                   level={2}
//                                   className="block px-4 py-2 hover:bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)]"
//                                 >
//                                   {translate(subsub, "title")}
//                                 </LinkComponent>
//                               </li>
//                             ))}
//                           </ul>
//                         )}
//                       </li>
//                     );
//                   })}
//                 </ul>
//               )}
//             </li>
//           );
//         })}
//       </ul>

//       {/* Mobile Menu (click toggle, React state) */}
//       {mobileOpen && (
//         <ul className="md:hidden mt-3 bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)] rounded-lg shadow-lg text-center">
//           <li className="border-b border-blue-500">
//             <NavLink
//               to="/"
//               className="flex items-center space-x-2 w-full px-4 py-3 text-left"
//             >
//               <HomeIcon className="w-5 h-5" />
//             </NavLink>
//           </li>
//           {menuItems.map((item, idx) => {
//             const hasChildren = item.SubMenus && item.SubMenus.length > 0;
//             const content = (
//               <span className="flex items-center space-x-2">
//                 <span>{translate(item, "title")}</span>
//               </span>
//             );
//             return (
//               <li key={item.id} className="border-b border-blue-500">
//                 {hasChildren ? (
//                   <button
//                     onClick={() =>
//                       setMobileDropdown(mobileDropdown === idx ? null : idx)
//                     }
//                     className="flex justify-between items-center w-full px-4 py-3 text-left"
//                   >
//                     {content}
//                     <IoAddOutline className="w-4 h-4" />
//                   </button>
//                 ) : (
//                   <LinkComponent
//                     item={item}
//                     level={0}
//                     className="flex justify-between items-center w-full px-4 py-3 text-left"
//                   >
//                     {content}
//                   </LinkComponent>
//                 )}

//                 {hasChildren && mobileDropdown === idx && (
//                   <ul className="bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)]">
//                     {item.SubMenus.map((sub, subIdx) => {
//                       const hasSubChildren =
//                         sub.SubSubMenus && sub.SubSubMenus.length > 0;
//                       return (
//                         <li key={sub.id}>
//                           {hasSubChildren ? (
//                             <button
//                               onClick={() =>
//                                 setMobileSubmenu(
//                                   mobileSubmenu === subIdx ? null : subIdx
//                                 )
//                               }
//                               className="flex justify-between items-center w-full px-6 py-2 text-left"
//                             >
//                               <span>{translate(sub, "title")}</span>
//                               <IoAddOutline className="w-4 h-4" />
//                             </button>
//                           ) : (
//                             <LinkComponent
//                               item={sub}
//                               level={1}
//                               className="flex justify-between items-center w-full px-6 py-2 text-left"
//                             >
//                               <span>{translate(sub, "title")}</span>
//                             </LinkComponent>
//                           )}

//                           {hasSubChildren && mobileSubmenu === subIdx && (
//                             <ul className="bg-blue-400">
//                               {sub.SubSubMenus.map((subsub) => (
//                                 <li key={subsub.id}>
//                                   <LinkComponent
//                                     item={subsub}
//                                     level={2}
//                                     className="block px-8 py-2 hover:bg-blue-300"
//                                   >
//                                     {translate(subsub, "title")}
//                                   </LinkComponent>
//                                 </li>
//                               ))}
//                             </ul>
//                           )}
//                         </li>
//                       );
//                     })}
//                   </ul>
//                 )}
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </nav>
//   );
// };

// export default Navbar;




import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { Home as HomeIcon, Menu, X } from "lucide-react";
import { IoAddOutline } from "react-icons/io5";
import { FiPlus } from "react-icons/fi";
import { IoMdOpen } from "react-icons/io";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";
import { useNavigation } from "@/context/NavigationContext";

const getLinkPath = (level, slug) => {
  if (level === 0) return `/page/${slug}`;
  if (level === 1) return `/subpage/${slug}`;
  if (level === 2) return `/sub-subpage/${slug}`;
  return `/${slug}`;
};

const Navbar = () => {
  const { translate } = useGlobalTranslation();
    const { navigation: menuItems, loading: isLoading, error } = useNavigation();

  // const [menuItems, setMenuItems] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);

  // useEffect(() => {
  //   const fetchNavItems = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${import.meta.env.VITE_API_BASE_URL}/menus`
  //       );
  //       setMenuItems(response.data);
  //     } catch (err) {
  //       setError(err.message);
  //       console.error("Failed to fetch navigation items:", err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchNavItems();
  // }, []);

  if (isLoading) {
    return (
      <nav className="bg-white border-b border-gray-200">
        <div className="text-center p-4">Loading...</div>
      </nav>
    );
  }

  if (error) {
    return (
      <nav className="bg-white border-b border-gray-200">
        <div className="text-center p-4 text-red-500">Error: {error}</div>
      </nav>
    );
  }

  const LinkComponent = ({ item, level, className, children }) => {
    const hasChildren =
      (item.SubMenus && item.SubMenus.length > 0) ||
      (item.SubSubMenus && item.SubSubMenus.length > 0);

    if (hasChildren) {
      return <div className={className}>{children}</div>;
    }

    if (item.link) {
      return (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          <span className="flex gap-1 items-center">
            {children} <IoMdOpen />
          </span>
        </a>
      );
    }

    return (
      <NavLink to={getLinkPath(level, item.slug)} className={className}>
        {children}
      </NavLink>
    );
  };

  return (
    <nav className="bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)] text-white px-6 py-3 shadow-lg relative">
      {/* Mobile Toggle */}
      <div className="flex justify-between items-center md:hidden">
        <button onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Menu (hover with CSS only) */}
      <ul className="hidden md:flex justify-center items-center space-x-6">
        <li className="relative group">
          <NavLink
            to="/"
            className="flex items-center space-x-1 hover:text-yellow-300"
          >
            <HomeIcon className="w-5 h-5" />
          </NavLink>
        </li>

        {menuItems.map((item) => {
          const hasChildren = item.SubMenus && item.SubMenus.length > 0;
          return (
            <li key={item.id} className="relative group">
              <LinkComponent
                item={item}
                level={0}
                className="flex items-center space-x-1 hover:text-yellow-300 cursor-pointer"
              >
                <span>{translate(item, "title")}</span>
                {hasChildren && <FiPlus className="ml-1 w-4 h-4" />}
              </LinkComponent>

              {hasChildren && (
                <ul className="absolute left-1/2 transform -translate-x-1/2 top-full mt-0 w-56 bg-white text-black shadow-lg rounded-lg py-2 z-20 hidden group-hover:block">
                  {item.SubMenus.map((sub) => {
                    const hasSubChildren =
                      sub.SubSubMenus && sub.SubSubMenus.length > 0;
                    return (
                      <li key={sub.id} className="relative group">
                        <LinkComponent
                          item={sub}
                          level={1}
                          className="flex justify-between items-center px-4 py-2 hover:bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)]"
                        >
                          <span>{translate(sub, "title")}</span>
                          {hasSubChildren && (
                            <IoAddOutline className="w-4 h-4" />
                          )}
                        </LinkComponent>

                        {hasSubChildren && (
                          <ul className="absolute left-full top-0 ml-1 w-56 bg-white text-black shadow-lg rounded-lg py-2 z-30 hidden group-hover:block">
                            {sub.SubSubMenus.map((subsub) => (
                              <li key={subsub.id}>
                                <LinkComponent
                                  item={subsub}
                                  level={2}
                                  className="block px-4 py-2 hover:bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)]"
                                >
                                  {translate(subsub, "title")}
                                </LinkComponent>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      {/* Mobile Menu (click toggle, React state) */}
      {mobileOpen && (
        <ul className="md:hidden mt-3 bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)] rounded-lg shadow-lg text-center">
          <li className="border-b border-blue-500">
            <NavLink
              to="/"
              className="flex items-center space-x-2 w-full px-4 py-3 text-left"
            >
              <HomeIcon className="w-5 h-5" />
            </NavLink>
          </li>
          {menuItems.map((item, idx) => {
            const hasChildren = item.SubMenus && item.SubMenus.length > 0;
            const content = (
              <span className="flex items-center space-x-2">
                <span>{translate(item, "title")}</span>
              </span>
            );
            return (
              <li key={item.id} className="border-b border-blue-500">
                {hasChildren ? (
                  <button
                    onClick={() =>
                      setMobileDropdown(mobileDropdown === idx ? null : idx)
                    }
                    className="flex justify-between items-center w-full px-4 py-3 text-left"
                  >
                    {content}
                    <IoAddOutline className="w-4 h-4" />
                  </button>
                ) : (
                  <LinkComponent
                    item={item}
                    level={0}
                    className="flex justify-between items-center w-full px-4 py-3 text-left"
                  >
                    {content}
                  </LinkComponent>
                )}

                {hasChildren && mobileDropdown === idx && (
                  <ul className="bg-gradient-to-r from-[rgb(78,81,229)] via-[rgb(140,140,240)] to-[rgb(251,207,125,0.98)]">
                    {item.SubMenus.map((sub, subIdx) => {
                      const hasSubChildren =
                        sub.SubSubMenus && sub.SubSubMenus.length > 0;
                      return (
                        <li key={sub.id}>
                          {hasSubChildren ? (
                            <button
                              onClick={() =>
                                setMobileSubmenu(
                                  mobileSubmenu === subIdx ? null : subIdx
                                )
                              }
                              className="flex justify-between items-center w-full px-6 py-2 text-left"
                            >
                              <span>{translate(sub, "title")}</span>
                              <IoAddOutline className="w-4 h-4" />
                            </button>
                          ) : (
                            <LinkComponent
                              item={sub}
                              level={1}
                              className="flex justify-between items-center w-full px-6 py-2 text-left"
                            >
                              <span>{translate(sub, "title")}</span>
                            </LinkComponent>
                          )}

                          {hasSubChildren && mobileSubmenu === subIdx && (
                            <ul className="bg-blue-400">
                              {sub.SubSubMenus.map((subsub) => (
                                <li key={subsub.id}>
                                  <LinkComponent
                                    item={subsub}
                                    level={2}
                                    className="block px-8 py-2 hover:bg-blue-300"
                                  >
                                    {translate(subsub, "title")}
                                  </LinkComponent>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
