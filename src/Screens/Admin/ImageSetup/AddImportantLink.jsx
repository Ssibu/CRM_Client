import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Header from "@/Components/Admin/Add/Header";
import DocumentUploader from "@/Components/Admin/TextEditor/DocumentUploader";
import FormActions from "@/Components/Admin/Add/FormActions";
import { useModal } from "@/context/ModalProvider";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddImportantLink = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { showModal } = useModal();

  const [formData, setFormData] = useState({
    url: "",
    image: null,
  });

  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [existingImageName, setExistingImageName] = useState("");
  const [existingImageRemoved, setExistingImageRemoved] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${API_BASE_URL}/uploads/importantlinks/${img.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    if (!isEdit) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/image-setup/importantlinks/${id}`, {
          withCredentials: true,
        });

        const link = res.data?.link || res.data;

        setFormData({
          url: link.url || "",
          image: null,
        });

        if (link.image) {
          const fullUrl = getImageUrl(link.image);
          setExistingImageUrl(fullUrl);
          setExistingImageName(link.image.split("/").pop());
        }
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleReset = () => {
    setFormData({
      url: "",
      image: null,
    });
    setExistingImageUrl("");
    setExistingImageName("");
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
        fd.append("image", ""); // Triggers removal on backend
      }

      const endpoint = isEdit
        ? `${API_BASE_URL}/image-setup/importantlinks/update/${id}`
        : `${API_BASE_URL}/image-setup/importantlinks/register`;

      const method = isEdit ? axios.put : axios.post;

      const res = await method(endpoint, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success || res.data.importantLink) {
        showModal("success", isEdit ? "Link updated successfully!" : "Link created successfully!");
        navigate("/admin/image-setup/important-links");
      } else {
        throw new Error(res.data.message || "Server returned error");
      }
    } catch (err) {
      console.error("Error:", err);
      showModal("error", err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 👇 Combine new file and existing image for preview logic
  const fileForPreview = formData.image || (!existingImageRemoved && existingImageUrl) || null;

  return (
    <div className="mx-auto p-6 min-h-[80vh]">
      <div className="bg-white p-6 rounded">
        <Header title={isEdit ? "Edit Important Link" : "Add Important Link"} onGoBack={handleCancel} />

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="flex items-start space-x-6 mb-6">
            <div className="flex-1 min-w-[250px]">
              <DocumentUploader
                label="Upload Image"
                file={fileForPreview}
                existingFileName={existingImageName}
                existingFileUrl={existingImageUrl}
                onFileChange={handleFileChange}
                onRemove={handleFileRemove}
                allowedTypes={["image/jpeg", "image/png", "image/gif", "image/webp"]}
                maxSizeMB={2}
                error={errors.image}
              />
            </div>

            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image Link</label>
              <input
                type="url"
                name="url"
                placeholder="https://example.com"
                value={formData.url}
                onChange={handleChange}
                className={`mt-1 block w-full border rounded px-2 py-1 ${
                  errors.url ? "border-red-600" : "border-gray-300"
                }`}
              />
              {errors.url && <p className="text-red-600 text-sm mt-1">{errors.url}</p>}
            </div>
          </div>

          <FormActions
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
            onReset={!isEdit ? handleReset : null}
          />
        </form>
      </div>
    </div>
  );
};

export default AddImportantLink;
