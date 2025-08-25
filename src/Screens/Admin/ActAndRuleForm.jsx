import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Import your reusable components
import Header from "../../Components/Add/Header";
import FormActions from "../../Components/Add/FormActions";
import FormField from "../../Components/TextEditor/FormField";
import DescriptionFields from "../../Components/Add/DescriptionFields";

const API_URL = "http://localhost:8080/api/act-and-rules";

// Composite Component for Title Fields
const FormFieldsGroup = ({ formData, onInputChange }) => (
  <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
    <FormField label="Title (In English)" value={formData.titleEnglish} onChange={(val) => onInputChange("titleEnglish", val)} required />
    <FormField label="Title (In Odia)" value={formData.titleOdia} onChange={(val) => onInputChange("titleOdia", val)} required />
  </div>
);

// Define the initial empty state for the form
const initialState = {
  titleEnglish: "",
  titleOdia: "",
  descriptionEnglish: "",
  descriptionOdia: "",
};

const ActAndRuleForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (isEditMode) {
      const fetchActAndRule = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`);
          setFormData(response.data);
        } catch (error) {
          console.error("Error fetching data for edit:", error);
          alert("Failed to load data for editing.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchActAndRule();
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
        alert("Act & Rule updated successfully!");
      } else {
        await axios.post(API_URL, formData);
        alert("Act & Rule created successfully!");
      }
      navigate("/admin/workflow/act-and-rules");
    } catch (error) {
      const action = isEditMode ? "updating" : "creating";
      console.error(`Error ${action} Act & Rule:`, error);
      alert(`Failed to ${action} Act & Rule.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleReset = () => {
    setFormData(initialState);
  };

  const handleGoBack = () => {
    navigate("/admin/workflow/act-and-rules");
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading form data...</div>;
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <Header title={isEditMode ? "Edit Act & Rule" : "Add Act & Rule"} onGoBack={handleGoBack} />

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <FormFieldsGroup formData={formData} onInputChange={handleInputChange} />
          <DescriptionFields formData={formData} onInputChange={handleInputChange} />
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

export default ActAndRuleForm;