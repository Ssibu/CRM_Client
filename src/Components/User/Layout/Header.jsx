

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";

// const API_URL = `${import.meta.env.VITE_API_BASE_URL}/user-home-settings`;

// const Header = () => {
//   const { language, translate } = useGlobalTranslation(); // 'en' or 'od'
//   const [headerData, setHeaderData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchHeaderData = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const res = await axios.get(API_URL);
//         setHeaderData(res.data);
//         console.log("Header data fetched:", res.data);
//       } catch (err) {
//         setError(translate("header.errorLoadingData") || "Failed to load header data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchHeaderData();
//   }, [language]); // refetch when language changes

//   const getTranslatedField = (baseName) => {
//     if (!headerData) return "";

//     const localizedKey = `${language}_${baseName}`; // ✅ FIXED: matches backend
//     if (headerData[localizedKey]) return headerData[localizedKey];

//     // Fallback to English if translation missing
//     const fallbackKey = `en_${baseName}`;
//     return headerData[fallbackKey] || "";
//   };

//   return (
//     <header
//       role="banner"
//       className="w-full h-[100px] bg-white shadow-sm border-b border-gray-200 flex items-center"
//     >
//       <div className="max-w-[1598px] mx-auto w-full flex justify-between items-center h-full px-4">
//         {/* Left: Logo + Org Name + Address */}
//         <motion.div
//           initial={{ opacity: 0, x: -20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5 }}
//           className="flex items-center gap-4 min-h-[80px]"
//         >
//           {headerData?.odishaLogoUrl ? (
//             <img
//               src={headerData.odishaLogoUrl}
//               alt={getTranslatedField("organizationName") || "Government Logo"}
//               className="max-h-[80px] object-contain"
//               loading="lazy"
//               onError={(e) => (e.target.style.display = "none")}
//             />
//           ) : (
//             <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
//               <span className="text-xs text-gray-500">Logo</span>
//             </div>
//           )}

//           <div className="flex flex-col justify-center leading-tight">
//             <span className="text-lg lg:text-2xl font-extrabold text-gray-900">
//               {getTranslatedField("organizationName") || "Default Organization"}
//             </span>
//             <span className="text-sm lg:text-lg text-gray-700">
//               {getTranslatedField("address") || "Default Address"}
//             </span>
//           </div>
//         </motion.div>

//         {/* Right: Person Name + Designation + Photo */}
//         <motion.div
//           initial={{ opacity: 0, x: 20 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ duration: 0.5, delay: 0.1 }}
//           className="flex items-center gap-4 min-h-[90px]"
//         >
//           <div className="flex flex-col justify-center text-right">
//             <span className="text-lg lg:text-2xl font-extrabold text-gray-900">
//               {getTranslatedField("personName") || "Default Person"}
//             </span>
//             <span className="text-sm lg:text-lg text-gray-700">
//               {getTranslatedField("personDesignation") || "Default Designation"}
//             </span>
//           </div>

//           {headerData?.cmPhotoUrl ? (
//             <img
//               src={headerData.cmPhotoUrl}
//               alt={getTranslatedField("personName") || "Person Photo"}
//               className="max-h-[90px] object-contain"
//               loading="lazy"
//               onError={(e) => (e.target.style.display = "none")}
//             />
//           ) : (
//             <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
//               <span className="text-xs text-gray-500">Photo</span>
//             </div>
//           )}
//         </motion.div>

//         {/* DEBUG Info - remove in production */}
//         <div className="absolute bottom-0 left-0 p-2 text-xs text-gray-500 bg-white">
//           Language: {language} <br />
//           Org (en): {headerData?.en_organizationName} <br />
//           Org (od): {headerData?.od_organizationName} <br />
//           Current Org: {getTranslatedField("organizationName")}
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;



import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import DOMPurify from "dompurify";
import { useGlobalTranslation } from "@/hooks/useGlobalTranslation";
import { Link } from "react-router-dom";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/user-home-settings`;

const Header = () => {
  const { language, translate } = useGlobalTranslation();
  const [headerData, setHeaderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeaderData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await axios.get(API_URL);
        setHeaderData(res.data);
      } catch (err) {
        setError(translate("header.errorLoadingData") || "Failed to load header data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeaderData();
  }, [language]);

  const renderHTML = (field) => {
    if (!headerData) return "";
    const localizedKey = `${language}_${field}`;
    const value = headerData[localizedKey] || headerData[`en_${field}`] || "";
    return DOMPurify.sanitize(value);
  };

  return (
    <header
      role="banner"
      className="w-full h-[100px] bg-white shadow-sm border-b border-gray-200 flex items-center"
    >
      <div className="max-w-[1598px] mx-auto w-full flex justify-between items-center h-full px-4">
        {/* Left: Logo + Org Name + Address */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 min-h-[80px]"
        >
          {headerData?.odishaLogoUrl ? (
        <Link to="/">
              <img
              src={headerData.odishaLogoUrl}
              alt="Government Logo"
              className="max-h-[80px] object-contain"
              loading="lazy"
              onError={(e) => (e.target.style.display = "none")}
            />
        </Link>
          ) : (
            <Link to="/" className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">Logo</span>
            </Link>
          )}

          <div className="flex flex-col justify-center leading-tight">
            <span
              className="text-lg lg:text-2xl font-semibold text-gray-900"
              dangerouslySetInnerHTML={{ __html: renderHTML("organizationName") }}
            />
            {/* <span
              className="text-sm lg:text-lg text-gray-700"
              dangerouslySetInnerHTML={{ __html: renderHTML("address") }}
            /> */}
          </div>
        </motion.div>

        {/* Right: Person Name + Designation + Photo */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4 min-h-[90px]"
        >
          <div className="flex flex-col justify-center text-right">
            <span
              className="text-lg lg:text-2xl font-semibold text-gray-900"
              dangerouslySetInnerHTML={{ __html: renderHTML("personName") }}
            />
            <span
              className="text-sm lg:text-lg text-gray-700"
              dangerouslySetInnerHTML={{ __html: renderHTML("personDesignation") }}
            />
          </div>

          {headerData?.cmPhotoUrl ? (
            <img
              src={headerData.cmPhotoUrl}
              alt="Person Photo"
              className="max-h-[90px] object-contain"
              loading="lazy"
              onError={(e) => (e.target.style.display = "none")}
            />
          ) : (
            <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">Photo</span>
            </div>
          )}
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
