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

const API_URL = `${process.env.REACT_APP_API_URL}/api/news-and-events`;

const initialState = {
  titleEnglish: "",
  titleOdia: "",
  eventDate: "",
  document: null,
};

const NewsAndEventForm = () => {
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
          const { titleEnglish, titleOdia, eventDate, document } = response.data;
          setFormData({ titleEnglish, titleOdia, eventDate, document: null });
          setExistingDocument(document);
        } catch (error) {
          showModal("error", "Failed to load event data for editing.");
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

  // Validation function to check all fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.titleEnglish.trim()) {
      newErrors.titleEnglish = "English Title is required.";
    }
    if (!formData.titleOdia.trim()) {
      newErrors.titleOdia = "Odia Title is required.";
    }
    if (!formData.eventDate) {
      newErrors.eventDate = "Event Date is required.";
    }
    // A document is only required when creating, not when editing
    if (!isEditMode && !formData.document) {
      newErrors.document = "A document or image file is required.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return; // Stop submission
    }

    setIsSubmitting(true);
    const submissionData = new FormData();
    submissionData.append("titleEnglish", formData.titleEnglish);
    submissionData.append("titleOdia", formData.titleOdia);
    submissionData.append("eventDate", formData.eventDate);

    if (formData.document) {
      submissionData.append("document", formData.document);
      if (isEditMode) {
        submissionData.append("oldFilePath", existingDocument);
      }
    }

    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, submissionData);
        showModal("success", "News & Event updated successfully!");
      } else {
        await axios.post(API_URL, submissionData);
        showModal("success", "News & Event created successfully!");
      }
      navigate("/admin/workflow/news-and-events");
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} event.`;
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
    navigate("/admin/workflow/news-and-events");
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
      <Header title={isEditMode ? "Edit News & Event" : "Add News & Event"} onGoBack={handleGoBack} />

      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField label="Event Title (In English)" value={formData.titleEnglish} onChange={(val) => handleInputChange("titleEnglish", val)} required error={errors.titleEnglish}/>
            <FormField label="Event Title (In Odia)" value={formData.titleOdia} onChange={(val) => handleInputChange("titleOdia", val)} required error={errors.titleOdia}/>
            <FormField label="Event Date" type="date" value={formData.eventDate} onChange={(val) => handleInputChange("eventDate", val)} required error={errors.eventDate}/>
            <div>
                <DocumentUploader file={formData.document} onFileChange={handleFileChange} error={errors.document} />
                {isEditMode && !formData.document && existingDocument && (
                    <div className="mt-2 text-sm text-gray-600">
                        Current file: <a href={`${process.env.REACT_APP_API_BASE_URL}${existingDocument}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{existingDocument.split('/').pop()}</a>
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

export default NewsAndEventForm;