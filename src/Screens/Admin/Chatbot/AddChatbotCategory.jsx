import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatbotCategoryAPI } from "@/services/api";
import { ArrowLeft } from "lucide-react";
import { ModalDialog } from "@/Components/Admin/Modal/MessageModal";
import FormActions from "@/Components/Admin/Add/FormActions";

// NEW: Define the initial empty state as a constant.
const INITIAL_FORM_STATE = {
  en_title: "",
  od_title: "",
};

const AddChatbotCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  // NEW: State to store the original data for resetting.
  const [originalData, setOriginalData] = useState(INITIAL_FORM_STATE);

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [modal, setModal] = useState({ open: false, message: "", type: "info" });

  // Fetch category data if in edit mode
  useEffect(() => {
    // In add mode, we do nothing; the state is already correct.
    if (isEditMode) {
      setLoading(true);
      chatbotCategoryAPI
        .get(id)
        .then((response) => {
          const { en_title, od_title } = response.data.category;
          
          // CHANGED: Create a structured data object from the response.
          const fetchedData = { en_title, od_title };

          // CHANGED: Set both the form's current state and the backup "original" state.
          setFormData(fetchedData);
          setOriginalData(fetchedData);
        })
        .catch((err) => {
          console.error("Failed to fetch category:", err);
          setModal({
            open: true,
            message: "Could not load category data. Please try again.",
            type: "error",
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // validateForm function remains the same
  const validateForm = () => {
    const errors = {};
    if (!formData.en_title.trim()) {
      errors.en_title = "English category name is required";
    } else if (formData.en_title.trim().length < 2) {
      errors.en_title = "Must be at least 2 characters";
    }

    if (!formData.od_title.trim()) {
      errors.od_title = "Odia category name is required";
    } else if (formData.od_title.trim().length < 2) {
      errors.od_title = "Must be at least 2 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // checkForDuplicates function remains the same
  const checkForDuplicates = async () => {
    try {
      const res = await chatbotCategoryAPI.getAll(1, 1000, "");
      const categories = res.data.categories || [];

      const en = formData.en_title.trim().toLowerCase();
      const od = formData.od_title.trim();

      const englishExists = categories.find(
        (cat) =>
          cat.en_title?.trim().toLowerCase() === en &&
          (!isEditMode || cat.id !== parseInt(id))
      );
      const odiaExists = categories.find(
        (cat) =>
          cat.od_title?.trim() === od &&
          (!isEditMode || cat.id !== parseInt(id))
      );

      return {
        englishDuplicate: !!englishExists,
        odiaDuplicate: !!odiaExists,
      };
    } catch (error) {
      console.error("Duplicate check error:", error);
      return { englishDuplicate: false, odiaDuplicate: false };
    }
  };
  
  // handleSubmit function remains the same
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { englishDuplicate, odiaDuplicate } = await checkForDuplicates();

      if (englishDuplicate) {
        setModal({
          open: true,
          message: "Category with this English name already exists.",
          type: "error",
        });
        return;
      }
      if (odiaDuplicate) {
        setModal({
          open: true,
          message: "Category with this Odia name already exists.",
          type: "error",
        });
        return;
      }

      if (isEditMode) {
        await chatbotCategoryAPI.update(id, formData);
        setModal({
          open: true,
          message: "Category updated successfully!",
          type: "success",
        });
      } else {
        await chatbotCategoryAPI.create(formData);
        setModal({
          open: true,
          message: "Category created successfully!",
          type: "success",
        });
      }
    } catch (err) {
      console.error("Submission error:", err);
      const msg = err.response?.data?.message || "Unexpected error occurred.";
      setModal({ open: true, message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // CHANGED: This is the new, unified reset handler.
  const handleReset = () => {
    // It reverts the form data to whatever is in 'originalData'.
    // In 'add' mode, originalData is the empty state.
    // In 'edit' mode, originalData is the data fetched from the API.
    setFormData(originalData);
    setFieldErrors({}); // Also clear any validation errors.
  };

  const handleCancel = () => {
    navigate("/admin/manage-chatbot/chatbot-category");
  };

  const handleModalClose = () => {
    setModal({ ...modal, open: false });
    if (modal.type === "success") {
      handleCancel();
    }
  };

  return (
    <div className="min-h-[80vh]">
      <div className="p-4 bg-white shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Edit Chatbot Category" : "Add Chatbot Category"}
          </h2>
          <button
            onClick={handleCancel}
             className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 py-2 rounded-md font-medium flex items-center gap-2 transition"
            disabled={loading}
          >
           <ArrowLeft size={16} /> Go Back
          </button>
        </div>

        {/* The form JSX remains the same */}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label htmlFor="en_title" className="block text-sm font-medium mb-1">
        Category (in English) <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="en_title" // Added for accessibility
        name="en_title"
        value={formData.en_title}
        onChange={handleChange}
        placeholder="Enter category in English"
        className={`w-full rounded px-3 py-2 border ${ // <-- Added "border" class
          fieldErrors.en_title ? "border-red-500" : "border-gray-300"
        }`}
        disabled={loading}
      />
      {fieldErrors.en_title && (
        <p className="text-red-500 text-sm mt-1">{fieldErrors.en_title}</p>
      )}
    </div>

    <div>
      <label htmlFor="od_title" className="block text-sm font-medium mb-1">
        Category (in Odia) <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="od_title" // Added for accessibility
        name="od_title"
        value={formData.od_title}
        onChange={handleChange}
        placeholder="Enter category in Odia"
        className={`w-full rounded px-3 py-2 border ${ // <-- Added "border" class
          fieldErrors.od_title ? "border-red-500" : "border-gray-300"
        }`}
        disabled={loading}
      />
      {fieldErrors.od_title && (
        <p className="text-red-500 text-sm mt-1">{fieldErrors.od_title}</p>
      )}
    </div>
  </div>

          {/* CHANGED: Pass isEditMode and the new handleReset to FormActions */}
          <FormActions
            isSubmitting={loading}
            isEditMode={isEditMode}
            onCancel={handleCancel}
            onReset={handleReset} 
            submitLabel={isEditMode ? "Update" : "Update"}
          />
        </form>
      </div>

      <ModalDialog
        open={modal.open}
        onClose={handleModalClose}
        variant={modal.type}
        message={modal.message}
      />
    </div>
  );
};

export default AddChatbotCategory;