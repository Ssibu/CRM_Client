// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import Header from "../../../Components/Admin/Add/Header";
// import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";
// import { useModal } from "../../../context/ModalProvider";

// const ManageGallaryForm = () => {
//   const [formData, setFormData] = useState({
//     en_category: "",
//     od_category: "",
//     category_type: "photo",
//     thumbnail: null, // File object
//     thumbnail_name: "",
//     thumbnail_url: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // Track if existing thumbnail was removed
//   const [existingThumbnailRemoved, setExistingThumbnailRemoved] = useState(false);

//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEditMode = Boolean(id);

//   const { showModal } = useModal();

//   const handleCancel = () => {
//     navigate("/admin/image-setup/manage-galary");
//   };

//   useEffect(() => {
//     if (isEditMode) {
//       const fetchCategoryById = async () => {
//         try {
//           const res = await axios.get(
//             `${import.meta.env.VITE_API_BASE_URL}/image-setup/category/${id}`,
//             { withCredentials: true }
//           );

//           const {
//             en_category,
//             od_category,
//             category_type,
//             thumbnail,
//             thumbnail_url,
//           } = res.data.category;

//           setFormData({
//             en_category: en_category || "",
//             od_category: od_category || "",
//             category_type: (category_type || "photo").toLowerCase(),
//             thumbnail: null,
//             thumbnail_name: thumbnail || "",
//             thumbnail_url: thumbnail_url || "",
//           });
//           setExistingThumbnailRemoved(false); // reset flag when loading data
//           setErrors({});
//         } catch (error) {
//           showModal("error", "Failed to fetch category data.");
//           console.error("Failed to fetch category:", error);
//         }
//       };

//       fetchCategoryById();
//     }
//   }, [id, isEditMode, showModal]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "category_type") {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value.toLowerCase(),
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }

//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleThumbnailChange = (file, validationError) => {
//     if (validationError) {
//       setFormData((prev) => ({ ...prev, thumbnail: null }));
//       setErrors((prev) => ({ ...prev, thumbnail: validationError }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         thumbnail: file,
//         thumbnail_name: "",
//         thumbnail_url: "",
//       }));
//       setErrors((prev) => ({ ...prev, thumbnail: "" }));
//       setExistingThumbnailRemoved(false); // new file selected, reset removed flag
//     }
//   };

//   const handleThumbnailRemove = () => {
//     setFormData((prev) => ({
//       ...prev,
//       thumbnail: null,
//       thumbnail_name: "",
//       thumbnail_url: "",
//     }));
//     setErrors((prev) => ({ ...prev, thumbnail: "" }));
//     setExistingThumbnailRemoved(true); // mark existing thumbnail as removed
//   };

//   const validate = () => {
//     const newErrors = {};

//     if (!formData.en_category.trim())
//       newErrors.en_category = "Category (English) is required.";
//     if (!formData.od_category.trim())
//       newErrors.od_category = "Category (Odia) is required.";

//     if (!formData.thumbnail && !formData.thumbnail_url && !isEditMode) {
//       newErrors.thumbnail = "Thumbnail is required.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setIsSubmitting(true);

//     const data = new FormData();
//     data.append("en_category", formData.en_category);
//     data.append("od_category", formData.od_category);
//     data.append("category_type", formData.category_type);

//     if (formData.thumbnail) {
//       // New file uploaded
//       data.append("thumbnail", formData.thumbnail);
//     } else if (isEditMode && existingThumbnailRemoved) {
//       // Existing thumbnail removed, no new file uploaded
//       data.append("thumbnail", "");
//     }
//     // else: existing thumbnail kept, send nothing for thumbnail (backend keeps old)

