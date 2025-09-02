// import React, { useState, useEffect, useCallback, useRef } from "react";
// import axios from "axios";

// // Reusable Components
// import FormField from "../../Components/TextEditor/FormField";
// import RichTextEditor from "../../Components/TextEditor/RichTextEditor";
// import ImageUploader from "../../Components/TextEditor/ImageUploader";
// import { ModalDialog } from "../../Components/Modal/MessageModal";

// const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/home-settings`;
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// const defaultFormData = {
//   orgName_en: "",
//   orgName_od: "",
//   personDesignation_en: "",
//   personDesignation_od: "",
//   personName_en: "",
//   personName_od: "",
//   overviewDescription_en: "",
//   overviewDescription_od: "",
//   address_en: "",
//   address_od: "",
//   email: "",
//   mobileNumber: "",
//   facebookLink: "",
//   instagramLink: "",
//   twitterLink: "",
//   linkedinLink: "",
//   showInnerpageSidebar: false,
//   showChatbot: false,
//   odishaLogo: "",
//   cmPhoto: ""
// };

// // Define field labels for error messages
// const fieldLabels = {
//   orgName_en: "Organization Name (English)",
//   orgName_od: "Organization Name (Odia)",
//   personDesignation_en: "Person Designation (English)",
//   personDesignation_od: "Person Designation (Odia)",
//   personName_en: "Person Name (English)",
//   personName_od: "Person Name (Odia)",
//   overviewDescription_en: "Overview Description (English)",
//   overviewDescription_od: "Overview Description (Odia)",
//   address_en: "Address (English)",
//   address_od: "Address (Odia)",
//   email: "Email",
//   mobileNumber: "Mobile Number",
//   odishaLogo: "Odisha Logo",
//   cmPhoto: "CM Photo"
// };

// const HomeConfiguration = () => {
//   const [formData, setFormData] = useState(defaultFormData);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [odishaLogoFile, setOdishaLogoFile] = useState(null);
//   const [cmPhotoFile, setCmPhotoFile] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const [modalVariant, setModalVariant] = useState("info");
//   const [modalFields, setModalFields] = useState([]);

//   const odishaLogoUploaderRef = useRef();
//   const cmPhotoUploaderRef = useRef();

//   useEffect(() => {
//     const fetchSettings = async () => {
//       setIsLoading(true);
//       try {
//         const response = await axios.get(API_URL, {withCredentials:true});
//         const settings = response.data;

//         const updatedSettings = { ...defaultFormData };
//         for (const key in defaultFormData) {
//           if (settings.hasOwnProperty(key)) {
//             if (key === "showInnerpageSidebar" || key === "showChatbot") {
//               updatedSettings[key] = String(settings[key]) === "true";
//             } else {
//               updatedSettings[key] = settings[key];
//             }
//           }
//         }
//         setFormData(updatedSettings);
//       } catch (error) {
//         console.error("Error fetching settings:", error);
//         alert("Could not load settings.");
//         setFormData(defaultFormData);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchSettings();
//   }, []);

//   const validateForm = useCallback(() => {
//     const newErrors = {};
//     const requiredFields = [
//       "orgName_en", "orgName_od",
//       "personDesignation_en", "personDesignation_od",
//       "personName_en", "personName_od",
//       "overviewDescription_en", "overviewDescription_od",
//       "address_en", "address_od",
//       "email", "mobileNumber"
//     ];

//     // Check required text fields
//     requiredFields.forEach(field => {
//       if (typeof formData[field] === 'string' && !formData[field].trim()) {
//         newErrors[field] = `${fieldLabels[field] || field} is required.`;
//       }
//     });

//     // Email validation
//     if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Invalid email address.";
//     }

//     // Mobile number validation
//     if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber)) {
//       newErrors.mobileNumber = "Mobile number must be 10 digits.";
//     }

//     // Image validation - check if either existing image or new file is present
//     if (!formData.odishaLogo && !odishaLogoFile) {
//       newErrors.odishaLogo = "Odisha Logo is required.";
//     }
// const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;

