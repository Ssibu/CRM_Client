import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatbotCategoryAPI } from "../../../services/api";
import chatbotQuestionAPI from "../../../services/chatbotQuestionAPI";
import { ModalDialog } from "../../../Components/Admin/Modal/MessageModal";
import FormActions from "../../../Components/Admin/Add/FormActions";

// NEW: Define the initial empty state for reusability.
const INITIAL_FORM_STATE = {
  category_id: "",
  en_question: "",
  od_question: ""
};

const AddChatBotQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  // NEW: State to store the original data for resetting.
  const [originalData, setOriginalData] = useState(INITIAL_FORM_STATE);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [modal, setModal] = useState({
    open: false,
    variant: "info",
    message: ""
  });

  // Fetch categories for the dropdown (no changes here)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await chatbotCategoryAPI.getAll(1, 1000, '');
        setCategories(response.data.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError("Failed to load categories for the dropdown.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch question data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      chatbotQuestionAPI.get(id)
        .then(response => {
          const { category_id, en_question, od_question } = response.data.question;
          
          // CHANGED: Create a structured data object from the fetched question.
          const fetchedData = { category_id, en_question, od_question };
          
          // CHANGED: Set both the form data and the original data for reset functionality.
          setFormData(fetchedData);
          setOriginalData(fetchedData);
        })
        .catch(err => {
          console.error("Failed to fetch question:", err);
          setError("Could not load the question data. Please go back and try again.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  // handleChange function remains the same
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (error) setError("");
  };

  // validateForm function remains the same
  const validateForm = () => {
    const errors = {};
    const trimmedEn = formData.en_question.trim();
    const trimmedOd = formData.od_question.trim();

    if (!formData.category_id) {
      errors.category_id = "Please select a category";
    }
    if (!trimmedEn) {
      errors.en_question = "English question is required";
    } else if (trimmedEn.length < 2) {
      errors.en_question = "English question must be at least 2 characters";
    }
    if (!trimmedOd) {
      errors.od_question = "Odia question is required";
    } else if (trimmedOd.length < 2) {
      errors.od_question = "Odia question must be at least 2 characters";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // checkForDuplicates function remains the same
  const checkForDuplicates = async () => {
    try {
      const response = await chatbotQuestionAPI.getAll(1, 1000, '');
      const questions = response.data.questions || [];

      const englishDuplicate = questions.find(question =>
        question.en_question.toLowerCase() === formData.en_question.trim().toLowerCase() &&
        (!isEditMode || question.id !== parseInt(id))
      );
      const odiaDuplicate = questions.find(question =>
        question.od_question === formData.od_question.trim() &&
        (!isEditMode || question.id !== parseInt(id))
      );

      return { englishDuplicate: !!englishDuplicate, odiaDuplicate: !!odiaDuplicate };
    } catch (error) {
      console.error("Error checking for duplicates:", error);
      return { englishDuplicate: false, odiaDuplicate: false };
    }
  };

  // handleSubmit function remains mostly the same, navigation logic is moved to modal close
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const duplicates = await checkForDuplicates();
    if (duplicates.englishDuplicate) {
      setModal({ open: true, variant: "error", message: "A question with this English text already exists!" });
      setLoading(false);
      return;
    }
    if (duplicates.odiaDuplicate) {
      setModal({ open: true, variant: "error", message: "A question with this Odia text already exists!" });
      setLoading(false);
      return;
    }

    const submitData = {
      category_id: formData.category_id,
      en_question: formData.en_question.trim(),
      od_question: formData.od_question.trim()
    };

    try {
      if (isEditMode) {
        await chatbotQuestionAPI.update(id, submitData);
        setModal({ open: true, variant: "success", message: "Question updated successfully!" });
      } else {
        await chatbotQuestionAPI.create(submitData);
        setModal({ open: true, variant: "success", message: "Question created successfully!" });
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      setModal({ open: true, variant: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // CHANGED: The new, unified reset handler.
  const handleReset = () => {
    // Reverts to the original data, which is either empty (add mode) or fetched (edit mode).
    setFormData(originalData);
    setError("");
    setFieldErrors({});
  };

  const handleCancel = () => {
    navigate("/admin/manage-chatbot/chatbot-question");
  };

  // CHANGED: Improved modal close handler to navigate on success.
  const handleModalClose = () => {
    const isSuccess = modal.variant === "success";
    setModal({ ...modal, open: false }); // Close the modal first
    if (isSuccess) {
      navigate("/admin/manage-chatbot/chatbot-question"); // Then navigate
    }
  };
  
  const pageTitle = isEditMode ? "Edit Chatbot Question" : "Add Chatbot Question";

  return (
    <div className="min-h-[80vh] py-4 font-sans">
      <div className="p-6 bg-white shadow rounded-xl container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{pageTitle}</h2>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
            disabled={loading}
          >
            ← Go Back
          </button>
        </div>

        {loading && isEditMode ? (
          <p>Loading question data...</p>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 bg-white ${fieldErrors.category_id ? "border-red-500" : ""}`}
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.en_title}
                  </option>
                ))}
              </select>
              {fieldErrors.category_id && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.category_id}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Question (English)<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="en_question"
                value={formData.en_question}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${fieldErrors.en_question ? "border-red-500" : ""}`}
                placeholder="Enter question in English"
                disabled={loading}
              />
              {fieldErrors.en_question && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.en_question}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Question (Odia)<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="od_question"
                value={formData.od_question}
                onChange={handleChange}
                className={`w-full border rounded px-3 py-2 ${fieldErrors.od_question ? "border-red-500" : ""}`}
                placeholder="Enter question in Odia"
                disabled={loading}
              />
              {fieldErrors.od_question && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.od_question}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <FormActions
                isSubmitting={loading}
                isEditMode={isEditMode}
                onCancel={handleCancel}
                onReset={handleReset}
                submitLabel={isEditMode ? "Update Question" : "Submit Question"}
              />
            </div>
          </form>
        )}
      </div>

      <ModalDialog
        open={modal.open}
        onClose={handleModalClose}
        variant={modal.variant}
        message={modal.message}
      />
    </div>
  );
};

export default AddChatBotQuestion;