//     try {
//       if (isEditMode) {
//         await axios.put(
//           `${import.meta.env.VITE_API_BASE_URL}/image-setup/update-category/${id}`,
//           data,
//           {
//             withCredentials: true,
//             headers: { "Content-Type": "multipart/form-data" },
//           }
//         );
//         showModal("success", "Gallery category updated successfully.");
//       } else {
//         await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}/image-setup/register-category`,
//           data,
//           {
//             withCredentials: true,
//             headers: { "Content-Type": "multipart/form-data" },
//           }
//         );
//         showModal("success", "Gallery category created successfully.");
//       }

//       navigate("/admin/image-setup/manage-galary");
//     } catch (error) {
//       showModal(
//         "error",
//         error.response?.data?.message || "Failed to submit the form."
//       );
//       console.error(
//         "Error submitting form:",
//         error.response?.data || error.message
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       en_category: "",
//       od_category: "",
//       category_type: "photo",
//       thumbnail: null,
//       thumbnail_name: "",
//       thumbnail_url: "",
//     });
//     setErrors({});
//     setExistingThumbnailRemoved(false);
//   };

//   return (
//     <div className="mx-auto p-6 min-h-[80vh]">
//       <div className="bg-white p-6 rounded">
//         <Header
//           title={isEditMode ? "Edit Gallery Category" : "Add Gallery Category"}
//           onGoBack={handleCancel}
//         />

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Category (In English)
//             </label>
//             <input
//               type="text"
//               name="en_category"
//               value={formData.en_category}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             />
//             {errors.en_category && (
//               <p className="text-red-600 text-sm mt-1">{errors.en_category}</p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Category (In Odia)
//             </label>
//             <input
//               type="text"
//               name="od_category"
//               value={formData.od_category}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             />
//             {errors.od_category && (
//               <p className="text-red-600 text-sm mt-1">{errors.od_category}</p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Category Type
//             </label>
//             <select
//               name="category_type"
//               value={formData.category_type}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             >
//               <option value="photo">Photo</option>
//               <option value="video">Video</option>
//             </select>
//           </div>

//           <div className="mb-6">
//             <DocumentUploader
//               label="Upload Thumbnail"
//               file={formData.thumbnail}
//               existingFileName={formData.thumbnail_name}
//               existingFileUrl={formData.thumbnail_url}
//               onFileChange={handleThumbnailChange}
//               onRemove={handleThumbnailRemove}
//               allowedTypes={["image/jpeg", "image/png", "image/webp"]}
//               maxSizeMB={2}
//               error={errors.thumbnail}
//             />
//           </div>

//           <div className="flex space-x-2">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               {isSubmitting ? "Submitting..." : "Submit"}
//             </button>

//             <button
//               type="reset"
//               onClick={handleReset}
//               className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               Reset
//             </button>

//             <button
//               type="button"
//               onClick={handleCancel}
//               className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManageGallaryForm;
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import Header from "../../../Components/Admin/Add/Header";
// import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";
// import { useModal } from "../../../context/ModalProvider";
// import FormActions from "@/Components/Admin/Add/FormActions";

// const ManageGallaryForm = () => {
//   const [formData, setFormData] = useState({
//     en_category: "",
//     od_category: "",
//     category_type: "photo",
//     thumbnail: null, // File object
//     thumbnail_name: "",
//     thumbnail_url: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   // Track if existing thumbnail was removed
//   const [existingThumbnailRemoved, setExistingThumbnailRemoved] = useState(false);

//   const navigate = useNavigate();
//   const { id } = useParams();
//   const isEditMode = Boolean(id);

//   const { showModal } = useModal();

//   const handleCancel = () => {
//     navigate("/admin/image-setup/manage-galary");
//   };

//   useEffect(() => {
//     if (isEditMode) {
//       const fetchCategoryById = async () => {
//         try {
//           const res = await axios.get(
//             `${import.meta.env.VITE_API_BASE_URL}/image-setup/category/${id}`,
//             { withCredentials: true }
//           );

//           const {
//             en_category,
//             od_category,
//             category_type,
//             thumbnail,
//             thumbnail_url,
//           } = res.data.category;

