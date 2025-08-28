import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import MenuTable from "../../../Components/Menu/MenuTable";
import DeleteConfirmationModal from "../../../Components/DeleteConfirmationModal/DeleteConfirmationModal";
import { FaEdit } from "react-icons/fa";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StatusBadge = ({ isActive }) => {
  const text = isActive ? "Active" : "Inactive";
  const classes = isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${classes}`}>{text}</span>;
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("asc");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin/allusers`, {
          withCredentials: true,
          params: { search: searchTerm, sortBy, order },
        });
        setUsers(res.data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, [searchTerm, sortBy, order]);

  const handleToggleClick = (user) => {
    setCurrentUser(user);
    setIsStatusModalOpen(true);
  };

  const closeStatusModal = () => {
    setCurrentUser(null);
    setIsStatusModalOpen(false);
  };

  const confirmStatusToggle = async () => {
    if (!currentUser) return;

    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/users/${currentUser.id}/status`,
        { isActive: !currentUser.isActive },
        { withCredentials: true }
      );

      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id ? { ...u, isActive: !u.isActive } : u
        )
      );
    } catch (error) {
      console.error("Error updating status:", error.response?.data || error.message);
    } finally {
      closeStatusModal();
    }
  };

  const userColumns = useMemo(
    () => [
      {
        header: "SL.No",
        accessor: "id",
        cell: ({ pageContext }) => {
          const { currentPage, entriesPerPage, index } = pageContext || {};
          return (currentPage - 1) * entriesPerPage + index + 1;
        },
      },
      { header: "Name", accessor: "name", isSearchable: true },
      { header: "Email", accessor: "email", isSearchable: true },
      { header: "Mobile", accessor: "mobile", isSearchable: true },
      {
        header: "Image",
        accessor: "profilePic",
        cell: ({ row }) => {
          const path = row.original.profilePic;
          if (!path) return <div className="text-gray-500">No Image</div>;
          const file = path.split('\\').pop().split('/').pop();
          const src = `${process.env.REACT_APP_API_URL}/uploads/profiles/${file}`;
          return <img src={src} alt={row.original.name} className="h-10 w-10 rounded-full object-cover" />;
        },
      },
      {
        header: "Status",
        accessor: "isActive",
        cell: ({ row }) => <StatusBadge isActive={row.original.isActive} />,
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(`edit/${row.original.id}`)}
              className="text-blue-500 hover:text-blue-700 transition"
              title="Edit User"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleToggleClick(row.original)}
              className={`text-xl ${
                row.original.isActive ? "text-green-600" : "text-red-600"
              }`}
              title={row.original.isActive ? "Set Inactive" : "Set Active"}
            >
              {row.original.isActive ? "✔" : "✖"}
            </button>
          </div>
        ),
      },
    ],
    [navigate]
  );

  const handleSortChange = (field) => {
    if (sortBy === field) setOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  return (
    <div className="p-6">
      <MenuTable
        Ltext="Users"
        Rtext="Add User"
        data={users}
        columns={userColumns}
        addPath="add"
        sortBy={sortBy}
        order={order}
        onSortChange={handleSortChange}
        onSearchChange={setSearchTerm}
      />

      {isStatusModalOpen && currentUser && (
        <DeleteConfirmationModal
          onClose={closeStatusModal}
          onConfirm={confirmStatusToggle}
          title={`${currentUser.isActive ? "Deactivate" : "Activate"} User`}
          message={`Are you sure you want to ${
            currentUser.isActive ? "deactivate" : "activate"
          } "${currentUser.name}"?`}
          icon={Trash2}
          confirmText="Confirm"
          cancelText="Cancel"
          confirmButtonClassName={
            currentUser.isActive
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }
          iconColorClass={
            currentUser.isActive
              ? "text-red-500"
              : "text-green-500"
          }
        />
      )}
    </div>
  );
};

export default UserList;