// if (!formData.facebookLink || !urlPattern.test(formData.facebookLink)) {
//   newErrors.facebookLink = "Please enter a valid Facebook link.";
// }
// if (!formData.instagramLink || !urlPattern.test(formData.instagramLink)) {
//   newErrors.instagramLink = "Please enter a valid Instagram link.";
// }
// if (!formData.twitterLink || !urlPattern.test(formData.twitterLink)) {
//   newErrors.twitterLink = "Please enter a valid Twitter link.";
// }
// if (!formData.linkedinLink || !urlPattern.test(formData.linkedinLink)) {
//   newErrors.linkedinLink = "Please enter a valid LinkedIn link.";
// }

//     if (!formData.cmPhoto && !cmPhotoFile) {
//       newErrors.cmPhoto = "CM Photo is required.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [formData, odishaLogoFile, cmPhotoFile]);

//   const handleInputChange = useCallback((field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//     // Clear error for the field as user types
//     if (errors[field]) {
//       setErrors((prev) => ({ ...prev, [field]: "" }));
//     }
//   }, [errors]);

//   const handleReset = () => {
//     setFormData(defaultFormData);
//     setOdishaLogoFile(null);
//     setCmPhotoFile(null);
//     setErrors({});

//     if (odishaLogoUploaderRef.current) {
//       odishaLogoUploaderRef.current.clearFile();
//     }
//     if (cmPhotoUploaderRef.current) {
//       cmPhotoUploaderRef.current.clearFile();
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     // Required fields
//     const requiredFields = [
//       "orgName_en", "orgName_od", "personDesignation_en", "personDesignation_od",
//       "personName_en", "personName_od", "overviewDescription_en", "overviewDescription_od",
//       "address_en", "address_od", "email", "mobileNumber"
//     ];
//     const emptyFields = requiredFields.filter(
//       (key) => !formData[key] || formData[key].trim() === ""
//     );
//     if (emptyFields.length > 0) {
//       setModalMessage("Please fill all required fields below:");
//       setModalFields(emptyFields.map((key) => fieldLabels[key]));
//       setModalVariant("error");
//       setModalOpen(true);
//       setIsSubmitting(false);
//       return;
//     } else {
//       setModalFields([]);
//     }

//     const dataToSubmit = new FormData();
//     for (const key in formData) {
//       if (formData[key] !== null && key !== "odishaLogo" && key !== "cmPhoto") {
//         dataToSubmit.append(key, formData[key]);
//       }
//     }
//     if (odishaLogoFile) dataToSubmit.append("odishaLogo", odishaLogoFile);
//     if (cmPhotoFile) dataToSubmit.append("cmPhoto", cmPhotoFile);

//     try {
//       await axios.put(API_URL, dataToSubmit, {
//         headers: { 'Content-Type': 'multipart/form-data' },
        
//       }, {withCredentials:true});
//       setModalMessage("Congratulations! Settings updated successfully.");
//       setModalVariant("success");
//       setModalOpen(true);
//     } catch (error) {
//       setModalMessage(error.response?.data?.message || 'An error occurred.');
//       setModalVariant("error");
//       setModalOpen(true);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="p-6 text-center font-semibold">
//         Loading Configuration...
//       </div>
//     );
//   }

//   return (
//     <div
//       className="p-6 bg-gray-50 min-h-screen font-sans"
    
//     >
//       <form onSubmit={handleSubmit} className="mt-6 space-y-6">
//         <h1 className="text-lg font-semibold mb-4">
//           Homepage Configuration
//         </h1>

//         {/* Single Card Wrapper */}
//         <div className="bg-white p-8 rounded-lg shadow-md space-y-8">