//           setFormData({
//             en_category: en_category || "",
//             od_category: od_category || "",
//             category_type: (category_type || "photo").toLowerCase(),
//             thumbnail: null,
//             thumbnail_name: thumbnail || "",
//             thumbnail_url: thumbnail_url || "",
//           });
//           setExistingThumbnailRemoved(false); // reset flag when loading data
//           setErrors({});
//         } catch (error) {
//           showModal("error", "Failed to fetch category data.");
//           console.error("Failed to fetch category:", error);
//         }
//       };

//       fetchCategoryById();
//     }
//   }, [id, isEditMode, showModal]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     if (name === "category_type") {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value.toLowerCase(),
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }

//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleThumbnailChange = (file, validationError) => {
//     if (validationError) {
//       setFormData((prev) => ({ ...prev, thumbnail: null }));
//       setErrors((prev) => ({ ...prev, thumbnail: validationError }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         thumbnail: file,
//         thumbnail_name: "",
//         thumbnail_url: "",
//       }));
//       setErrors((prev) => ({ ...prev, thumbnail: "" }));
//       setExistingThumbnailRemoved(false); // new file selected, reset removed flag
//     }
//   };

//   const handleThumbnailRemove = () => {
//     setFormData((prev) => ({
//       ...prev,
//       thumbnail: null,
//       thumbnail_name: "",
//       thumbnail_url: "",
//     }));
//     setErrors((prev) => ({ ...prev, thumbnail: "" }));
//     setExistingThumbnailRemoved(true); // mark existing thumbnail as removed
//   };

//   const validate = () => {
//     const newErrors = {};

//     if (!formData.en_category.trim())
//       newErrors.en_category = "Category (English) is required.";
//     if (!formData.od_category.trim())
//       newErrors.od_category = "Category (Odia) is required.";

//     if (!formData.thumbnail && !formData.thumbnail_url && !isEditMode) {
//       newErrors.thumbnail = "Thumbnail is required.";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     setIsSubmitting(true);

//     const data = new FormData();
//     data.append("en_category", formData.en_category);
//     data.append("od_category", formData.od_category);
//     data.append("category_type", formData.category_type);

//     if (formData.thumbnail) {
//       // New file uploaded
//       data.append("thumbnail", formData.thumbnail);
//     } else if (isEditMode && existingThumbnailRemoved) {
//       // Existing thumbnail removed, no new file uploaded
//       data.append("thumbnail", "");
//     }
//     // else: existing thumbnail kept, send nothing for thumbnail (backend keeps old)

//     try {
//       if (isEditMode) {
//         await axios.put(
//           `${import.meta.env.VITE_API_BASE_URL}/image-setup/update-category/${id}`,
//           data,
//           {
//             withCredentials: true,
//             headers: { "Content-Type": "multipart/form-data" },
//           }
//         );
//         showModal("success", "Gallery category updated successfully.");
//       } else {
//         await axios.post(
//           `${import.meta.env.VITE_API_BASE_URL}/image-setup/register-category`,
//           data,
//           {
//             withCredentials: true,
//             headers: { "Content-Type": "multipart/form-data" },
//           }
//         );
//         showModal("success", "Gallery category created successfully.");
//       }

//       navigate("/admin/image-setup/manage-galary");
//     } catch (error) {
//       showModal(
//         "error",
//         error.response?.data?.message || "Failed to submit the form."
//       );
//       console.error(
//         "Error submitting form:",
//         error.response?.data || error.message
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       en_category: "",
//       od_category: "",
//       category_type: "photo",
//       thumbnail: null,
//       thumbnail_name: "",
//       thumbnail_url: "",
//     });
//     setErrors({});
//     setExistingThumbnailRemoved(false);
//   };

