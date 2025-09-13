// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import AuthContext from "@/context/AuthContext";

// const AdminLayout = (props) => {
//   const { user, setUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [isVerifying, setIsVerifying] = useState(true);

//   useEffect(() => {
//     const verifyUser = async () => {
//       if (user) {
//         setIsVerifying(false);
//         return;
//       }

//       try {
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_BASE_URL}/admin/session`,
//           { withCredentials: true }
//         );
//         if (res.data.user) {
//           setUser(res.data.user);
//         } else {
//           navigate("/login");
//         }
//       } catch (err) {
//         setUser(null);
//         navigate("/login");
//       } finally {
//         setIsVerifying(false);
//       }
//     };

//     verifyUser();
//   }, [user, setUser, navigate]);

//   if (isVerifying) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
//         <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (user) {
//     return <React.Fragment>{props.children}</React.Fragment>;
//   }

//   return null;
// };

// export default AdminLayout;




// AdminLayout.js (Simplified)

import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "@/context/AuthContext";

const AdminLayout = (props) => {
  const { user, isVerifying } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until the initial verification is done
    if (!isVerifying && !user) {
      navigate("/login");
    }
  }, [user, isVerifying, navigate]);

  // Show a loader while verifying the user
  if (isVerifying) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If verification is done and we have a user, show the admin content
  if (user) {
    return <React.Fragment>{props.children}</React.Fragment>;
  }

  // If no user after verification, render nothing while redirecting
  return null;
};

export default AdminLayout;