//           {/* English / Odia Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Organization Name (In English) <span className="text-red-500">*</span>
//               </label>
//               <RichTextEditor
//                 value={formData.orgName_en}
//                 onChange={(val) => handleInputChange("orgName_en", val)}
//               />
//               {errors.orgName_en && <p className="text-red-500 text-xs mt-1">{errors.orgName_en}</p>}
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Organization Name (In Odia) <span className="text-red-500">*</span>
//               </label>
//               <RichTextEditor
//                 value={formData.orgName_od}
//                 onChange={(val) => handleInputChange("orgName_od", val)}
//               />
//               {errors.orgName_od && <p className="text-red-500 text-xs mt-1">{errors.orgName_od}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Person Designation (In English) <span className="text-red-500">*</span>
//               </label>
//               <RichTextEditor
//                 value={formData.personDesignation_en}
//                 onChange={(val) =>
//                   handleInputChange("personDesignation_en", val)
//                 }
//               />
//               {errors.personDesignation_en && <p className="text-red-500 text-xs mt-1">{errors.personDesignation_en}</p>}
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Person Designation (In Odia) <span className="text-red-500">*</span>
//               </label>
//               <RichTextEditor
//                 value={formData.personDesignation_od}
//                 onChange={(val) =>
//                   handleInputChange("personDesignation_od", val)
//                 }
//               />
//               {errors.personDesignation_od && <p className="text-red-500 text-xs mt-1">{errors.personDesignation_od}</p>}
//             </div>

//             <FormField
//               label={
//                 <>
//                   Person Name (In English) <span className="text-red-500">*</span>
//                 </>
//               }
//               value={formData.personName_en}
//               onChange={(val) => handleInputChange("personName_en", val)}
//               error={errors.personName_en}
//             />
//             <FormField
//               label={
//                 <>
//                   Person Name (In Odia) <span className="text-red-500">*</span>
//                 </>
//               }
//               value={formData.personName_od}
//               onChange={(val) => handleInputChange("personName_od", val)}
//               error={errors.personName_od}
//             />

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Overview Description (In English) <span className="text-red-500">*</span>
//               </label>
//               <RichTextEditor
//                 value={formData.overviewDescription_en}
//                 onChange={(val) =>
//                   handleInputChange("overviewDescription_en", val)
//                 }
//               />
//               {errors.overviewDescription_en && <p className="text-red-500 text-xs mt-1">{errors.overviewDescription_en}</p>}
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Overview Description (In Odia) <span className="text-red-500">*</span>
//               </label>
//               <RichTextEditor
//                 value={formData.overviewDescription_od}
//                 onChange={(val) =>
//                   handleInputChange("overviewDescription_od", val)
//                 }
//               />
//               {errors.overviewDescription_od && <p className="text-red-500 text-xs mt-1">{errors.overviewDescription_od}</p>}
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Address (In English) <span className="text-red-500">*</span>
//               </label>
//               <RichTextEditor
//                 value={formData.address_en}
//                 onChange={(val) => handleInputChange("address_en", val)}
//               />
//               {errors.address_en && <p className="text-red-500 text-xs mt-1">{errors.address_en}</p>}
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Address (In Odia) <span className="text-red-500">*</span>
//               </label>
//               <RichTextEditor
//                 value={formData.address_od}
//                 onChange={(val) => handleInputChange("address_od", val)}
//               />
//               {errors.address_od && <p className="text-red-500 text-xs mt-1">{errors.address_od}</p>}
//             </div>
//           </div>

//           {/* Contact & Social Links */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <FormField
//               label={
//                 <>
//                   Email <span className="text-red-500">*</span>
//                 </>
//               }
//               type="email"
//               value={formData.email}
//               onChange={(val) => handleInputChange("email", val)}
//               error={errors.email}
//             />

//             <FormField
//               label={
//                 <>
//                   Mobile No. <span className="text-red-500">*</span>
//                 </>
//               }
//               value={formData.mobileNumber}
//               onChange={(val) => handleInputChange("mobileNumber", val)}
//               error={errors.mobileNumber}
//             />

//             <FormField
//               label="Facebook Link"
//               value={formData.facebookLink}
//               onChange={(val) => handleInputChange("facebookLink", val)}
//             />
//             <FormField
//               label="Twitter Link"
//               value={formData.twitterLink}
//               onChange={(val) => handleInputChange("twitterLink", val)}
//             />

//             <FormField
//               label="Instagram Link"
//               value={formData.instagramLink}
//               onChange={(val) => handleInputChange("instagramLink", val)}
//             />
//             <FormField
//               label="LinkedIn Link"
//               value={formData.linkedinLink}
//               onChange={(val) => handleInputChange("linkedinLink", val)}
//             />
//           </div>

