import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Import your reusable components
import Header from "../../Components/Add/Header";
import FormActions from "../../Components/Add/FormActions";
import FormField from "../../Components/TextEditor/FormField";

const API_URL = "http://localhost:7777/api/footerlinks";

// Define the initial empty state for the form
const initialState = {
  englishLinkText: "",
  odiaLinkText: "",
  url: "",
  linkType: "Internal",
};

const FooterlinkForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchLink = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`);
          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching link data:", error);
          alert("Failed to load link data for editing.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchLink();
    }
  }, [id, isEditMode]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, formData);
        alert("Footer Link updated successfully!");
      } else {
        await axios.post(API_URL, formData);
        alert("Footer Link created successfully!");
      }
      navigate("/admin/workflow/footerlink");
    } catch (error) {
      const action = isEditMode ? "updating" : "creating";
      alert(`Failed to ${action} Footer Link.`);
      console.error(`Error ${action} Footer Link:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialState);
  };

  const handleGoBack = () => {
    navigate("/admin/workflow/footerlink");
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <Header title={isEditMode ? "Edit Footer Link" : "Add Footer Link"} onGoBack={handleGoBack} />

      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <FormField label="Link Text (In English)" value={formData.englishLinkText} onChange={(val) => handleInputChange("englishLinkText", val)} required />
          <FormField label="Link Text (In Odia)" value={formData.odiaLinkText} onChange={(val) => handleInputChange("odiaLinkText", val)} required />
          <FormField label="URL" value={formData.url} onChange={(val) => handleInputChange("url", val)} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Link Type *</label>
            <select value={formData.linkType} onChange={(e) => handleInputChange("linkType", e.target.value)} className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option value="Internal">Internal</option>
              <option value="External">External</option>
            </select>
          </div>
        </div>

        <FormActions
          onSubmit={handleSubmit}
          onCancel={handleGoBack}
          isSubmitting={isSubmitting}
          onReset={!isEditMode ? handleReset : null}
        />
      </form>
    </motion.div>
  );
};

export default FooterlinkForm;