//   return (
//     <div className="mx-auto p-6 min-h-[80vh]">
//       <div className="bg-white p-6 rounded">
//         <Header
//           title={isEditMode ? "Edit Gallery Category" : "Add Gallery Category"}
//           onGoBack={handleCancel}
//         />

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Category (In English)
//             </label>
//             <input
//               type="text"
//               name="en_category"
//               value={formData.en_category}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             />
//             {errors.en_category && (
//               <p className="text-red-600 text-sm mt-1">{errors.en_category}</p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Category (In Odia)
//             </label>
//             <input
//               type="text"
//               name="od_category"
//               value={formData.od_category}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             />
//             {errors.od_category && (
//               <p className="text-red-600 text-sm mt-1">{errors.od_category}</p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700">
//               Category Type
//             </label>
//             <select
//               name="category_type"
//               value={formData.category_type}
//               onChange={handleChange}
//               className="mt-1 block w-full border rounded px-2 py-1"
//             >
//               <option value="photo">Photo</option>
//               <option value="video">Video</option>
//             </select>
//           </div>

//           <div className="mb-6">
//             <DocumentUploader
//               label="Upload Thumbnail"
//               file={formData.thumbnail}
//               existingFileName={formData.thumbnail_name}
//               existingFileUrl={formData.thumbnail_url}
//               onFileChange={handleThumbnailChange}
//               onRemove={handleThumbnailRemove}
//               allowedTypes={["image/jpeg", "image/png", "image/webp"]}
//               maxSizeMB={2}
//               error={errors.thumbnail}
//             />
//           </div>

//           {/* <div className="flex space-x-2">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               {isSubmitting ? "Submitting..." : "Submit"}
//             </button>

//             <button
//               type="reset"
//               onClick={handleReset}
//               className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               Reset
//             </button>

//             <button
//               type="button"
//               onClick={handleCancel}
//               className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded"
//             >
//               Cancel
//             </button>
//           </div> */}

//           {/* ✅ Updated FormActions with isSubmitting */}
//           <FormActions
//             isSubmitting={isSubmitting}
//             onCancel={handleCancel}
//             onReset={handleReset}
//           />
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ManageGallaryForm;
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../Components/Admin/Add/Header";
import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";
import { useModal } from "../../../context/ModalProvider";
import FormActions from "@/Components/Admin/Add/FormActions";

