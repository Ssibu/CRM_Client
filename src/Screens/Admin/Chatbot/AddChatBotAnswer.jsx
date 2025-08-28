import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatbotCategoryAPI } from "../../../services/api";
import chatbotAnswerAPI from "../../../services/chatbotAnswerAPI";
import chatbotQuestionAPI from "../../../services/chatbotQuestionAPI";

const AddChatbotAnswer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    category_id: "",
    question_id: "",
    en: "",
    od: "",
    status: "Active"
  });
  const [categories, setCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Fetch all categories for the dropdown (runs once)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await chatbotCategoryAPI.getAll(1, 1000, "");
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  // 2. Fetch questions whenever the selected category changes
  useEffect(() => {
    const fetchQuestions = async () => {
      if (formData.category_id) {
        setLoading(true);
        try {
          const response = await chatbotQuestionAPI.getByCategory(formData.category_id);
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

  // 3. If in edit mode, fetch the specific answer data
  useEffect(() => {
    if (isEditMode) {
      const fetchAnswerData = async () => {
        setLoading(true);
        try {
          const response = await chatbotAnswerAPI.get(id);
          const answer = response.data.answer;
          
          setFormData({ 
            category_id: answer.category_id || "",
            question_id: answer.question_id || "", 
            en: answer.en || "", 
            od: answer.od || "",
            status: answer.status || "Active"
          });
        } catch (err) {
          console.error("Error fetching answer:", err);
          setError("Failed to load answer data: " + (err.response?.data?.message || err.message));
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
      ...(name === "category_id" && { question_id: "" })
    }));
    if (error) setError("");
  };

  const handleReset = () => {
    setFormData({
      category_id: "",
      question_id: "",
      en: "",
      od: "",
      status: "Active"
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.category_id || !formData.question_id || !formData.en || !formData.od) {
        throw new Error("All fields are required");
      }

      if (isEditMode) {
        await chatbotAnswerAPI.update(id, formData);
        alert("Answer updated successfully!");
      } else {
        await chatbotAnswerAPI.create(formData);
        alert("Answer created successfully!");
      }
      navigate("/admin/manage-chatbot/chatbot-answer");

    } catch (error) {
      console.error("Error submitting answer:", error);
      setError(error.response?.data?.message || error.message || "Failed to submit answer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] py-6 font-sans">
      <div className="p-6 bg-white shadow rounded-xl max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Edit Chatbot Answer" : "Add Chatbot Answer"}
          </h2>
          <button
            onClick={() => navigate("/admin/manage-chatbot/chatbot-answer")}
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
          >
            ← Go Back
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        {loading && isEditMode ? (
          <div className="text-center py-8">Loading answer data...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Select Category*</label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  required
                  disabled={loading}
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.en}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Select Question*</label>
                <select
                  name="question_id"
                  value={formData.question_id}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 bg-white"
                  required
                  disabled={loading || !formData.category_id || questions.length === 0}
                >
                  <option value="">-- Select Question --</option>
                  {questions.map((q) => (
                    <option key={q.id} value={q.id}>{q.en}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Answer (English)*</label>
                <textarea
                  name="en"
                  value={formData.en}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 h-40"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Answer (Odia)*</label>
                <textarea
                  name="od"
                  value={formData.od}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 h-40 font-odia"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (isEditMode ? "Updating..." : "Submitting...") : (isEditMode ? "Update Answer" : "Submit Answer")}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/manage-chatbot/chatbot-answer")}
                className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                disabled={loading}
              >
                Cancel
              </button>
              {!isEditMode && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                  disabled={loading}
                >
                  Reset
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddChatbotAnswer;