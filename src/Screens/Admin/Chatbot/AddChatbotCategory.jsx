import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatbotCategoryAPI } from "@/services/api";
import { ArrowLeft } from "lucide-react";
import { ModalDialog } from "@/Components/Admin/Modal/MessageModal";
import FormActions from "@/Components/Admin/Add/FormActions";
import FormField from "@/Components/Admin/TextEditor/FormField";

const INITIAL_FORM_STATE = {
  en_title: "",
  od_title: "",
};

const AddChatbotCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [originalData, setOriginalData] = useState(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [modal, setModal] = useState({
    open: false,
    message: "",
    type: "info",
  });

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      chatbotCategoryAPI
        .get(id)
        .then((response) => {
          const { en_title, od_title } = response.data.category;
          const fetchedData = { en_title, od_title };
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

  const handleFormFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

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

  const handleReset = () => {
    setFormData(originalData);
    setFieldErrors({});
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
      <div className="p-6 bg-white shadow">
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

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                label="Category (in English)"
                required
                maxLength={100}
                name="en_title"
                value={formData.en_title}
                onChange={(value) => handleFormFieldChange("en_title", value)}
                placeholder="Enter category in English"
                error={fieldErrors.en_title}
                disabled={loading}
              />
            </div>

            <div>
              <FormField
                label="Category (in Odia)"
                required
                maxLength={100}
                name="od_title"
                value={formData.od_title}
                onChange={(value) => handleFormFieldChange("od_title", value)}
                placeholder="Enter category in Odia"
                error={fieldErrors.od_title}
                disabled={loading}
              />
            </div>
          </div>

          <FormActions
            isSubmitting={loading}
            isEditMode={isEditMode}
            onCancel={handleCancel}
            onReset={handleReset}
            submitLabel={isEditMode ? "Update" : "Create"}
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