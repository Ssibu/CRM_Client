

// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { menuItems } from "./sidenav-config";
// import { FiChevronDown, FiChevronRight } from "react-icons/fi";

// const SidebarsContent = ({ permissions = [], isAdmin = false }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [selectedItem, setSelectedItem] = useState(location.pathname);
//   const [expandedMenu, setExpandedMenu] = useState(null);

//   useEffect(() => {
//     setSelectedItem(location.pathname);

//     const matchingParent = menuItems.find((item) =>
//       item.submenu?.some((sub) => sub.path === location.pathname)
//     );
//     if (matchingParent) {
//       setExpandedMenu(matchingParent.path);
//     }
//   }, [location.pathname]);

//   const handleClick = (path, hasSubmenu = false) => {
//     if (hasSubmenu) {
//       setExpandedMenu((prev) => (prev === path ? null : path));
//     } else {
//       navigate(path);
//       setSelectedItem(path);
//     }
//   };

//   const classes = {
//     active:
//       "flex items-center justify-between px-4 py-3 mt-2 text-md font-semibold tracking-wide text-white bg-[#2E3A8C] rounded-lg cursor-pointer transition-all duration-300",
//     inactive:
//       "flex items-center justify-between px-4 py-3 mt-2 text-md font-semibold tracking-wide text-[#49608c] rounded-lg cursor-pointer hover:text-white hover:bg-[#4F68A4] transition-all duration-300",
//     subItem:
//       "flex items-center gap-2 ml-2 mt-1 px-3 py-2 text-sm text-[#49608c] hover:text-white hover:bg-[#6b82b1] rounded-md cursor-pointer transition-all duration-200 truncate",
//     subItemActive:
//       "flex items-center gap-2 ml-2 mt-1 px-3 py-2 text-sm text-white bg-[#2E3A8C] rounded-md cursor-pointer transition-all duration-200 truncate",
//   };

//   // Check if a menu item is allowed
//   const canAccess = (permission) => {
//     if (isAdmin) return true; // admins see everything
//     if (!permission) return true; // no permission required
//     return permissions.includes(permission);
//   };

//   return (
//     <div>
//       {menuItems.map((item) => {
//         if (!canAccess(item.permission)) {
//           return null;
//         }

//         const isActive = selectedItem.startsWith(item.path);
//         const isExpanded = expandedMenu === item.path;

//         // Filter submenu based on permissions
//         const visibleSubmenu = item.submenu
//           ? item.submenu.filter((sub) => canAccess(sub.permission))
//           : [];

//         // If item has no submenu and no permission, skip
//         if (item.submenu && visibleSubmenu.length === 0 && !isAdmin) {
//           return null;
//         }

//         return (
//           <div key={item.path}>
//             <div
//               className={isActive ? classes.active : classes.inactive}
//               onClick={() => handleClick(item.path, !!item.submenu)}
//             >
//               <div className="flex items-center">
//                 {item.icon}
//                 <span className="ml-2 truncate">{item.label}</span>
//               </div>
//               {item.submenu &&
//                 (isExpanded ? <FiChevronDown /> : <FiChevronRight />)}
//             </div>

//             {/* Submenu */}
//             {item.submenu && (
//               <div
//                 className={`transition-all duration-300 overflow-hidden ${
//                   isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
//                 }`}
//               >
//                 {visibleSubmenu.map((sub) => (
//                   <div
//                     key={sub.path}
//                     className={
//                       selectedItem === sub.path
//                         ? classes.subItemActive
//                         : classes.subItem
//                     }
//                     onClick={() => handleClick(sub.path)}
//                   >
//                     {sub.icon}
//                     <span className="truncate">{sub.label}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default SidebarsContent;

import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { menuItems } from "./sidenav-config"; // Assuming your config is here
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

const SidebarsContent = ({ permissions = [], isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItem, setSelectedItem] = useState(location.pathname);
  const [expandedMenu, setExpandedMenu] = useState(null);

  useEffect(() => {
    const currentPath = location.pathname;
    setSelectedItem(currentPath);

    // --- FIX #1: Use startsWith to find the parent menu ---
    // This ensures the correct parent menu expands on page load/refresh,
    // even if you are on a deeply nested route like /create or /edit.
    const matchingParent = menuItems.find((item) =>
      item.submenu?.some((sub) => currentPath.startsWith(sub.path))
    );

    if (matchingParent) {
      setExpandedMenu(matchingParent.path);
    }
  }, [location.pathname]);

  const handleClick = (path, hasSubmenu = false) => {
    if (hasSubmenu) {
      setExpandedMenu((prev) => (prev === path ? null : path));
    } else {
      navigate(path);
      setSelectedItem(path);
    }
  };

  const classes = {
    active:
      "flex items-center justify-between px-4 py-3 mt-2 text-md font-semibold tracking-wide text-white bg-[#2E3A8C] rounded-lg cursor-pointer transition-all duration-300",
    inactive:
      "flex items-center justify-between px-4 py-3 mt-2 text-md font-semibold tracking-wide text-[#49608c] rounded-lg cursor-pointer hover:text-white hover:bg-[#4F68A4] transition-all duration-300",
    subItem:
      "flex items-center gap-2 ml-2 mt-1 px-3 py-2 text-sm text-[#49608c] hover:text-white hover:bg-[#6b82b1] rounded-md cursor-pointer transition-all duration-200 truncate",
    subItemActive:
      "flex items-center gap-2 ml-2 mt-1 px-3 py-2 text-sm text-white bg-[#2E3A8C] rounded-md cursor-pointer transition-all duration-200 truncate",
  };

  const canAccess = (permission) => {
    if (isAdmin) return true;
    if (!permission) return true;
    return permissions.includes(permission);
  };

  return (
    <div>
      {menuItems.map((item) => {
        if (!canAccess(item.permission)) {
          return null;
        }

        const isRootPath = item.path === "/";
        const isActive = isRootPath
          ? selectedItem === item.path
          : selectedItem.startsWith(item.path);
        
        const isExpanded = expandedMenu === item.path;
        
        const visibleSubmenu = item.submenu
          ? item.submenu.filter((sub) => canAccess(sub.permission))
          : [];
          
        if (item.submenu && visibleSubmenu.length === 0 && !isAdmin) {
          return null;
        }

        return (
          <div key={item.path}>
            <div
              className={isActive ? classes.active : classes.inactive}
              onClick={() => handleClick(item.path, !!item.submenu)}
            >
              <div className="flex items-center">
                {item.icon}
                <span className="ml-2 truncate">{item.label}</span>
              </div>
              {item.submenu &&
                (isExpanded ? <FiChevronDown /> : <FiChevronRight />)}
            </div>

            {item.submenu && (
              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {visibleSubmenu.map((sub) => (
                  // --- FIX #2: Use startsWith for the active sub-item class ---
                  // This ensures the sub-item stays highlighted when you
                  // navigate to one of its children pages.
                  <div
                    key={sub.path}
                    className={
                      selectedItem.startsWith(sub.path)
                        ? classes.subItemActive
                        : classes.subItem
                    }
                    onClick={() => handleClick(sub.path)}
                  >
                    {sub.icon}
                    <span className="truncate">{sub.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SidebarsContent;