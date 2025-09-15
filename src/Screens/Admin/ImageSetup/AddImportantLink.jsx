import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "@/Components/Admin/Add/Header";
import DocumentUploader from "@/Components/Admin/TextEditor/DocumentUploader";
import FormActions from "@/Components/Admin/Add/FormActions";
import { useModal } from "@/context/ModalProvider";
import FormField from "@/Components/Admin/TextEditor/FormField";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const INITIAL_FORM_STATE = {
  url: "",
  image: null,
};

const AddImportantLink = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { showModal } = useModal();

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [originalData, setOriginalData] = useState(INITIAL_FORM_STATE);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [existingImageName, setExistingImageName] = useState("");
  const [originalExistingImageUrl, setOriginalExistingImageUrl] = useState("");
  const [originalExistingImageName, setOriginalExistingImageName] =
    useState("");
  const [existingImageRemoved, setExistingImageRemoved] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/image-setup/importantlinks/${id}`,
          {
            withCredentials: true,
          }
        );
        const link = res.data.importantLink;

        const fetchedFormData = {
          url: link.url || "",
          image: null,
        };
        const fetchedImageUrl = link.image_url || "";
        const fetchedImageName = link.image ? link.image.split("/").pop() : "";

        setFormData(fetchedFormData);
        setExistingImageUrl(fetchedImageUrl);
        setExistingImageName(fetchedImageName);

        setOriginalData(fetchedFormData);
        setOriginalExistingImageUrl(fetchedImageUrl);
        setOriginalExistingImageName(fetchedImageName);
      } catch (err) {
        console.error("Error fetching link:", err);
        showModal("error", "Failed to load link data.");
        navigate("/admin/image-setup/important-links");
      }
    };
    fetchData();
  }, [id, isEdit, navigate, showModal]);

  const validate = () => {
    const errs = {};
    if (formData.url.trim() && !/^https?:\/\/.+/i.test(formData.url.trim())) {
      errs.url = "Enter a valid URL";
    }
    if (!isEdit && !formData.image) {
      errs.image = "Image is required";
    }
    if (isEdit && existingImageRemoved && !formData.image) {
      errs.image = "Image is required after removing the old one.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileChange = (file, validationError) => {
    if (validationError) {
      setFormData((prev) => ({ ...prev, image: null }));
      setErrors((prev) => ({ ...prev, image: validationError }));
    } else {
      setFormData((prev) => ({ ...prev, image: file }));
      setExistingImageUrl("");
      setExistingImageName("");
      setExistingImageRemoved(false);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleFileRemove = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setExistingImageUrl("");
    setExistingImageName("");
    setExistingImageRemoved(true);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleReset = () => {
    setFormData(originalData);
    setExistingImageUrl(originalExistingImageUrl);
    setExistingImageName(originalExistingImageName);
    setExistingImageRemoved(false);
    setErrors({});
  };

  const handleCancel = () => navigate("/admin/image-setup/important-links");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("url", formData.url);

      if (formData.image) {
        fd.append("image", formData.image);
      } else if (isEdit && existingImageRemoved) {
        fd.append("image", "");
      }

      const endpoint = isEdit
        ? `${API_BASE_URL}/image-setup/importantlinks/update/${id}`
        : `${API_BASE_URL}/image-setup/importantlinks/register`;

      const method = isEdit ? axios.put : axios.post;
      await method(endpoint, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      showModal(
        "success",
        isEdit ? "Link updated successfully!" : "Link created successfully!"
      );
      navigate("/admin/image-setup/important-links");
    } catch (err) {
      console.error("Error:", err);
      showModal(
        "error",
        err.response?.data?.message || err.message || "Something went wrong"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh]">
      <div className="bg-white p-6 shadow">
        <Header
          title={isEdit ? "Edit Important Link" : "Add Important Link"}
          onGoBack={handleCancel}
        />

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="flex items-start space-x-6 mb-6">
            <div className="flex-1 min-w-[250px]">
              <DocumentUploader
                required
                label="Upload Image"
                file={formData.image}
                existingFileUrl={
                  !existingImageRemoved ? existingImageUrl : null
                }
                existingFileName={
                  !existingImageRemoved ? existingImageName : ""
                }
                onFileChange={handleFileChange}
                onRemove={handleFileRemove}
                allowedTypes={[
                  "image/jpg",
                  "image/jpeg",
                  "image/png",
                  "image/webp",
                ]}
                maxSizeMB={3}
                error={errors.image}
              />
            </div>

            <div className="flex-1 min-w-[250px]">
              <FormField
                label="Image Link"
                type="url"
                name="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(value) => handleChange("url", value)}
                error={errors.url}
              />
            </div>
          </div>

          <FormActions
            isSubmitting={isSubmitting}
            isEditMode={isEdit}
            onCancel={handleCancel}
            onReset={handleReset}
          />
        </form>
      </div>
    </div>
  );
};

export default AddImportantLink;
