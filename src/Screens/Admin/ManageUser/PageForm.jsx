// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Header from "../../../Components/Admin/Add/Header";
// import FormActions from "../../../Components/Admin/Add/FormActions";

// import { useNavigate, useParams } from "react-router-dom";
// import { useModal } from "../../../context/ModalProvider";

// const PageForm = () => {
//   const [formData, setFormData] = useState({
//     pageName: "",
//     shortCode: "",
//     remarks: "",
//     isActive: true,
//   });

//   const [initialData, setInitialData] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const { showModal } = useModal();
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEditMode = Boolean(id);

//   useEffect(() => {
//     if (isEditMode) {
//       const fetchPageData = async () => {
//         try {
//           const res = await axios.get(
//             `${import.meta.env.VITE_API_BASE_URL}/pages/${id}`,
//             { withCredentials: true }
//           );

//           const fetchedData = {
//             pageName: res.data.pageName || "",
//             shortCode: res.data.shortCode || "",
//             remarks: res.data.remarks || "",
//             isActive: res.data.isActive ?? true,
//           };

//           setFormData(fetchedData);
//           setInitialData(fetchedData);
//         } catch (error) {
//           showModal("error", "Failed to fetch data");
//         }
//       };
//       fetchPageData();
//     }
//   }, [id, isEditMode]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       if (isEditMode) {
//         await axios.put(
//           `${import.meta.env.VITE_API_BASE_URL}/pages/${id}`,
//           formData,
//           { withCredentials: true }
//         );
//         showModal("success", "Page updated successfully.");
//       } else {
//         await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}/pages`,
//           formData,
//           {
//             withCredentials: true,
//           }
//         );
//         showModal("success", "Page created successfully.");
//       }

//       navigate("/admin/user-management/pages");
//     } catch (error) {
//       showModal(
//         "error",
//         error.response?.data?.message || "Error submitting form"
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     if (isEditMode && initialData) {
//       setFormData(initialData);
//     } else {
//       setFormData({
//         pageName: "",
//         shortCode: "",
//         remarks: "",
//         isActive: true,
//       });
//     }
//   };

//   const handleCancel = () => {
//     navigate("/admin/user-management/pages");
//   };

//   const handleGoBack = () => {
//     navigate("/admin/user-management/pages");
//   };

//   return (
//     <div className="min-h-[80vh]">
//       <div className="bg-white p-6 shadow">
//         <Header
//           title={isEditMode ? "Edit Page" : "Create Page"}
//           onGoBack={handleGoBack}
//         />

//         <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Page Name
//             </label>
//             <input
//               type="text"
//               placeholder="Enter page name"
//               name="pageName"
//               value={formData.pageName}
//               onChange={handleChange}
//               className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Short Code
//             </label>
//             <input
//               type="text"
//               placeholder="Enter short code"
//               name="shortCode"
//               value={formData.shortCode}
//               onChange={handleChange}
//               className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Remarks
//             </label>
//             <input
//               name="remarks"
//               placeholder="Enter remarks"
//               value={formData.remarks}
//               onChange={handleChange}
//               className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
//             />
//           </div>

//           <FormActions
//           isisEditMode
//             onSubmit={handleSubmit}
//             onReset={handleReset}
//             onCancel={handleCancel}
//             isSubmitting={isSubmitting}
//           />
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PageForm;



import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../../Components/Admin/Add/Header";
import FormActions from "../../../Components/Admin/Add/FormActions";
import FormField from "../../../Components/Admin/TextEditor/FormField";
import { useNavigate, useParams } from "react-router-dom";
import { useModal } from "../../../context/ModalProvider";

const PageForm = () => {
  const [formData, setFormData] = useState({
    pageName: "",
    shortCode: "",
    remarks: "",
    isActive: true,
  });

  const [initialData, setInitialData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { showModal } = useModal();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchPageData = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/pages/${id}`,
            { withCredentials: true }
          );
          const fetchedData = {
            pageName: res.data.pageName || "",
            shortCode: res.data.shortCode || "",
            remarks: res.data.remarks || "",
            isActive: res.data.isActive ?? true,
          };
          setFormData(fetchedData);
          setInitialData(fetchedData);
        } catch (error) {
          showModal("error", "Failed to fetch data");
        }
      };
      fetchPageData();
    }
  }, [id, isEditMode, showModal]);

  const handleFormFieldChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.pageName.trim()) {
      newErrors.pageName = "Page Name is required";
    }
    if (!formData.shortCode.trim()) {
      newErrors.shortCode = "Short Code is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/pages/${id}`,
          formData,
          { withCredentials: true }
        );
        showModal("success", "Page updated successfully.");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/pages`,
          formData,
          { withCredentials: true }
        );
        showModal("success", "Page created successfully.");
      }
      navigate("/admin/user-management/pages");
    } catch (error) {
      showModal(
        "error",
        error.response?.data?.message || "Error submitting form"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isEditMode && initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        pageName: "",
        shortCode: "",
        remarks: "",
        isActive: true,
      });
    }
    setErrors({});
  };

  const handleCancel = () => {
    navigate("/admin/user-management/pages");
  };

  return (
    <div className="min-h-[80vh]">
      <div className="bg-white p-6 shadow">
        <Header
          title={isEditMode ? "Edit Page" : "Create Page"}
          onGoBack={handleCancel}
        />

        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
          <div>
            <FormField
              label="Page Name"
              name="pageName"
              value={formData.pageName}
              onChange={(value) => handleFormFieldChange("pageName", value)}
              placeholder="Enter page name"
              error={errors.pageName}
              required
            />
          </div>

          <div>
            <FormField
              label="Short Code"
              name="shortCode"
              value={formData.shortCode}
              onChange={(value) => handleFormFieldChange("shortCode", value)}
              placeholder="Enter short code"
              error={errors.shortCode}
              required
            />
          </div>

          <div>
            <FormField
              label="Remarks"
              name="remarks"
              value={formData.remarks}
              onChange={(value) => handleFormFieldChange("remarks", value)}
              placeholder="Enter remarks"
              error={errors.remarks}
            />
          </div>

          <FormActions
            isEditMode={isEditMode}
            onReset={handleReset}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  );
};

export default PageForm;