const ManageGallaryForm = () => {
  const [formData, setFormData] = useState({
    en_category: "",
    od_category: "",
    category_type: "photo",
    thumbnail: null, // File object
    thumbnail_name: "",
    thumbnail_url: "",
  });

  const [initialData, setInitialData] = useState(null); // store initial fetched data
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track if existing thumbnail was removed
  const [existingThumbnailRemoved, setExistingThumbnailRemoved] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { showModal } = useModal();

  const handleCancel = () => {
    navigate("/admin/image-setup/manage-galary");
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchCategoryById = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/image-setup/category/${id}`,
            { withCredentials: true }
          );

          const {
            en_category,
            od_category,
            category_type,
            thumbnail,
            thumbnail_url,
          } = res.data.category;

          const fetchedData = {
            en_category: en_category || "",
            od_category: od_category || "",
            category_type: (category_type || "photo").toLowerCase(),
            thumbnail: null,
            thumbnail_name: thumbnail || "",
            thumbnail_url: thumbnail_url || "",
          };

          setFormData(fetchedData);
          setInitialData(fetchedData); // store initial data for reset
          setExistingThumbnailRemoved(false);
          setErrors({});
        } catch (error) {
          showModal("error", "Failed to fetch category data.");
          console.error("Failed to fetch category:", error);
        }
      };

      fetchCategoryById();
    } else {
      // Clear initialData for create mode
      setInitialData(null);
    }
  }, [id, isEditMode, showModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "category_type") {
      setFormData((prev) => ({
        ...prev,
        [name]: value.toLowerCase(),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleThumbnailChange = (file, validationError) => {
    if (validationError) {
      setFormData((prev) => ({ ...prev, thumbnail: null }));
      setErrors((prev) => ({ ...prev, thumbnail: validationError }));
    } else {
      setFormData((prev) => ({
        ...prev,
        thumbnail: file,
        thumbnail_name: "",
        thumbnail_url: "",
      }));
      setErrors((prev) => ({ ...prev, thumbnail: "" }));
      setExistingThumbnailRemoved(false); // new file selected, reset removed flag
    }
  };

  const handleThumbnailRemove = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnail: null,
      thumbnail_name: "",
      thumbnail_url: "",
    }));
    setErrors((prev) => ({ ...prev, thumbnail: "" }));
    setExistingThumbnailRemoved(true); // mark existing thumbnail as removed
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.en_category.trim())
      newErrors.en_category = "Category (English) is required.";
    if (!formData.od_category.trim())
      newErrors.od_category = "Category (Odia) is required.";

    if (!formData.thumbnail && !formData.thumbnail_url && !isEditMode) {
      newErrors.thumbnail = "Thumbnail is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const data = new FormData();
    data.append("en_category", formData.en_category);
    data.append("od_category", formData.od_category);
    data.append("category_type", formData.category_type);

    if (formData.thumbnail) {
      // New file uploaded
      data.append("thumbnail", formData.thumbnail);
    } else if (isEditMode && existingThumbnailRemoved) {
      // Existing thumbnail removed, no new file uploaded
      data.append("thumbnail", "");
    }
    // else: existing thumbnail kept, send nothing for thumbnail (backend keeps old)

    try {
      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/image-setup/update-category/${id}`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showModal("success", "Gallery category updated successfully.");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/image-setup/register-category`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showModal("success", "Gallery category created successfully.");
      }

      navigate("/admin/image-setup/manage-galary");
    } catch (error) {
      showModal(
        "error",
        error.response?.data?.message || "Failed to submit the form."
      );
      console.error(
        "Error submitting form:",
        error.response?.data || error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isEditMode && initialData) {
      // Reset to fetched initial data
      setFormData(initialData);
      setExistingThumbnailRemoved(false);
    } else {
      // Clear form on create mode
      setFormData({
        en_category: "",
        od_category: "",
        category_type: "photo",
        thumbnail: null,
        thumbnail_name: "",
        thumbnail_url: "",
      });
      setExistingThumbnailRemoved(false);
    }
    setErrors({});
  };

  return (
    <div className="mx-auto p-6 min-h-[80vh]">
      <div className="bg-white p-6 rounded">
        <Header
          title={isEditMode ? "Edit Gallery Category" : "Add Gallery Category"}
          onGoBack={handleCancel}
        />

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category (In English)
            </label>
            <input
              type="text"
              name="en_category"
              value={formData.en_category}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
            {errors.en_category && (
              <p className="text-red-600 text-sm mt-1">{errors.en_category}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category (In Odia)
            </label>
            <input
              type="text"
              name="od_category"
              value={formData.od_category}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
            {errors.od_category && (
              <p className="text-red-600 text-sm mt-1">{errors.od_category}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Category Type
            </label>
            <select
              name="category_type"
              value={formData.category_type}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            >
              <option value="photo">Photo</option>
              <option value="video">Video</option>
            </select>
          </div>

          <div className="mb-6">
            <DocumentUploader
              label="Upload Thumbnail"
              file={formData.thumbnail}
              existingFileName={formData.thumbnail_name}
              existingFileUrl={formData.thumbnail_url}
              onFileChange={handleThumbnailChange}
              onRemove={handleThumbnailRemove}
              allowedTypes={["image/jpeg", "image/png", "image/webp"]}
              maxSizeMB={2}
              error={errors.thumbnail}
            />
          </div>

          <FormActions
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
            onReset={handleReset}
          />
        </form>
      </div>
    </div>
  );
};

export default ManageGallaryForm;
