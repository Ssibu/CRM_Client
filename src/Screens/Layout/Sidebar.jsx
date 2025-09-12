import React from 'react';
import './Sidebar.css';
import SidebarsContent from './SidebarsContent';
import { AiOutlineClose } from 'react-icons/ai';
import { RiAdminFill } from 'react-icons/ri';
import useAuth from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {

const {user} = useAuth()

  return (
    <React.Fragment>
      <div
        className={`scroll-container overflow-y-auto left-0 w-72 bg-white shadow fixed inset-y-0 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } py-8 px-6`}
        style={{ zIndex: 50 }}
      >
        <div className="flex justify-between items-center px-4 mb-5">
          <Link to="/admin/dashboard" className="flex items-center">
            <RiAdminFill size={30} color="#FFB547" />
            <div className="text-2xl font-bold ml-2 text-[#2E3A8C]">Admin</div>
          </Link>
          <button onClick={toggleSidebar} className="text-gray-600 hover:text-[#2E3A8C] transition duration-300">
            <AiOutlineClose size={24} />
          </button>
        </div>

        <SidebarsContent   permissions={user.permissions} 
  isAdmin={user.isAdmin} />
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
