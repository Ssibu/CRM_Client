import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// --- Import your reusable components ---
// Note: Adjust the paths if your file structure is different.
import Header from "../../Components/Add/Header";
import FormActions from "../../Components/Add/FormActions";
import FormField from "../../Components/TextEditor/FormField";
import DescriptionFields from "../../Components/Add/DescriptionFields";

// API Endpoint for Act & Rules
const API_URL = "http://localhost:8080/api/act-and-rules"; // Adjust port if needed

// --- Composite Component for Title Fields ---
const FormFieldsGroup = ({ formData, onInputChange }) => (
  <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
    <FormField
      label="Title (In English)"
      placeholder="Enter title in English..."
      value={formData.titleEnglish}
      onChange={(val) => onInputChange("titleEnglish", val)}
      required
    />
    <FormField
      label="Title (In Odia)"
      placeholder="Enter title in Odia..."
      value={formData.titleOdia}
      onChange={(val) => onInputChange("titleOdia", val)}
      required
    />
  </div>
);

// --- Main Page Component ---
const AddActAndRuleForm = () => {
  const [formData, setFormData] = useState({
    titleEnglish: "",
    titleOdia: "",
    descriptionEnglish: "",
    descriptionOdia: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const requiredFields = [
      ["Title (English)", formData.titleEnglish],
      ["Title (Odia)", formData.titleOdia],
      ["Description (English)", formData.descriptionEnglish],
      ["Description (Odia)", formData.descriptionOdia],
    ];

    for (const [name, value] of requiredFields) {
      if (!value.trim() || value === "<p><br></p>") {
        alert(`${name} is required.`);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      await axios.post(API_URL, formData);
      alert("Act & Rule created successfully!");
      navigate("/admin/workflow/act-and-rules"); // Navigate back to the list
    } catch (error) {
      console.error("Error creating Act & Rule:", error);
      alert("Failed to create Act & Rule. Please check the console.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      titleEnglish: "",
      titleOdia: "",
      descriptionEnglish: "",
      descriptionOdia: "",
    });
  };

  const handleGoBack = () => {
    navigate("/admin/workflow/act-and-rules");
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Header title={"Add Act & Rule"} onGoBack={handleGoBack} />

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <FormFieldsGroup
            formData={formData}                  
            onInputChange={handleInputChange}
          />

          <DescriptionFields 
            formData={formData} 
            onInputChange={handleInputChange} 
          />
        </div>

        <FormActions
          onSubmit={handleSubmit}
          onReset={handleReset}
          onCancel={handleGoBack}
          isSubmitting={isSubmitting}
        />
      </form>
    </motion.div>
  );
};

export default AddActAndRuleForm;