//           {/* Upload Section in ONE Column */}
//           <div className="space-y-8 border-t pt-6">
//             {/* Odisha Logo */}
//             <div>
//               <ImageUploader
//                 ref={odishaLogoUploaderRef}
//                 label="Upload Odisha Logo"
//                 onChange={setOdishaLogoFile}
//                 required
//               />
//               {errors.odishaLogo && <p className="text-red-500 text-xs mt-1">{errors.odishaLogo}</p>}

//               {formData.odishaLogo && !odishaLogoFile && (
//                 <div className="mt-3">
//                   <p className="text-xs text-gray-600 mb-1">Current Logo:</p>
//                   <img
//                     src={`${API_BASE_URL}/uploads/settings/${formData.odishaLogo}`}
//                     alt="Odisha Logo Preview"
//                     className="h-24 w-24 object-contain border rounded"
//                   />
//                 </div>
//               )}
//               {odishaLogoFile && (
//                 <div className="mt-3">
//                   <p className="text-xs text-gray-600 mb-1">New Logo Preview:</p>
//                   <img
//                     src={URL.createObjectURL(odishaLogoFile)}
//                     alt="New Odisha Logo Preview"
//                     className="h-24 w-24 object-contain border rounded"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* CM Photo */}
//             <div>
//               <ImageUploader
//                 ref={cmPhotoUploaderRef}
//                 label="Upload CM Photo"
//                 onChange={setCmPhotoFile}
//                 required
//               />
//               {errors.cmPhoto && <p className="text-red-500 text-xs mt-1">{errors.cmPhoto}</p>}

//               {formData.cmPhoto && !cmPhotoFile && (
//                 <div className="mt-3">
//                   <p className="text-xs text-gray-600 mb-1">Current Photo:</p>
//                   <img
//                     src={`${API_BASE_URL}/uploads/settings/${formData.cmPhoto}`}
//                     alt="CM Photo Preview"
//                     className="h-24 w-24 object-cover border rounded"
//                   />
//                 </div>
//               )}
//               {cmPhotoFile && (
//                 <div className="mt-3">
//                   <p className="text-xs text-gray-600 mb-1">New Photo Preview:</p>
//                   <img
//                     src={URL.createObjectURL(cmPhotoFile)}
//                     alt="New CM Photo Preview"
//                     className="h-24 w-24 object-cover border rounded"
//                   />
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Toggles */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Show Innerpage Sidebar
//               </label>
//               <select
//                 value={String(formData.showInnerpageSidebar)}
//                 onChange={(e) =>
//                   handleInputChange(
//                     "showInnerpageSidebar",
//                     e.target.value === "true"
//                   )
//                 }
//                 className="mt-1 w-full p-2 border rounded-md"
//               >
//                 <option value="true">Yes</option>
//                 <option value="false">No</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Show Chatbot
//               </label>
//               <select
//                 value={String(formData.showChatbot)}
//                 onChange={(e) =>
//                   handleInputChange("showChatbot", e.target.value === "true")
//                 }
//                 className="mt-1 w-full p-2 border rounded-md"
//               >
//                 <option value="true">Yes</option>
//                 <option value="false">No</option>
//               </select>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex justify-start space-x-4 pt-6 border-t">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
//             >
//               {isSubmitting ? "Updating..." : "Update Settings"}
//             </button>
//             <button
//               type="button"
//               onClick={handleReset}
//               className="px-8 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//             >
//               Reset
//             </button>
//           </div>
//         </div>
//       </form>

//       <ModalDialog
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         variant={modalVariant}
//         message={modalMessage}
//       >
//         {modalVariant === "error" && modalFields.length > 0 && (
//           <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
//             {modalFields.map((field, idx) => (
//               <li key={idx}>{field}</li>
//             ))}
//           </ul>
//         )}
//       </ModalDialog>
//     </div>
//   );
// };

// export default HomeConfiguration;



import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

