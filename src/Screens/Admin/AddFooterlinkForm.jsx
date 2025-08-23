import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import axios from "axios"; // <-- Import axios
import { useNavigate } from "react-router-dom";

//==============================================================================
// 1. ATOMIC & REUSABLE FORM COMPONENTS
//==============================================================================
const API_URL = "http://localhost:8080/api/footerlinks";
const Header = ({ title, onGoBack }) => (
  <div className="mb-6 flex items-center justify-between">
    <h1 className="text-xl font-semibold text-black">{title}</h1>
    <button
      onClick={onGoBack}
      className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 py-2 rounded-md font-medium flex items-center gap-2 transition"
    >
      <ArrowLeft size={16} />
      Go Back
    </button>
  </div>
);

const FormField = ({ label, placeholder, value, onChange, required = false, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && "*"}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const FormActions = ({ onSubmit, onReset, onCancel, isSubmitting }) => (
  <div className="flex items-center gap-4 mt-8">
    <button
      type="submit"
      disabled={isSubmitting}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-all disabled:opacity-50"
      onClick={onSubmit}
    >
      Submit
    </button>
    <button
      type="button"
      onClick={onReset}
      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-all"
    >
      Reset
    </button>
    <button
      type="button"
      onClick={onCancel}
      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-all"
    >
      Cancel
    </button>
  </div>
);


//==============================================================================
// 2. COMPOSITE FORM GROUP
//==============================================================================

const FormFieldsGroup = ({ formData, onInputChange }) => (
  <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
    <FormField
        label="ଲିଙ୍କ୍ ଟେକ୍ସଟ୍ (ଇଂରାଜୀରେ) / Link Text (In English)"
        placeholder="e.g., Privacy Policy"
        value={formData.englishLinkText}
        onChange={(val) => onInputChange("englishLinkText", val)}
        required
    />
    <FormField
        label="ଲିଙ୍କ୍ ଟେକ୍ସଟ୍ (ଓଡ଼ିଆରେ) / Link Text (In Odia)"
        placeholder="e.g., ଗୋପନୀୟତା ନୀତି"
        value={formData.odiaLinkText}
        onChange={(val) => onInputChange("odiaLinkText", val)}
        required
    />
    <FormField
        label="URL"
        placeholder="e.g., /privacy-policy or https://example.com"
        value={formData.url}
        onChange={(val) => onInputChange("url", val)}
        required
    />
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        ଲିଙ୍କ୍ ପ୍ରକାର / Link Type *
      </label>
      <select
        value={formData.linkType}
        onChange={(e) => onInputChange("linkType", e.target.value)}
        className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <option value="Internal">Internal</option>
        <option value="External">External</option>
      </select>
    </div>
  </div>
);


//==============================================================================
// 3. MAIN PAGE COMPONENT
//==============================================================================

const AddFooterlinkForm = () => {
  const [formData, setFormData] = useState({
    englishLinkText: "",
    odiaLinkText: "",
    url: "",
    linkType: "Internal", // Default value
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simple validation
    if (!formData.englishLinkText.trim() || !formData.odiaLinkText.trim() || !formData.url.trim()) {
      alert("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Send data to the backend
      await axios.post(API_URL, formData);
      alert("Footer Link created successfully!");
      // Navigate back to the list page after successful submission
      navigate("/admin/workflow/footerlink");
    } catch (error) {
      console.error("Error creating footer link:", error);
      alert("Failed to create footer link. Please check the console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      englishLinkText: "",
      odiaLinkText: "",
      url: "",
      linkType: "Internal",
    });
  };

  const handleGoBack = () => {
    navigate("/admin/workflow/footerlink"); // Use navigate for consistency
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Header title={"Add Footer Link"} onGoBack={handleGoBack} />

      <form onSubmit={handleSubmit}>
        <FormFieldsGroup
          formData={formData}
          onInputChange={handleInputChange}
        />

        <FormActions
          onSubmit={handleSubmit}
          onReset={handleReset}
          onCancel={handleGoBack}
          isSubmitting={false}
        />
      </form>
    </motion.div>
  );
};

export default AddFooterlinkForm;