import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // <-- Import useParams
import { chatbotCategoryAPI } from "../../../services/api";
import chatbotQuestionAPI from "../../../services/chatbotQuestionAPI";

const AddChatBotQuestion = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // <-- Get the ID from the URL
  const isEditMode = Boolean(id); // <-- Check if we are in edit mode

  const [formData, setFormData] = useState({
    category_id: "",
    en: "",
    od: ""
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pageTitle, setPageTitle] = useState("Add Chatbot Question");

  // Fetch categories for the dropdown (runs once)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch all categories without pagination for the dropdown
        const response = await chatbotCategoryAPI.getAll(1, 1000, ''); 
        setCategories(response.data.categories || []);
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
      setPageTitle("Edit Chatbot Question");
      setLoading(true);
      chatbotQuestionAPI.get(id)
        .then(response => {
          const { category_id, en, od } = response.data.question;
          setFormData({ category_id, en, od });
        })
        .catch(err => {
          console.error("Failed to fetch question:", err);
          setError("Could not load the question data. Please go back and try again.");
        })
        .finally(() => setLoading(false));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id || !formData.en || !formData.od) {
      setError("All fields are required.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      if (isEditMode) {
        // UPDATE if in edit mode
        await chatbotQuestionAPI.update(id, formData);
        alert("Question updated successfully!");
      } else {
        // CREATE if in add mode
        await chatbotQuestionAPI.create(formData);
        alert("Question created successfully!");
      }
      navigate("/admin/manage-chatbot/chatbot-question");
    } catch (error) {
      console.error("Error submitting question:", error);
      setError(error.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setFormData({ category_id: "", en: "", od: "" });
    setError("");
  };


  return (
    <div className="min-h-[80vh] py-4 font-sans">
      <div className="p-6 bg-white shadow rounded-xl max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{pageTitle}</h2>
          <button
            onClick={() => navigate("/admin/manage-chatbot/chatbot-question")}
            className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
          >
            ← Go Back
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {loading && isEditMode ? (
          <p>Loading question data...</p>
        ) : (
          <form onSubmit={handleSubmit} onReset={handleReset} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Category*
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 bg-white"
                required
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.length > 0 && categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Question (English)*
              </label>
              <input
                type="text"
                name="en"
                value={formData.en}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter question in English"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Question (Odia)*
              </label>
              <input
                type="text"
                name="od"
                value={formData.od}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter question in Odia"
                required
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2 flex space-x-3 pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Question' : 'Submit Question')}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin/manage-chatbot/chatbot-question")}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                disabled={loading}
              >
                Cancel
              </button>
              {!isEditMode && (
                <button
                  type="reset"
                  className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
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

export default AddChatBotQuestion;