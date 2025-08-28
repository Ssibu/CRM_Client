
// import React, { useState, useEffect, useCallback, memo } from "react";
// import { motion } from "framer-motion";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";

// // External components jo humein abhi bhi chahiye
// import RichTextEditor from "../../Components/TextEditor/RichTextEditor";
// import FormField from "../../Components/TextEditor/FormField";
// import ImageUploader from "../../Components/TextEditor/ImageUploader";

// const API_BASE_URL = process.env.REACT_APP_API_URL;

// // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// // + SECTION 1: CHILD COMPONENTS (Ab yeh isi file ka hissa hain)
// // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// const Header = memo(({ title, onGoBack }) => (
//   <div className="flex justify-between items-center mb-6 pb-4 border-b">
//     <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
//     <button
//       type="button"
//       onClick={onGoBack}
//       className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
//     >
//       &larr; Go Back
//     </button>
//   </div>
// ));

// // Yeh Menu form ke liye simplified fields hain
// const FormFieldsGroup = memo(({ formData, onInputChange, onImageChange }) => (
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//     <FormField
//       label="Title (In English) *"
//       placeholder="Enter title in English"
//       value={formData.titleEnglish}
//       onChange={(val) => onInputChange("titleEnglish", val)}
//       required
//     />
//     <FormField
//       label="Title (In Odia) *"
//       placeholder="Enter title in Odia"
//       value={formData.titleOdia}
//       onChange={(val) => onInputChange("titleOdia", val)}
//       required
//     />
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:col-span-2">
//       <ImageUploader file={formData.image} onChange={onImageChange} />
//       <FormField
//         label="Link (Optional)"
//         placeholder="https://example.com"
//         value={formData.link}
//         onChange={(val) => onInputChange("link", val)}
//         type="url"
//       />
//     </div>
//   </div>
// ));

// const DescriptionFields = memo(({ formData, onInputChange }) => (
//   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
//     <div className="md:col-span-2">
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         Description (In English) *
//       </label>
//       <RichTextEditor
//         value={formData.descriptionEnglish}
//         onChange={(val) => onInputChange("descriptionEnglish", val)}
//         placeholder="Enter description..."
//       />
//     </div>
//     <div className="md:col-span-2">
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         Description (In Odia) *
//       </label>
//       <RichTextEditor
//         value={formData.descriptionOdia}
//         onChange={(val) => onInputChange("descriptionOdia", val)}
//         placeholder="Enter description..."
//       />
//     </div>
//   </div>
// ));

// const FormActions = memo(({ onReset, onCancel, isSubmitting, isEditMode }) => (
//   <div className="flex justify-start items-center gap-4 mt-8 pt-6 border-t">
//     <button
//       type="submit"
//       disabled={isSubmitting}
//       className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
//     >
//       {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Menu' : 'Submit Menu')}
//     </button>
//     <button
//       type="button"
//       onClick={onReset}
//       className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
//     >
//       Reset
//     </button>
//     <button
//       type="button"
//       onClick={onCancel}
//       className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
//     >
//       Cancel
//     </button>
//   </div>
// ));


// // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// // + SECTION 2: MAIN COMPONENT (AddMenu)
// // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// const AddMenu = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEditMode = !!id;

//   const [formData, setFormData] = useState({
//     titleEnglish: "",
//     titleOdia: "",
//     descriptionEnglish: "",
//     descriptionOdia: "",
//     link: "",
//     image: null,
//   });
  
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (isEditMode) {
//       const fetchMenuData = async () => {
//         setIsLoading(true); // Data fetch shuru hone par loading true karein
//         try {
//           const res = await axios.get(`${API_BASE_URL}/api/menus/${id}`);
//           const menu = res.data;
//           // Form state ko backend se aaye data se bharein
//           setFormData({
//             titleEnglish: menu.title_en || "",
//             titleOdia: menu.title_od || "",
//             descriptionEnglish: menu.description_en || "", // Yahaan fallback zaroori hai
//             descriptionOdia: menu.description_od || "",   // Yahaan bhi fallback zaroori hai
//             link: menu.link || "",
//             image: null, // Image ko reset karein, user nayi upload kar sakta hai
//           });
//         } catch (error) {
//           console.error("Failed to fetch menu data:", error);
//           alert("Could not load menu data for editing.");
//           navigate("/admin/menusetup/menu");
//         } finally {
//             setIsLoading(false); // Data fetch hone ke baad loading false karein
//         }
//       };
//       fetchMenuData();
//     }
//   }, [id, isEditMode, navigate]);

//   const handleInputChange = useCallback((field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   }, []);

//   const handleImageChange = useCallback((file) => {
//     handleInputChange("image", file);
//   }, [handleInputChange]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     const data = new FormData();
//     data.append("title_en", formData.titleEnglish);
//     data.append("title_od", formData.titleOdia);
//     data.append("description_en", formData.descriptionEnglish);
//     data.append("description_od", formData.descriptionOdia);
//     data.append("link", formData.link);
//     if (formData.image instanceof File) {
//       data.append("image", formData.image);
//     }

//     try {
//       if (isEditMode) {
//         await axios.put(`${API_BASE_URL}/api/menus/${id}`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
          
//         });
//         alert("Menu updated successfully!");
//         // --- UI UPDATE FIX ---
//         // 'state' object bhejein taaki table page ko refresh hone ka signal mile
//         navigate("/admin/menusetup/menu", { state: { updated: true } });
//       } else {
//         await axios.post(`${API_BASE_URL}/api/menus`, data, {
//           headers: { "Content-Type": "multipart/form-data" },
//         });
//         alert("Menu added successfully!");
//         handleReset();
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       const errorMessage = error.response?.data?.message || "An error occurred.";
//       alert(`Error: ${errorMessage}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({
//       titleEnglish: "", titleOdia: "", descriptionEnglish: "",
//       descriptionOdia: "", link: "", image: null,
//     });
//   };

//   const handleGoBack = () => navigate(-1);

//   return (
//     <motion.div
//       className="min-h-screen bg-gray-50 p-6"
//       initial={{ opacity: 0, y: 30 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4, ease: "easeOut" }}
//     >
//       <Header title={isEditMode ? "Edit Menu" : "Add Menu"} onGoBack={handleGoBack} />
      
//       {/* --- DESCRIPTION & LOADING FIX --- */}
//       {isLoading ? (
//         <div className="text-center p-10 font-semibold">Loading Form Data...</div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//             <FormFieldsGroup
//               formData={formData}                  
//               onInputChange={handleInputChange}
//               onImageChange={handleImageChange}
//             />
//             <DescriptionFields 
//                 formData={formData} 
//                 onInputChange={handleInputChange} 
//             />
//             <FormActions
//               onReset={handleReset}
//               onCancel={handleGoBack}
//               isSubmitting={isSubmitting}
//               isEditMode={isEditMode}
//             />
//         </form>
//       )}
//     </motion.div>
//   );
// };

// export default AddMenu;
import React, { useState, useEffect, useCallback, memo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

// External components
import RichTextEditor from "../../Components/TextEditor/RichTextEditor";
import FormField from "../../Components/TextEditor/FormField";
import ImageUploader from "../../Components/TextEditor/ImageUploader";

const API_BASE_URL = "http://localhost:7777";

// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// + SECTION 1: CHILD COMPONENTS
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const Header = memo(({ title, onGoBack }) => (
  <div className="flex justify-between items-center mb-6 pb-4 border-b">
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    <button
      type="button"
      onClick={onGoBack}
      className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
    >
      &larr; Go Back
    </button>
  </div>
));

const FormFieldsGroup = memo(({ formData, onInputChange, onImageChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    <FormField
      label="Title (In English) *"
      placeholder="Enter title in English"
      value={formData.titleEnglish}
      onChange={(val) => onInputChange("titleEnglish", val)}
      required
    />
    <FormField
      label="Title (In Odia) *"
      placeholder="Enter title in Odia"
      value={formData.titleOdia}
      onChange={(val) => onInputChange("titleOdia", val)}
      required
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full md:col-span-2">
      <ImageUploader file={formData.image} onChange={onImageChange} />
      <FormField
        label="Link (Optional)"
        placeholder="https://example.com"
        value={formData.link}
        onChange={(val) => onInputChange("link", val)}
        type="url"
      />
    </div>
  </div>
));

const DescriptionFields = memo(({ formData, onInputChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description (In English) *
      </label>
      <RichTextEditor
        value={formData.descriptionEnglish}
        onChange={(val) => onInputChange("descriptionEnglish", val)}
        placeholder="Enter description..."
      />
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description (In Odia) *
      </label>
      <RichTextEditor
        value={formData.descriptionOdia}
        onChange={(val) => onInputChange("descriptionOdia", val)}
        placeholder="Enter description..."
      />
    </div>
  </div>
));

const FormActions = memo(({ onReset, onCancel, isSubmitting, isEditMode }) => (
  <div className="flex justify-start items-center gap-4 mt-8 pt-6 border-t">
    <button
      type="submit"
      disabled={isSubmitting}
      className="bg-green-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
    >
      {isSubmitting ? 'Saving...' : (isEditMode ? 'Update Menu' : 'Submit Menu')}
    </button>
    <button
      type="button"
      onClick={onReset}
      className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
    >
      Reset
    </button>
    <button
      type="button"
      onClick={onCancel}
      className="bg-red-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
    >
      Cancel
    </button>
  </div>
));


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// + SECTION 2: MAIN COMPONENT (AddMenu)
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const AddMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    titleEnglish: "",
    titleOdia: "",
    descriptionEnglish: "",
    descriptionOdia: "",
    link: "",
    image: null,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode); // Only load if in edit mode

  useEffect(() => {
    if (isEditMode) {
      const fetchMenuData = async () => {
        try {
          const res = await axios.get(`${API_BASE_URL}/api/menus/${id}`);
          const menu = res.data;
          setFormData({
            titleEnglish: menu.title_en || "",
            titleOdia: menu.title_od || "",
            descriptionEnglish: menu.description_en || "",
            descriptionOdia: menu.description_od || "",
            link: menu.link || "",
            image: null,
          });
        } catch (error) {
          console.error("Failed to fetch menu data:", error);
          alert("Could not load menu data for editing.");
          navigate("/admin/menusetup/menu");
        } finally {
            setIsLoading(false);
        }
      };
      fetchMenuData();
    }
  }, [id, isEditMode, navigate]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleImageChange = useCallback((file) => {
    handleInputChange("image", file);
  }, [handleInputChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append("title_en", formData.titleEnglish);
    data.append("title_od", formData.titleOdia);
    data.append("description_en", formData.descriptionEnglish);
    data.append("description_od", formData.descriptionOdia);
    data.append("link", formData.link);
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    try {
      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/api/menus/${id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Menu updated successfully!");
      } else {
        await axios.post(`${API_BASE_URL}/api/menus`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Menu added successfully!");
      }

      // ✅ FIX IS HERE: Dono hi cases (add aur edit) mein success ke baad redirect karein
      navigate("/admin/menusetup/menu", { state: { updated: true } });

    } catch (error) {
      console.error("Error submitting form:", error);
      const errorMessage = error.response?.data?.message || "An error occurred.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      titleEnglish: "", titleOdia: "", descriptionEnglish: "",
      descriptionOdia: "", link: "", image: null,
    });
  };

  const handleGoBack = () => navigate(-1);

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Header title={isEditMode ? "Edit Menu" : "Add Menu"} onGoBack={handleGoBack} />
      
      {isLoading ? (
        <div className="text-center p-10 font-semibold">Loading Form Data...</div>
      ) : (
        <form onSubmit={handleSubmit}>
            <FormFieldsGroup
              formData={formData}                  
              onInputChange={handleInputChange}
              onImageChange={handleImageChange}
            />
            <DescriptionFields 
                formData={formData} 
                onInputChange={handleInputChange} 
            />
            <FormActions
              onReset={handleReset}
              onCancel={handleGoBack}
              isSubmitting={isSubmitting}
              isEditMode={isEditMode}
            />
        </form>
      )}
    </motion.div>
  );
};

export default AddMenu;