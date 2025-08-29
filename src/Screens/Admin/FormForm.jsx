import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useModal } from "../../context/ModalProvider";

// Import your reusable components
import Header from "../../Components/Add/Header";
import FormActions from "../../Components/Add/FormActions";
import FormField from "../../Components/TextEditor/FormField";
import DocumentUploader from "../../Components/TextEditor/DocumentUploader";

const API_URL = `${process.env.REACT_APP_API_URL}/api/forms`;

const initialState = {
  en_title: "",
  od_title: "",
  document: null,
};

const FormForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({}); // State to hold validation errors
  const [existingDocument, setExistingDocument] = useState(''); 
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`);
          const { en_title, od_title, document } = response.data;
          setFormData({ en_title, od_title, document: null });
          setExistingDocument(document);
        } catch (error) {
          showModal("error", "Failed to load form data for editing.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id, isEditMode, showModal]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, document: file }));
    if (errors.document) {
      setErrors((prev) => ({ ...prev, document: null }));
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.en_title.trim()) {
      newErrors.en_title = "English Title is required.";
    }
    if (!formData.od_title.trim()) {
      newErrors.od_title = "Odia Title is required.";
    }
    if (!isEditMode && !formData.document) {
      newErrors.document = "A document file is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    const submissionData = new FormData();
    submissionData.append("en_title", formData.en_title);
    submissionData.append("od_title", formData.od_title);

    if (formData.document) {
      submissionData.append("document", formData.document);
      if (isEditMode) {
        submissionData.append("oldFilePath", existingDocument);
      }
    }

    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, submissionData);
        showModal("success", "Form updated successfully!");
      } else {
        await axios.post(API_URL, submissionData);
        showModal("success", "Form created successfully!");
      }
      navigate("/admin/notifications/forms");
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} form.`;
      showModal("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialState);
    setErrors({});
  };

  const handleGoBack = () => {
    navigate("/admin/notifications/forms");
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <Header title={isEditMode ? "Edit Form" : "Add Form"} onGoBack={handleGoBack} />

      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField 
              label="Title (In English)" 
              value={formData.en_title} 
              onChange={(val) => handleInputChange("en_title", val)} 
              required
              error={errors.en_title}
            />
            <FormField 
              label="Title (In Odia)" 
              value={formData.od_title} 
              onChange={(val) => handleInputChange("od_title", val)} 
              required
              error={errors.od_title}
            />
            <div>
                <DocumentUploader 
                  file={formData.document} 
                  onFileChange={handleFileChange} 
                  error={errors.document}
                />
                {isEditMode && !formData.document && existingDocument && (
                    <div className="mt-2 text-sm text-gray-600">
                        Current file: <a href={`${process.env.REACT_APP_API_URL}${existingDocument}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{existingDocument.split('/').pop()}</a>
                    </div>
                )}
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

export default FormForm;