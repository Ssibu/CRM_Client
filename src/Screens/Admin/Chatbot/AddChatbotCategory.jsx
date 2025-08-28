import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { chatbotCategoryAPI } from "../../../services/api"; // Make sure this path is correct

const AddChatbotCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // <-- Get the ID from the URL params
  const isEditMode = Boolean(id); // <-- Check if we are in "edit mode"

  const [formData, setFormData] = useState({
    en: "",
    od: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If in edit mode, fetch the category data when the component loads
  useEffect(() => {
    if (isEditMode) {
      setLoading(true);
      chatbotCategoryAPI.get(id)
        .then(response => {
          const { en, od } = response.data.category;
          setFormData({ en, od });
        })
        .catch(err => {
          console.error("Failed to fetch category:", err);
          setError("Could not load category data. Please try again.");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, isEditMode]); // <-- Dependency array ensures this runs when 'id' changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      if (isEditMode) {
        // <-- UPDATE existing category if in edit mode
        await chatbotCategoryAPI.update(id, formData);
        alert("Category updated successfully!");
      } else {
        // <-- CREATE new category if not in edit mode
        await chatbotCategoryAPI.create(formData);
        alert("Category created successfully!");
      }
      navigate("/admin/manage-chatbot/chatbot-category");
    } catch (err) {
      console.error("Error submitting form:", err);
      setError(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({ en: "", od: "" });
    setError("");
  };

  return (
    <div className="min-h-[80vh] py-6 font-sans">
      <div className="p-6 bg-white shadow rounded-xl">
        {/* Header with Go Back */}
        <div className="flex justify-between items-center mb-6">
          {/* Dynamically change the title */}
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Edit Chatbot Category" : "Add Chatbot Category"}
          </h2>
          <button
            onClick={() => navigate("/admin/manage-chatbot/chatbot-category")}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded"
          >
            ← Go Back
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {/* Show loading state while fetching data in edit mode */}
        {loading && isEditMode ? (
            <p>Loading category data...</p>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form fields are the same */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category (in English)*
                  </label>
                  <input
                    type="text"
                    name="en"
                    value={formData.en}
                    onChange={handleChange}
                    placeholder="Category (in English)"
                    className="w-full border rounded px-3 py-2"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category (in Odia)*
                  </label>
                  <input
                    type="text"
                    name="od"
                    value={formData.od}
                    onChange={handleChange}
                    placeholder="Category (in Odia)"
                    className="w-full border rounded px-3 py-2"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
                  disabled={loading}
                >
                  {/* Dynamically change button text */}
                  {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update' : 'Submit')}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/admin/manage-chatbot/chatbot-category")}
                  className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
                  disabled={loading}
                >
                  Cancel
                </button>
                {/* Hide Reset button in edit mode to avoid confusion */}
                {!isEditMode && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2 bg-gray-400 text-white rounded disabled:opacity-50"
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

export default AddChatbotCategory;