import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

// Import your reusable components
import Header from "../../Components/Add/Header";
import FormActions from "../../Components/Add/FormActions";
import FormField from "../../Components/TextEditor/FormField";
import DocumentUploader from "../../Components/TextEditor/DocumentUploader";

const API_URL = "http://localhost:8080/api/news-and-events";

// Define the initial empty state for the form
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

  const [formData, setFormData] = useState(initialState);
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
          console.error("Error fetching event data:", error);
          alert("Failed to load event data for editing.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id, isEditMode]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, document: file }));
    if(file) {
        setExistingDocument('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditMode && !formData.document) {
      alert("Please upload a document or image file.");
      return;
    }

    setIsSubmitting(true);
    const submissionData = new FormData();
    submissionData.append("titleEnglish", formData.titleEnglish);
    submissionData.append("titleOdia", formData.titleOdia);
    submissionData.append("eventDate", formData.eventDate);

    if (formData.document) { // Only append file if a new one is selected
      submissionData.append("document", formData.document);
    }

    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, submissionData);
        alert("News & Event updated successfully!");
      } else {
        await axios.post(API_URL, submissionData);
        alert("News & Event created successfully!");
      }
      navigate("/admin/workflow/news-and-events");
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} News & Event.`;
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialState);
    // You might need to add a way to clear the file input's visual state
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
            <FormField label="Event Title (In English)" value={formData.titleEnglish} onChange={(val) => handleInputChange("titleEnglish", val)} required/>
            <FormField label="Event Title (In Odia)" value={formData.titleOdia} onChange={(val) => handleInputChange("titleOdia", val)} required/>
            <FormField label="Event Date" type="date" value={formData.eventDate} onChange={(val) => handleInputChange("eventDate", val)} required/>
            <div>
                <DocumentUploader file={formData.document} onFileChange={handleFileChange} />
                {isEditMode && !formData.document && existingDocument && (
                    <div className="mt-2 text-sm text-gray-600">
                        Current file: <a href={`http://localhost:8080/uploads/${existingDocument}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{existingDocument}</a>
                    </div>
                )}
            </div>
        </div>

        <FormActions
          onSubmit={handleSubmit}
          onCancel={handleGoBack}
          isSubmitting={isSubmitting}
          onReset={!isEditMode ? handleReset : null} // Pass null to onReset in edit mode
        />
      </form>
    </motion.div>
  );
};

export default NewsAndEventForm;