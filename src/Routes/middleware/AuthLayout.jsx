// import React, { useContext, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import AuthContext from '@/context/AuthContext';


// const AuthLayout = ({ children }) => {
//   const { user, loading } = useContext(AuthContext);
//   const navigate = useNavigate(); 


//   useEffect(() => {
//     if (user) {
//       // Check if there is a previous page in the history stack.
//       // The `key` on location state is 'default' on the first render, 
//       // subsequent navigations will give it a unique key.
//       if (window.history.state && window.history.state.idx > 0) {
//         navigate(-1); // If there's a history, go back.
//       } else {
//         // If there's no history, redirect to a default page.
//         // `replace: true` prevents the /login page from being added to the history.
//         navigate('/admin/dashboard', { replace: true });
//       }
//     }
//   }, [user, navigate]);


//   // Show nothing or a loader while checking auth
// if (loading) {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
//       <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
//     </div>
//   );
// }


//   // If not logged in, allow access to login/register/etc.
//   return <>

//   {children}
   
//   </>;
// };

// export default AuthLayout;



// AuthLayout.js (Adjusted)

import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '@/context/AuthContext';

const AuthLayout = ({ children }) => {
  const { user, isVerifying } = useContext(AuthContext); // Use isVerifying
  const navigate = useNavigate();

  useEffect(() => {
    // Only perform the redirect check after the initial verification is complete
    if (!isVerifying && user) {
      navigate("/admin/dashboard");
    }
  }, [user, isVerifying, navigate]);

  // Show a loader while verifying
  if (isVerifying) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in (and verification is complete), allow access
  return <>{children}</>;
};

export default AuthLayout;