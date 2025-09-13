
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "../../../Components/Admin/Add/Header";
import DocumentUploader from '../../../Components/Admin/TextEditor/DocumentUploader';
import { useModal } from "../../../context/ModalProvider";
import FormActions from "@/Components/Admin/Add/FormActions";

const HomePageBannerForm = () => {
  const [formData, setFormData] = useState({
    image: null,
    existingImageName: "",
    existingImageUrl: "",
  });

  const [initialData, setInitialData] = useState(null); 
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [existingImageRemoved, setExistingImageRemoved] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const { showModal } = useModal();

  const handleCancel = () => {
    navigate("/admin/image-setup/homepage-banner");
  };

  useEffect(() => {
    if (isEditMode) {
      const fetchBanner = async () => {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/image-setup/homepage/banner/${id}`,
            { withCredentials: true }
          );
          const banner = res.data.banner;

          const fetchedData = {
            image: null,
            existingImageName: banner.banner || "",
            existingImageUrl: banner.image_url || "",
          };

          setFormData(fetchedData);
          setInitialData(fetchedData); // Save for reset
          setErrors({});
          setExistingImageRemoved(false);
        } catch (error) {
          console.error("Failed to fetch banner:", error);
          showModal("error", "Failed to fetch banner data.");
        }
      };
      fetchBanner();
    } else {
      // For create mode, clear initialData
      setInitialData(null);
    }
  }, [id, isEditMode, showModal]);

  const validate = () => {
    const newErrors = {};
    if (!formData.image && !formData.existingImageUrl && !isEditMode) {
      newErrors.image = "Banner image is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (selectedFile, validationError) => {
    if (validationError) {
      setFormData(prev => ({ ...prev, image: null }));
      setErrors({ image: validationError });
    } else {
      setFormData(prev => ({
        ...prev,
        image: selectedFile,
        existingImageName: "",
        existingImageUrl: "",
      }));
      setErrors({});
      setExistingImageRemoved(false); // Since new file selected, existing image removal irrelevant
    }
  };

  const handleRemoveExisting = () => {
    setFormData(prev => ({
      ...prev,
      existingImageName: "",
      existingImageUrl: "",
    }));
    setErrors({});
    setExistingImageRemoved(true); // Mark existing image as removed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    const data = new FormData();

    if (formData.image) {
      // New image uploaded
      data.append("banner", formData.image);
    } else if (isEditMode && existingImageRemoved) {
      // In edit mode and existing image removed without new upload
      data.append("banner", "");
    }
    // If in edit mode and existing image is still there, no need to send banner field (backend keeps old)

    try {
      if (isEditMode) {
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/image-setup/update/homepage/banner/${id}`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showModal("success", "Homepage banner updated successfully.");
      } else {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/image-setup/upload/homepage/banner`,
          data,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        showModal("success", "Homepage banner added successfully.");
      }

      navigate("/admin/image-setup/homepage-banner");
    } catch (error) {
      console.error("Error submitting banner:", error.response?.data || error.message);
      setErrors({ image: "Failed to submit the form. Please try again." });
      showModal("error", error.response?.data?.message || "Failed to submit the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (isEditMode && initialData) {
      // Reset to fetched data
      setFormData(initialData);
      setExistingImageRemoved(false);
    } else {
      // Clear all fields in create mode
      setFormData({
        image: null,
        existingImageName: "",
        existingImageUrl: "",
      });
      setExistingImageRemoved(false);
    }
    setErrors({});
  };

  return (
    <div className="min-h-[80vh]">
      <div className="bg-white p-6 shadow">
        <Header
          title={isEditMode ? "Edit Homepage Banner" : "Add Homepage Banner"}
          onGoBack={handleCancel}
        />

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <DocumentUploader
              label="Upload Banner Image"
              file={formData.image}
              existingFileName={formData.existingImageName}
              existingFileUrl={formData.existingImageUrl}
              onFileChange={handleFileChange}
              onRemove={handleRemoveExisting}
              allowedTypes={['image/jpeg', 'image/png', 'image/webp']}
              maxSizeMB={10}
              error={errors.image}
            />
          </div>

          <FormActions
          isEditMode={isEditMode}
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
            onReset={handleReset}
          />
        </form>
      </div>
    </div>
  );
};

export default HomePageBannerForm;