// Reusable Components
import FormField from "../../Components/TextEditor/FormField";
import RichTextEditor from "../../Components/TextEditor/RichTextEditor";
import ImageUploader from "../../Components/TextEditor/ImageUploader";
import { ModalDialog } from "../../Components/Modal/MessageModal";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/home-settings`;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const defaultFormData = {
  orgName_en: "",
  orgName_od: "",
  personDesignation_en: "",
  personDesignation_od: "",
  personName_en: "",
  personName_od: "",
  overviewDescription_en: "",
  overviewDescription_od: "",
  address_en: "",
  address_od: "",
  email: "",
  mobileNumber: "",
  facebookLink: "",
  instagramLink: "",
  twitterLink: "",
  linkedinLink: "",
  showInnerpageSidebar: false,
  showChatbot: false,
  odishaLogo: "",
  cmPhoto: ""
};

// Define field labels for error messages
const fieldLabels = {
  orgName_en: "Organization Name (English)",
  orgName_od: "Organization Name (Odia)",
  personDesignation_en: "Person Designation (English)",
  personDesignation_od: "Person Designation (Odia)",
  personName_en: "Person Name (English)",
  personName_od: "Person Name (Odia)",
  overviewDescription_en: "Overview Description (English)",
  overviewDescription_od: "Overview Description (Odia)",
  address_en: "Address (English)",
  address_od: "Address (Odia)",
  email: "Email",
  mobileNumber: "Mobile Number",
  odishaLogo: "Odisha Logo",
  cmPhoto: "CM Photo"
};

const HomeConfiguration = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [odishaLogoFile, setOdishaLogoFile] = useState(null);
  const [cmPhotoFile, setCmPhotoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalVariant, setModalVariant] = useState("info");
  const [modalFields, setModalFields] = useState([]);

  const odishaLogoUploaderRef = useRef();
  const cmPhotoUploaderRef = useRef();

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_URL, {withCredentials:true});
        const settings = response.data;

        const updatedSettings = { ...defaultFormData };
        for (const key in defaultFormData) {
          if (settings.hasOwnProperty(key)) {
            if (key === "showInnerpageSidebar" || key === "showChatbot") {
              updatedSettings[key] = String(settings[key]) === "true";
            } else {
              updatedSettings[key] = settings[key];
            }
          }
        }
        setFormData(updatedSettings);
      } catch (error) {
        console.error("Error fetching settings:", error);
        alert("Could not load settings.");
        setFormData(defaultFormData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const requiredFields = [
      "orgName_en", "orgName_od",
      "personDesignation_en", "personDesignation_od",
      "personName_en", "personName_od",
      "overviewDescription_en", "overviewDescription_od",
      "address_en", "address_od",
      "email", "mobileNumber"
    ];

    // Check required text fields
    requiredFields.forEach(field => {
      if (typeof formData[field] === 'string' && !formData[field].trim()) {
        newErrors[field] = `${fieldLabels[field] || field} is required.`;
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    // Mobile number validation
    if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits.";
    }

    // Image validation - check if either existing image or new file is present
    if (!formData.odishaLogo && !odishaLogoFile) {
      newErrors.odishaLogo = "Odisha Logo is required.";
    }
const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;

if (!formData.facebookLink || !urlPattern.test(formData.facebookLink)) {
  newErrors.facebookLink = "Please enter a valid Facebook link.";
}
if (!formData.instagramLink || !urlPattern.test(formData.instagramLink)) {
  newErrors.instagramLink = "Please enter a valid Instagram link.";
}
if (!formData.twitterLink || !urlPattern.test(formData.twitterLink)) {
  newErrors.twitterLink = "Please enter a valid Twitter link.";
}
if (!formData.linkedinLink || !urlPattern.test(formData.linkedinLink)) {
  newErrors.linkedinLink = "Please enter a valid LinkedIn link.";
}

    if (!formData.cmPhoto && !cmPhotoFile) {
      newErrors.cmPhoto = "CM Photo is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, odishaLogoFile, cmPhotoFile]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for the field as user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  const handleReset = () => {
    setFormData(defaultFormData);
    setOdishaLogoFile(null);
    setCmPhotoFile(null);
    setErrors({});

    if (odishaLogoUploaderRef.current) {
      odishaLogoUploaderRef.current.clearFile();
    }
    if (cmPhotoUploaderRef.current) {
      cmPhotoUploaderRef.current.clearFile();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Required fields
    const requiredFields = [
      "orgName_en", "orgName_od", "personDesignation_en", "personDesignation_od",
      "personName_en", "personName_od", "overviewDescription_en", "overviewDescription_od",
      "address_en", "address_od", "email", "mobileNumber"
    ];
    const emptyFields = requiredFields.filter(
      (key) => !formData[key] || formData[key].trim() === ""
    );
    if (emptyFields.length > 0) {
      setModalMessage("Please fill all required fields below:");
      setModalFields(emptyFields.map((key) => fieldLabels[key]));
      setModalVariant("error");
      setModalOpen(true);
      setIsSubmitting(false);
      return;
    } else {
      setModalFields([]);
    }

    const dataToSubmit = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && key !== "odishaLogo" && key !== "cmPhoto") {
        dataToSubmit.append(key, formData[key]);
      }
    }
    if (odishaLogoFile) dataToSubmit.append("odishaLogo", odishaLogoFile);
    if (cmPhotoFile) dataToSubmit.append("cmPhoto", cmPhotoFile);

    try {
      await axios.put(API_URL, dataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      setModalMessage("Congratulations! Settings updated successfully.");
      setModalVariant("success");
      setModalOpen(true);
    } catch (error) {
      setModalMessage(error.response?.data?.message || 'An error occurred.');
      setModalVariant("error");
      setModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center font-semibold">
        Loading Configuration...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-lg font-semibold mb-6">
          Homepage Configuration
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* English / Odia Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Organization Name (In English) <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.orgName_en}
                onChange={(val) => handleInputChange("orgName_en", val)}
              />
              {errors.orgName_en && <p className="text-red-500 text-xs mt-1">{errors.orgName_en}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Organization Name (In Odia) <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.orgName_od}
                onChange={(val) => handleInputChange("orgName_od", val)}
              />
              {errors.orgName_od && <p className="text-red-500 text-xs mt-1">{errors.orgName_od}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Person Designation (In English) <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.personDesignation_en}
                onChange={(val) =>
                  handleInputChange("personDesignation_en", val)
                }
              />
              {errors.personDesignation_en && <p className="text-red-500 text-xs mt-1">{errors.personDesignation_en}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Person Designation (In Odia) <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.personDesignation_od}
                onChange={(val) =>
                  handleInputChange("personDesignation_od", val)
                }
              />
              {errors.personDesignation_od && <p className="text-red-500 text-xs mt-1">{errors.personDesignation_od}</p>}
            </div>

            <FormField
              label={
                <>
                  Person Name (In English) <span className="text-red-500">*</span>
                </>
              }
              value={formData.personName_en}
              onChange={(val) => handleInputChange("personName_en", val)}
              error={errors.personName_en}
            />
            <FormField
              label={
                <>
                  Person Name (In Odia) <span className="text-red-500">*</span>
                </>
              }
              value={formData.personName_od}
              onChange={(val) => handleInputChange("personName_od", val)}
              error={errors.personName_od}
            />

            <div>
              <label className="block text-sm font-medium mb-1">
                Overview Description (In English) <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.overviewDescription_en}
                onChange={(val) =>
                  handleInputChange("overviewDescription_en", val)
                }
              />
              {errors.overviewDescription_en && <p className="text-red-500 text-xs mt-1">{errors.overviewDescription_en}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Overview Description (In Odia) <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.overviewDescription_od}
                onChange={(val) =>
                  handleInputChange("overviewDescription_od", val)
                }
              />
              {errors.overviewDescription_od && <p className="text-red-500 text-xs mt-1">{errors.overviewDescription_od}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Address (In English) <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.address_en}
                onChange={(val) => handleInputChange("address_en", val)}
              />
              {errors.address_en && <p className="text-red-500 text-xs mt-1">{errors.address_en}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Address (In Odia) <span className="text-red-500">*</span>
              </label>
              <RichTextEditor
                value={formData.address_od}
                onChange={(val) => handleInputChange("address_od", val)}
              />
              {errors.address_od && <p className="text-red-500 text-xs mt-1">{errors.address_od}</p>}
            </div>
          </div>

          {/* Contact & Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label={
                <>
                  Email <span className="text-red-500">*</span>
                </>
              }
              type="email"
              value={formData.email}
              onChange={(val) => handleInputChange("email", val)}
              error={errors.email}
            />

            <FormField
              label={
                <>
                  Mobile No. <span className="text-red-500">*</span>
                </>
              }
              value={formData.mobileNumber}
              onChange={(val) => handleInputChange("mobileNumber", val)}
              error={errors.mobileNumber}
            />

            <FormField
              label="Facebook Link"
              value={formData.facebookLink}
              onChange={(val) => handleInputChange("facebookLink", val)}
            />
            <FormField
              label="Twitter Link"
              value={formData.twitterLink}
              onChange={(val) => handleInputChange("twitterLink", val)}
            />

            <FormField
              label="Instagram Link"
              value={formData.instagramLink}
              onChange={(val) => handleInputChange("instagramLink", val)}
            />
            <FormField
              label="LinkedIn Link"
              value={formData.linkedinLink}
              onChange={(val) => handleInputChange("linkedinLink", val)}
            />
          </div>

          {/* Upload Section */}
          <div className="space-y-8 border-t pt-6">
            {/* Odisha Logo */}
            <div>
              <ImageUploader
                ref={odishaLogoUploaderRef}
                label="Upload Odisha Logo"
                onChange={setOdishaLogoFile}
                required
              />
              {errors.odishaLogo && <p className="text-red-500 text-xs mt-1">{errors.odishaLogo}</p>}

              {formData.odishaLogo && !odishaLogoFile && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-1">Current Logo:</p>
                  <img
                    src={`${API_BASE_URL}/uploads/settings/${formData.odishaLogo}`}
                    alt="Odisha Logo Preview"
                    className="h-24 w-24 object-contain border rounded"
                  />
                </div>
              )}
              {odishaLogoFile && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-1">New Logo Preview:</p>
                  <img
                    src={URL.createObjectURL(odishaLogoFile)}
                    alt="New Odisha Logo Preview"
                    className="h-24 w-24 object-contain border rounded"
                  />
                </div>
              )}
            </div>

            {/* CM Photo */}
            <div>
              <ImageUploader
                ref={cmPhotoUploaderRef}
                label="Upload CM Photo"
                onChange={setCmPhotoFile}
                required
              />
              {errors.cmPhoto && <p className="text-red-500 text-xs mt-1">{errors.cmPhoto}</p>}

              {formData.cmPhoto && !cmPhotoFile && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-1">Current Photo:</p>
                  <img
                    src={`${API_BASE_URL}/uploads/settings/${formData.cmPhoto}`}
                    alt="CM Photo Preview"
                    className="h-24 w-24 object-cover border rounded"
                  />
                </div>
              )}
              {cmPhotoFile && (
                <div className="mt-3">
                  <p className="text-xs text-gray-600 mb-1">New Photo Preview:</p>
                  <img
                    src={URL.createObjectURL(cmPhotoFile)}
                    alt="New CM Photo Preview"
                    className="h-24 w-24 object-cover border rounded"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Show Innerpage Sidebar
              </label>
              <select
                value={String(formData.showInnerpageSidebar)}
                onChange={(e) =>
                  handleInputChange(
                    "showInnerpageSidebar",
                    e.target.value === "true"
                  )
                }
                className="mt-1 w-full p-2 border rounded-md"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Show Chatbot
              </label>
              <select
                value={String(formData.showChatbot)}
                onChange={(e) =>
                  handleInputChange("showChatbot", e.target.value === "true")
                }
                className="mt-1 w-full p-2 border rounded-md"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-start space-x-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Updating..." : "Update Settings"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-8 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <ModalDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        variant={modalVariant}
        message={modalMessage}
      >
        {modalVariant === "error" && modalFields.length > 0 && (
          <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
            {modalFields.map((field, idx) => (
              <li key={idx}>{field}</li>
            ))}
          </ul>
        )}
      </ModalDialog>
    </div>
  );
};

export default HomeConfiguration;