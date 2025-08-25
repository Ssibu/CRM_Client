import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// --- 1. Import all your reusable components ---
// NOTE: Please verify that these paths are correct for your project structure.
import Header from "../../Components/Add/Header";
import FormActions from "../../Components/Add/FormActions";
import FormField from "../../Components/TextEditor/FormField";
import DocumentUploader from "../../Components/TextEditor/DocumentUploader";

// API Endpoint for News & Events
const API_URL = "http://localhost:8080/api/news-and-events";

// --- 2. Main Page Component ---
const AddNewsAndEventForm = () => {
  const [formData, setFormData] = useState({
    titleEnglish: "",
    titleOdia: "",
    eventDate: "",
    document: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (file) => {
    setFormData((prev) => ({ ...prev, document: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titleEnglish.trim() || !formData.titleOdia.trim() || !formData.eventDate) {
        alert("Please fill in all title and date fields.");
        return;
    }
    if (!formData.document) {
      alert("Please upload a document or image file.");
      return;
    }

    setIsSubmitting(true);
    const submissionData = new FormData();
    submissionData.append("titleEnglish", formData.titleEnglish);
    submissionData.append("titleOdia", formData.titleOdia);
    submissionData.append("eventDate", formData.eventDate);
    submissionData.append("document", formData.document);

    try {
      await axios.post(API_URL, submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert("News & Event created successfully!");
      navigate("/admin/workflow/news-and-events");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create News & Event.";
      alert(errorMessage);
      console.error("Error creating News & Event:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      titleEnglish: "",
      titleOdia: "",
      eventDate: "",
      document: null,
    });
    // You may need a way to clear the file input visually, which can be done inside DocumentUploader
  };

  const handleGoBack = () => {
    navigate("/admin/workflow/news-and-events");
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50 p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Header title={"Add News & Event"} onGoBack={handleGoBack} />

      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField 
                label="ଇଭେଣ୍ଟ୍‌ ଶିର୍ଷକ (ଇଂରାଜୀରେ) / Event Title (In English)" 
                placeholder="Enter title..." 
                value={formData.titleEnglish} 
                onChange={(val) => handleInputChange("titleEnglish", val)} 
                required
            />
            <FormField 
                label="ଇଭେଣ୍ଟ୍‌ ଶିର୍ଷକ (ଓଡ଼ିଆରେ) / Event Title (In Odia)" 
                placeholder="Enter title..." 
                value={formData.titleOdia} 
                onChange={(val) => handleInputChange("titleOdia", val)} 
                required
            />
            <FormField 
                label="ଇଭେଣ୍ଟ୍‌ ତାରିଖ / Event Date" 
                type="date" 
                value={formData.eventDate} 
                onChange={(val) => handleInputChange("eventDate", val)} 
                required
            />
            <DocumentUploader 
                file={formData.document} 
                onFileChange={handleFileChange} 
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

export default AddNewsAndEventForm;