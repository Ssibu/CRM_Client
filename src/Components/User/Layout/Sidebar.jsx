import React, { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { IoAddOutline } from "react-icons/io5";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";
import { useNavigation } from "@/context/NavigationContext"; 

const getLinkPath = (level, slug) => {
  if (level === 0) return `/page/${slug}`;
  if (level === 1) return `/subpage/${slug}`;
  if (level === 2) return `/sub-subpage/${slug}`;
  return `/${slug}`;
};

const Sidebar = () => {
  const { translate } = useGlobalTranslation();
    const { navigation: menuItems, loading: isLoading, error } = useNavigation();

  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  
  const filteredNavItems = useMemo(() => {
    if (!menuItems.length) return [];

    const pathSegments = location.pathname.split('/').filter(Boolean);
    const pageType = pathSegments[0];
    const currentSlug = pathSegments[1];

    switch (pageType) {
      // If on a sub-page, find its parent and show only that menu tree
      case 'subpage': {
        const parentMenu = menuItems.find(menu =>
          menu.SubMenus?.some(sub => sub.slug === currentSlug)
        );
        return parentMenu ? [parentMenu] : menuItems; // Fallback to all items
      }
      
      // If on a sub-sub-page, find its grandparent and show only that menu tree
      case 'sub-subpage': {
        const grandParentMenu = menuItems.find(menu =>
          menu.SubMenus?.some(sub =>
            sub.SubSubMenus?.some(subSub => subSub.slug === currentSlug)
          )
        );
        return grandParentMenu ? [grandParentMenu] : menuItems;
      }
      
      // For top-level pages and all other paths, show all menus
      case 'page':
      default:
        return menuItems;
    }
  }, [location.pathname, menuItems]);
  useEffect(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentSlug = pathSegments[1];

    if (!currentSlug || !filteredNavItems.length) return;

    let menuIdx = -1;
    let subMenuIdx = -1;

    filteredNavItems.forEach((menu, mIdx) => {
      if (menu.slug === currentSlug) {
        menuIdx = mIdx;
      }
      menu.SubMenus?.forEach((sub, sIdx) => {
        if (sub.slug === currentSlug) {
          menuIdx = mIdx;
          subMenuIdx = sIdx;
        }
        sub.SubSubMenus?.forEach((subSub) => {
          if (subSub.slug === currentSlug) {
            menuIdx = mIdx;
            subMenuIdx = sIdx;
          }
        });
      });
    });

    if (menuIdx !== -1) setActiveMenu(menuIdx);
    if (subMenuIdx !== -1) setActiveSubmenu(subMenuIdx);

  }, [filteredNavItems, location.pathname]);


  if (isLoading) return <aside className="w-72 p-4 text-white bg-[#5f77a5]">Loading...</aside>;
  if (error) return <aside className="w-72 p-4 text-red-300 bg-[#5f77a5]">Error loading menu</aside>;


  return (
    <aside
      className={`relative transition-all duration-300 ${collapsed ? "w-20" : "w-72"} pb-12 overflow-y-auto text-white shadow-2xl hidden md:flex flex-col bg-cover bg-center`}
      style={{ backgroundImage: "url('https://img.freepik.com/free-vector/three-dimensional-triangles-backgroundddddddddd_1053-208.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-[rgb(78,81,229,0.8)] via-[rgb(140,140,240,0.75)] to-[rgb(251,207,125,0.9)] pointer-events-none" />
      <div className="relative flex flex-col flex-grow overflow-y-auto custom-scrollbar z-10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-3 m-3 rounded-xl flex items-center justify-center bg-white/20 hover:bg-white/30 hover:scale-110 transition-all"
        >
          {collapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
        </button>

        <ul className="space-y-2 mt-6 px-3 flex-grow">
          {filteredNavItems.map((item, idx) => {
            const hasChildren = item.SubMenus && item.SubMenus.length > 0;
            return (
              <li key={item.id}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => setActiveMenu(activeMenu === idx ? null : idx)}
                      className={`flex justify-between items-center w-full px-4 py-3 rounded-lg hover:bg-white/20 transition-all ${activeMenu === idx ? "bg-white/25" : ""}`}
                    >
                      <span className="flex items-center space-x-3">
                        {!collapsed && <span className="text-sm font-medium tracking-wide">{translate(item, 'title')}</span>}
                      </span>
                      {!collapsed && <IoAddOutline className="w-5 h-5 opacity-80" />}
                    </button>
                    {activeMenu === idx && !collapsed && (
                      <ul className="ml-6 mt-2 space-y-1 border-l border-white/20 pl-3">
                        {item.SubMenus.map((sub, subIdx) => {
                          const hasGrandChildren = sub.SubSubMenus && sub.SubSubMenus.length > 0;
                          return (
                            <li key={sub.id}>
                              {hasGrandChildren ? (
                                <>
                                  <button
                                    onClick={() => setActiveSubmenu(activeSubmenu === subIdx ? null : subIdx)}
                                    className="flex justify-between items-center w-full px-3 py-2 rounded-md hover:bg-white/20 transition"
                                  >
                                    <span className="text-sm">{translate(sub, 'title')}</span>
                                    <IoAddOutline className="w-4 h-4 opacity-75" />
                                  </button>
                                  {activeSubmenu === subIdx && (
                                    <ul className="ml-5 mt-1 space-y-1 border-l border-white/20 pl-3">
                                      {sub.SubSubMenus.map((subsub) => (
                                        <li key={subsub.id}>
                                          <NavLink
                                            to={getLinkPath(2, subsub.slug)}
                                            className="block px-3 py-2 text-sm rounded-md hover:bg-white/20 transition"
                                          >
                                            {translate(subsub, 'title')}
                                          </NavLink>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </>
                              ) : (
                                <NavLink
                                  to={getLinkPath(1, sub.slug)}
                                  className="block px-3 py-2 text-sm rounded-md hover:bg-white/20 transition"
                                >
                                  {translate(sub, 'title')}
                                </NavLink>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <NavLink
                    to={getLinkPath(0, item.slug)}
                    className="flex items-center px-4 py-3 rounded-lg hover:bg-white/20 transition-all"
                  >
                    {!collapsed && <span className="ml-3 text-sm font-medium tracking-wide">{translate(item, 'title')}</span>}
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>

        {!collapsed && (
          <div className="px-5 py-4 border-t border-white/20 text-xs opacity-80">
            © {new Date().getFullYear()} Department of Public Health
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;