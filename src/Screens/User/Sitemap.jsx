import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { IoMdOpen } from "react-icons/io";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";

// same function you used in Navbar
const getLinkPath = (level, slug) => {
  if (level === 0) return `/page/${slug}`;
  if (level === 1) return `/subpage/${slug}`;
  if (level === 2) return `/sub-subpage/${slug}`;
  return `/${slug}`;
};

// reusable link renderer
const LinkComponent = ({ item, level, children }) => {
  const hasChildren =
    (item.SubMenus && item.SubMenus.length > 0) ||
    (item.SubSubMenus && item.SubSubMenus.length > 0);

  if (hasChildren && !item.link) {
    return <span className="font-semibold">{children}</span>;
  }

  if (item.link) {
    return (
      <a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline flex gap-1 items-center"
      >
        {children} <IoMdOpen />
      </a>
    );
  }

  return (
    <NavLink
      to={getLinkPath(level, item.slug)}
      className="text-blue-600 hover:underline"
    >
      {children}
    </NavLink>
  );
};

const PageSitemap = () => {
  const { translate } = useGlobalTranslation();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/menus`);
        setMenuItems(res.data.navigation);
      } catch (err) {
        console.error("Failed to load sitemap:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenus();
  }, []);

  if (loading) {
    return <div className="p-4 text-gray-600">Loading sitemap...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sitemap</h1>
      <ul className="space-y-3">
        {menuItems.map((menu) => (
          <li key={menu.id}>
            <LinkComponent item={menu} level={0}>
              {translate(menu, "title")}
            </LinkComponent>

            {menu.SubMenus?.length > 0 && (
              <ul className="ml-6 list-disc space-y-2">
                {menu.SubMenus.map((sub) => (
                  <li key={sub.id}>
                    <LinkComponent item={sub} level={1}>
                      {translate(sub, "title")}
                    </LinkComponent>

                    {sub.SubSubMenus?.length > 0 && (
                      <ul className="ml-6 list-square space-y-1">
                        {sub.SubSubMenus.map((subsub) => (
                          <li key={subsub.id}>
                            <LinkComponent item={subsub} level={2}>
                              {translate(subsub, "title")}
                            </LinkComponent>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PageSitemap;
