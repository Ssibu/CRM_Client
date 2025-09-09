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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [mobileSubmenu, setMobileSubmenu] = useState(null);
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
