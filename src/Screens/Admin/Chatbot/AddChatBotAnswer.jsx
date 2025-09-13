import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatbotCategoryAPI } from "../../../services/api";
import chatbotAnswerAPI from "../../../services/chatbotAnswerAPI";
import chatbotQuestionAPI from "../../../services/chatbotQuestionAPI";
import { ModalDialog } from "../../../Components/Admin/Modal/MessageModal";
import RichTextEditor from "@/Components/Admin/TextEditor/RichTextEditor";
import FormActions from "@/Components/Admin/Add/FormActions";
import { ArrowLeft } from "lucide-react";

const INITIAL_FORM_STATE = {
  category_id: "",
  question_id: "",
  en_answer: "",
  od_answer: "",
  status: "Active",
};

const AddChatbotAnswer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [originalData, setOriginalData] = useState(INITIAL_FORM_STATE);
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
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
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (formData.category_id) {
        setLoading(true);
        try {
          const response = await chatbotQuestionAPI.getByCategory(
            formData.category_id
          );
          setQuestions(response.data.questions || []);
        } catch (error) {
          console.error("Error fetching questions:", error);
          setError("Failed to load questions for the selected category");
          setQuestions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setQuestions([]);
      }
    };
    fetchQuestions();
  }, [formData.category_id]);

  useEffect(() => {
    if (isEditMode) {
      const fetchAnswerData = async () => {
        setLoading(true);
        try {
          const response = await chatbotAnswerAPI.get(id);
          const answer = response.data.answer;
          const fetchedData = {
            category_id: answer.category_id?.toString() || "",
            question_id: answer.question_id?.toString() || "",
            en_answer: answer.en_answer || "",
            od_answer: answer.od_answer || "",
            status: answer.status || "Active",
          };
          setFormData(fetchedData);
          setOriginalData(fetchedData);
        } catch (err) {
          console.error("Error fetching answer:", err);
          setError(
            "Failed to load answer data: " +
              (err.response?.data?.message || err.message)
          );
        } finally {
          setLoading(false);
        }
      };
      fetchAnswerData();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category_id" && { question_id: "" }),
    }));
    if (fieldErrors[name]) setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    if (error) setError("");
  };

  const handleRichTextChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const trimmedEn = formData.en_answer.trim();
    const trimmedOd = formData.od_answer.trim();

    if (!formData.category_id) errors.category_id = "Please select a category";
    if (!formData.question_id) errors.question_id = "Please select a question";
    if (!trimmedEn) errors.en_answer = "English answer is required";
    else if (trimmedEn.length < 3)
      errors.en_answer = "English answer must be at least 3 characters";
    if (!trimmedOd) errors.od_answer = "Odia answer is required";
    else if (trimmedOd.length < 3)
      errors.od_answer = "Odia answer must be at least 3 characters";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkForDuplicates = async () => {
    try {
      const response = await chatbotAnswerAPI.getAll(1, 1000, "");
      const answers = response.data.answers || [];
      const duplicateAnswer = answers.find(
        (answer) =>
          answer.question_id === parseInt(formData.question_id) &&
          (!isEditMode || answer.id !== parseInt(id))
      );
      return !!duplicateAnswer;
    } catch (error) {
      console.error("Error checking for duplicates:", error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const hasDuplicate = await checkForDuplicates();
    if (hasDuplicate) {
      setModal({
        open: true,
        variant: "warning",
        message: "An answer already exists for this question!",
      });
      setLoading(false);
      return;
    }

    const submitData = {
      category_id: formData.category_id,
      question_id: formData.question_id,
      en_answer: formData.en_answer.trim(),
      od_answer: formData.od_answer.trim(),
      status: formData.status,
    };

    try {
      if (isEditMode) {
        await chatbotAnswerAPI.update(id, submitData);
        setModal({
          open: true,
          variant: "success",
          message: "Answer updated successfully!",
        });
      } else {
        await chatbotAnswerAPI.create(submitData);
        setModal({
          open: true,
          variant: "success",
          message: "Answer created successfully!",
        });
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
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
    navigate("/admin/manage-chatbot/chatbot-answer");
  };

  const handleModalClose = () => {
    const isSuccess = modal.variant === "success";
    setModal({ ...modal, open: false });
    if (isSuccess) {
      handleCancel();
    }
  };

  return (
    <div className="min-h-[80vh]">
      <div className="p-6 bg-white shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Edit Chatbot Answer" : "Add Chatbot Answer"}
          </h2>
          <button
            onClick={handleCancel}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 py-2 rounded-md font-medium flex items-center gap-2 transition"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && isEditMode ? (
          <p>Loading answer data...</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="category_id"
                  className="block text-sm font-medium mb-1"
                >
                  Select Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2.5 bg-white ${
                    fieldErrors.category_id
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={loading}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.en_title}
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
                <label
                  htmlFor="question_id"
                  className="block text-sm font-medium mb-1"
                >
                  Select Question <span className="text-red-500">*</span>
                </label>
                <select
                  id="question_id"
                  name="question_id"
                  value={formData.question_id}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2.5 bg-white ${
                    fieldErrors.question_id
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={
                    loading || !formData.category_id || questions.length === 0
                  }
                >
                  <option value="">-- Select Question --</option>
                  {questions.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.en_question}
                    </option>
                  ))}
                </select>
                {fieldErrors.question_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.question_id}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Answer (English) <span className="text-red-500">*</span>
                </label>
                <div
                  className={`border rounded ${
                    fieldErrors.en_answer ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <RichTextEditor
                    value={formData.en_answer}
                    onChange={(data) => handleRichTextChange("en_answer", data)}
                    disabled={loading}
                  />
                </div>
                {fieldErrors.en_answer && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.en_answer}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Answer (Odia) <span className="text-red-500">*</span>
                </label>
                <div
                  className={`border rounded ${
                    fieldErrors.od_answer ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <RichTextEditor
                    value={formData.od_answer}
                    onChange={(data) => handleRichTextChange("od_answer", data)}
                    disabled={loading}
                  />
                </div>
                {fieldErrors.od_answer && (
                  <p className="text-red-500 text-sm mt-1">
                    {fieldErrors.od_answer}
                  </p>
                )}
              </div>
            </div>
            <FormActions
              isSubmitting={loading}
              isEditMode={isEditMode}
              onCancel={handleCancel}
              onReset={handleReset}
              submitLabel={isEditMode ? "Update Answer" : "Create Answer"}
            />
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

export default AddChatbotAnswer;