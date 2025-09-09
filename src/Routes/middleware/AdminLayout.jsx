import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "@/context/AuthContext";

const AdminLayout = (props) => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      if (user) {
        setIsVerifying(false);
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/admin/me`,
          { withCredentials: true }
        );
        if (res.data.user) {
          setUser(res.data.user);
        } else {
          navigate("/login");
        }
      } catch (err) {
        setUser(null);
        navigate("/login");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyUser();
  }, [user, setUser, navigate]);

  if (isVerifying) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return <React.Fragment>{props.children}</React.Fragment>;
  }

  return null;
};

export default AdminLayout;


