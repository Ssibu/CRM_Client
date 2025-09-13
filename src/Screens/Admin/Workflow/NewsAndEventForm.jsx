import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useModal } from "../../../context/ModalProvider";

// Import your reusable components
import Header from "../../../Components/Admin/Add/Header";
import FormActions from "../../../Components/Admin/Add/FormActions";
import FormField from "../../../Components/Admin/TextEditor/FormField";
import DocumentUploader from "../../../Components/Admin/TextEditor/DocumentUploader";

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/news-and-events`;

const initialState = {
  en_title: "",
  od_title: "",
  eventDate: "",
  document: null,
};

const NewsAndEventForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [existingDocumentName, setExistingDocumentName] = useState("");
  const [isFileMarkedForDeletion, setIsFileMarkedForDeletion] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalData, setOriginalData] = useState(initialState);
  const [originalDocumentName, setOriginalDocumentName] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${API_URL}/${id}`, {
            withCredentials: true,
          });
          const { en_title, od_title, eventDate, document } = response.data;
          const editableData = {
            en_title,
            od_title,
            eventDate,
            document: null,
          };
          setFormData(editableData);
          setOriginalData(editableData);
          setExistingDocumentName(document);
          setOriginalDocumentName(document); // <-- Store only the filename
        } catch (error) {
          showModal(
            "error",
            error.response?.data?.message ||
              "Failed to load event data for editing."
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [id, isEditMode, showModal]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  // Updated handler for the new DocumentUploader
  const handleFileChange = (file, error) => {
    if (error) {
      setErrors((prev) => ({ ...prev, document: error }));
      setFormData((prev) => ({ ...prev, document: null }));
    } else {
      setFormData((prev) => ({ ...prev, document: file }));
      if (errors.document) setErrors((prev) => ({ ...prev, document: null }));
      setIsFileMarkedForDeletion(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.en_title.trim())
      newErrors.en_title = "English Title is required.";
    if (!formData.od_title.trim())
      newErrors.od_title = "Odia Title is required.";
    if (!formData.eventDate) newErrors.eventDate = "Event Date is required.";
    if (!isEditMode && !formData.document)
      newErrors.document = "A document or image file is required.";
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
    submissionData.append("eventDate", formData.eventDate);

    if (formData.document) {
      submissionData.append("document", formData.document);
    }

    // --- THIS IS THE KEY CHANGE ---
    if (isEditMode) {
      submissionData.append("removeExistingDocument", isFileMarkedForDeletion);
    }

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      };
      if (isEditMode) {
        await axios.put(`${API_URL}/${id}`, submissionData, config);
        showModal("success", "News & Event updated successfully!");
      } else {
        await axios.post(API_URL, submissionData, config);
        showModal("success", "News & Event created successfully!");
      }
      navigate("/admin/workflow/news-and-events");
    } catch (error) {
      const responseData = error.response?.data;
      let errorMessage = "";

      if (responseData?.errors) {
        // Combine all field error messages into one string
        errorMessage = Object.values(responseData.errors).join("\n");
      } else {
        // Fallback to top-level message
        errorMessage =
          responseData?.message ||
          `Failed to ${isEditMode ? "update" : "create"} event.`;
      }

      showModal("error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleRemoveFile = () => {
    if (
      window.confirm(
        "The current document will be removed when you click 'Submit'. Are you sure?"
      )
    ) {
      setExistingDocumentName("");
      setIsFileMarkedForDeletion(true);
    }
  };

  const handleReset = () => {
    if (isEditMode) {
      // In EDIT mode, we reset the form back to the original data we saved.
      setFormData(originalData);
      setExistingDocumentName(originalDocumentName);
    } else {
      // In ADD mode, we reset the form to the blank initial state.
      setFormData(initialState);
    }

    // These should be reset in both modes
    setErrors({});
    setIsFileMarkedForDeletion(false);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">Loading...</div>
    );

  return (
    <div className="h-[80vh]">
      <div className="bg-white p-6 shadow">
        <Header
          title={isEditMode ? "Edit News & Event" : "Add News & Event"}
          onGoBack={() => navigate("/admin/workflow/news-and-events")}
        />
        <form onSubmit={handleSubmit}>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <FormField
              label="Event Title (In English)"
              placeholder="English title here"
              maxLength={100}
              value={formData.en_title}
              onChange={(val) => handleInputChange("en_title", val)}
              required
              error={errors.en_title}
            />
            <FormField
                maxLength={100}
              label="Event Title (In Odia)"
              placeholder="Odia title here"
              value={formData.od_title}
              onChange={(val) => handleInputChange("od_title", val)}
              required
              error={errors.od_title}
            />
            <FormField
              label="Event Date"
              type="date"
              value={formData.eventDate}
              onChange={(val) => handleInputChange("eventDate", val)}
              required
              error={errors.eventDate}
            />

            <DocumentUploader
              label="Upload Document"
              file={formData.document}
              onFileChange={handleFileChange}
              error={errors.document}
              allowedTypes={[
                "application/pdf",'image/jpeg', 'image/png', 'image/webp'
              ]}
              maxSizeMB={1}
              existingFileName={existingDocumentName}
              existingFileUrl={`${
                import.meta.env.VITE_API_BASE_URL
              }/uploads/events/${existingDocumentName}`}
              onRemove={isEditMode ? handleRemoveFile : null}
            />
          </div>
          <FormActions
            onSubmit={handleSubmit}
            onCancel={() => navigate("/admin/workflow/news-and-events")}
            isSubmitting={isSubmitting}
            onReset={handleReset}
          />
        </form>
      </div>
    </div>
  );
};

export default NewsAndEventForm;
