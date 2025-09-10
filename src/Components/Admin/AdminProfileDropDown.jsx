import React, { useState, useContext, useRef, useEffect } from "react";
import { PiUserCircleDuotone } from "react-icons/pi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { TbPasswordUser } from "react-icons/tb";

import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";

const AdminProfileDropDown = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  const handleCpClick = () => {
    navigate("/admin/change-password");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-3" >
        <p className="font-semibold" >{user.name}</p>
      <div
        onClick={() => setOpen(!open)}
        className="rounded-full w-10 cursor-pointer"
      >
        {user.profilePic ? (
          <img
            src={`${import.meta.env.VITE_API_BASE_URL}/uploads/profiles/${
              user.profilePic
            }`}
            className="rounded-full"
            alt={user.name}
          />
        ) : (
          <PiUserCircleDuotone size={40} />
        )}
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>

      </div>
      </div>

      {open && (
        <div className="absolute right-0 mt-2 p-1 w-fit bg-white border border-gray-200 rounded shadow-lg z-50">
            <p
            className="flex items-center w-full px-4 py-2 text-gray-700 border-b border-gray-200"
          >
          {user.email}
          </p>
          <button
            onClick={handleCpClick}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
          >
            <TbPasswordUser size={22} className="mr-2 text-gray-600" />
            Change Password
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded"
          >
            <RiLogoutCircleRLine size={20} className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProfileDropDown;
