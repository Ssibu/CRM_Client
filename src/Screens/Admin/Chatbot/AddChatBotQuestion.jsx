import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatbotCategoryAPI } from "../../../services/api";
import chatbotQuestionAPI from "../../../services/chatbotQuestionAPI";
import { ModalDialog } from "../../../Components/Admin/Modal/MessageModal";
import FormActions from "../../../Components/Admin/Add/FormActions";
import FormField from "../../../Components/Admin/TextEditor/FormField"; // Import FormField
import { ArrowLeft } from "lucide-react";

const INITIAL_FORM_STATE = {
  category_id: "",
  en_question: "",
  od_question: "",
};

const AddChatBotQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [originalData, setOriginalData] = useState(INITIAL_FORM_STATE);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [modal, setModal] = useState({
    open: false,
    variant: "info",
    message: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await chatbotCategoryAPI.getAll(1, 1000, "");
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories for the dropdown.");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      chatbotQuestionAPI
        .get(id)
        .then((response) => {
          const { category_id, en_question, od_question } =
            response.data.question;
          const fetchedData = {
            category_id: category_id.toString(), // Ensure it's a string for select value
            en_question,
            od_question,
          };
          setFormData(fetchedData);
          setOriginalData(fetchedData);
        })
        .catch((err) => {
          console.error("Failed to fetch question:", err);
          setError(
            "Could not load the question data. Please go back and try again."
          );
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) setError("");
  };

  const handleFormFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) setError("");
  };

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

  const checkForDuplicates = async () => {
    try {
      const response = await chatbotQuestionAPI.getAll(1, 1000, "");
      const questions = response.data.questions || [];
      const englishDuplicate = questions.find(
        (question) =>
          question.en_question.toLowerCase() ===
            formData.en_question.trim().toLowerCase() &&
          (!isEditMode || question.id !== parseInt(id))
      );
      const odiaDuplicate = questions.find(
        (question) =>
          question.od_question === formData.od_question.trim() &&
          (!isEditMode || question.id !== parseInt(id))
      );
      return {
        englishDuplicate: !!englishDuplicate,
        odiaDuplicate: !!odiaDuplicate,
      };
    } catch (error) {
      console.error("Error checking for duplicates:", error);
      return { englishDuplicate: false, odiaDuplicate: false };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const duplicates = await checkForDuplicates();
    if (duplicates.englishDuplicate) {
      setModal({
        open: true,
        variant: "error",
        message: "A question with this English text already exists!",
      });
      setLoading(false);
      return;
    }
    if (duplicates.odiaDuplicate) {
      setModal({
        open: true,
        variant: "error",
        message: "A question with this Odia text already exists!",
      });
      setLoading(false);
      return;
    }

    const submitData = {
      category_id: formData.category_id,
      en_question: formData.en_question.trim(),
      od_question: formData.od_question.trim(),
    };

    try {
      if (isEditMode) {
        await chatbotQuestionAPI.update(id, submitData);
        setModal({
          open: true,
          variant: "success",
          message: "Question updated successfully!",
        });
      } else {
        await chatbotQuestionAPI.create(submitData);
        setModal({
          open: true,
          variant: "success",
          message: "Question created successfully!",
        });
      }
    } catch (error) {
      console.error("Error submitting question:", error);
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      setModal({ open: true, variant: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData(originalData);
    setError("");
    setFieldErrors({});
  };

  const handleCancel = () => {
    navigate("/admin/manage-chatbot/chatbot-question");
  };

  const handleModalClose = () => {
    const isSuccess = modal.variant === "success";
    setModal({ ...modal, open: false });
    if (isSuccess) {
      navigate("/admin/manage-chatbot/chatbot-question");
    }
  };

  const pageTitle = isEditMode
    ? "Edit Chatbot Question"
    : "Add Chatbot Question";

  return (
    <div className="min-h-[80vh]">
      <div className="p-4 bg-white shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{pageTitle}</h2>
          <button
            onClick={handleCancel}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 py-2 rounded-md font-medium flex items-center gap-2 transition"
            disabled={loading}
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>

        {loading && isEditMode ? (
          <p>Loading question data...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="md:col-span-2">
              <label htmlFor="category_id" className="block text-sm font-medium mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleSelectChange}
                className={`w-full border rounded px-3 py-2.5 bg-white ${
                  fieldErrors.category_id ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.category_id}
                </p>
              )}
            </div>

            <div>
              <FormField
                label="Question (English)"
                required
                
                maxLength={100}
                name="en_question"
                value={formData.en_question}
                onChange={(value) => handleFormFieldChange("en_question", value)}
                placeholder="Enter question in English"
                error={fieldErrors.en_question}
                disabled={loading}
              />
            </div>

            <div>
              <FormField
                label="Question (Odia)"
                required
                 maxLength={100}
                name="od_question"
                value={formData.od_question}
                onChange={(value) => handleFormFieldChange("od_question", value)}
                placeholder="Enter question in Odia"
                error={fieldErrors.od_question}
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <FormActions
                isSubmitting={loading}
                isEditMode={isEditMode}
                onCancel={handleCancel}
                onReset={handleReset}
                submitLabel={isEditMode ? "Update Question" : "Create Question"}
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