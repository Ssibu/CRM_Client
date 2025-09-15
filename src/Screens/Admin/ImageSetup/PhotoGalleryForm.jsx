
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/Components/Admin/Add/Header";
import DocumentUploader from "@/Components/Admin/TextEditor/DocumentUploader";
import axios from "axios";
import { useModal } from "@/context/ModalProvider";
import FormActions from "@/Components/Admin/Add/FormActions";
import FormField from "@/Components/Admin/TextEditor/FormField";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PhotoGalaryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState({
    en_title: "",
    od_title: "",
    category: "",
    photoSourceType: "upload",
    photoFile: null,
    photoLink: "",
  });

  const [existingPhotoName, setExistingPhotoName] = useState("");
  const [existingPhotoUrl, setExistingPhotoUrl] = useState("");
  const [existingPhotoRemoved, setExistingPhotoRemoved] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const axiosConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/image-setup/all-categories`,
          axiosConfig
        );
        if (res.data && Array.isArray(res.data.data)) {
          setCategories(
            res.data.data.filter((cat) => cat.category_type === "photo")
          );
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        showModal("error", "Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!id) return;

    const fetchPhoto = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/image-setup/photo/${id}`,
          axiosConfig
        );
        if (res.data.success && res.data.photo) {
          const photo = res.data.photo;
          const isLinked = photo.phototype === "link";
          const isUploaded = photo.phototype === "file";

          const fetchedFormData = {
            en_title: photo.en_title || "",
            od_title: photo.od_title || "",
            category: photo.category_id?.toString() || "",
            photoSourceType: isLinked ? "link" : "upload",
            photoFile: null,
            photoLink: isLinked ? photo.photolink : "",
          };

          const existingUrl = isUploaded
            ? photo.photo_url
            : isLinked
            ? photo.photolink
            : "";
          const existingName = isUploaded
            ? photo.photofile || ""
            : isLinked
            ? photo.photolink.split("/").pop() || ""
            : "";

          setFormData(fetchedFormData);
          setInitialData({
            ...fetchedFormData,
            existingPhotoUrl: existingUrl,
            existingPhotoName: existingName,
          });

          setExistingPhotoUrl(existingUrl);
          setExistingPhotoName(existingName);
          setExistingPhotoRemoved(false);
          setErrors({});
        } else {
          showModal("error", "Failed to load photo data");
          navigate("/admin/image-setup/photo-galary");
        }
      } catch (err) {
        console.error("Error loading photo:", err);
        showModal("error", "Error loading photo data");
        navigate("/admin/image-setup/photo-galary");
      }
    };

    fetchPhoto();
  }, [id]);

  const handleCancel = () => navigate("/admin/image-setup/photo-galary");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFormFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      photoFile: null,
      photoLink: "",
    }));
    setExistingPhotoUrl("");
    setExistingPhotoName("");
    setExistingPhotoRemoved(false);
    setErrors({});
  };

  const handleFileChange = (file, validationError) => {
    if (validationError) {
      setFormData((prev) => ({ ...prev, photoFile: null }));
      setErrors((prev) => ({ ...prev, photoFile: validationError }));
    } else {
      setFormData((prev) => ({
        ...prev,
        photoFile: file,
        photoLink: "",
      }));
      setExistingPhotoUrl("");
      setExistingPhotoName("");
      setExistingPhotoRemoved(false);
      setErrors((prev) => ({ ...prev, photoFile: "" }));
    }
  };

  const handleFileRemove = () => {
    setFormData((prev) => ({ ...prev, photoFile: null }));
    setExistingPhotoUrl("");
    setExistingPhotoName("");
    setExistingPhotoRemoved(true);
    setErrors((prev) => ({ ...prev, photoFile: "" }));
  };

  const handleReset = () => {
    if (id && initialData) {
      setFormData({
        en_title: initialData.en_title,
        od_title: initialData.od_title,
        category: initialData.category,
        photoSourceType: initialData.photoSourceType,
        photoFile: null,
        photoLink: initialData.photoLink,
      });
      setExistingPhotoRemoved(false);
      setExistingPhotoUrl(initialData.existingPhotoUrl || "");
      setExistingPhotoName(initialData.existingPhotoName || "");
      setErrors({});
    } else {
      setFormData({
        en_title: "",
        od_title: "",
        category: "",
        photoSourceType: "upload",
        photoFile: null,
        photoLink: "",
      });
      setExistingPhotoUrl("");
      setExistingPhotoName("");
      setExistingPhotoRemoved(false);
      setErrors({});
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.en_title.trim())
      newErrors.en_title = "Title (English) is required";
    if (!formData.od_title.trim())
      newErrors.od_title = "Title (Odia) is required";
    if (!formData.category) newErrors.category = "Category is required";

    if (formData.photoSourceType === "upload") {
      if (!formData.photoFile && !existingPhotoUrl && !existingPhotoName && !id) {
        newErrors.photoFile = "Please upload a photo";
      }
    } else if (formData.photoSourceType === "link" && !formData.photoLink.trim()) {
      newErrors.photoLink = "Please provide a photo link";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append("en_title", formData.en_title);
      form.append("od_title", formData.od_title);
      form.append("category_id", formData.category);
      form.append("phototype", formData.photoSourceType === "upload" ? "file" : "link");

      if (formData.photoSourceType === "upload") {
        if (formData.photoFile) {
          form.append("photo", formData.photoFile);
        } else if (id && existingPhotoRemoved) {
          form.append("photo", "");
        }
      } else {
        form.append("photolink", formData.photoLink.trim());
      }

      const endpoint = id
        ? `${API_BASE_URL}/image-setup/update-photo/${id}`
        : `${API_BASE_URL}/image-setup/register-photo`;

      const method = id ? axios.put : axios.post;

      const res = await method(endpoint, form, axiosConfig);

      if (res.data.success) {
        showModal(
          "success",
          id ? "Photo updated successfully!" : "Photo uploaded successfully!"
        );
        navigate("/admin/image-setup/photo-galary");
      } else {
        showModal("error", res.data.message || "Something went wrong");
      }
    }            catch (error) {
  const responseData = error.response?.data;
  let errorMessage = '';

  if (responseData?.errors) {
    // Combine all field error messages into one string
    errorMessage = Object.values(responseData.errors).join('\n');
  } else {
    // Fallback to top-level message
    errorMessage = responseData?.message || `Failed to ${isEditMode ? 'update' : 'create'} event.`;
  }

  showModal("error", errorMessage);
} finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh]">
      <div className="bg-white p-6 shadow">
        <Header
          title={id ? "Edit Photo Gallery Item" : "Add Photo Gallery Item"}
          onGoBack={handleCancel}
        />

        <form
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="grid grid-cols-2 gap-4"
        >
          <div className="mb-">
            <FormField
            required
            maxLength={100}
              label="Title (English)"
              type="text"
              name="en_title"
              value={formData.en_title}
              onChange={(value) => handleFormFieldChange("en_title", value)}
              placeholder="Title in English"
              error={errors.en_title}
            />
          </div>

          <div className="mb-">
            <FormField
            required
            maxLength={100}
              label="Title (Odia)"
              type="text"
              name="od_title"
              value={formData.od_title}
              onChange={(value) => handleFormFieldChange("od_title", value)}
              placeholder="Title in Odia"
              error={errors.od_title}
            />
          </div>
          <div className="mb-">
            <label className="block text-sm font-medium text-gray-700">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              // className="mt-1 block w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
           className={`mt-1 block w-full border  ${
  errors.category ? "border-red-500" : "border-gray-300"
} focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-3 py-2.5`}

           >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.en_category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-600 text-sm">{errors.category}</p>
            )}
          </div>

          <div className=" col-span-2">
            <div className="my-4">
              <label className="block text-sm font-medium text-gray-700">
                Photo Source Type
              </label>
              <div className="flex space-x-6 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="photoSourceType"
                    value="upload"
                    checked={formData.photoSourceType === "upload"}
                    onChange={handleRadioChange}
                  />
                  <span className="ml-2">Upload File</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="photoSourceType"
                    value="link"
                    checked={formData.photoSourceType === "link"}
                    onChange={handleRadioChange}
                  />
                  <span className="ml-2">Paste Link</span>
                </label>
              </div>
            </div>

            {formData.photoSourceType === "upload" ? (
              <div className="mb-6">
                <DocumentUploader
                required
                  label="Upload Photo"
                  file={formData.photoFile}
                  existingFileName={existingPhotoName}
                  existingFileUrl={existingPhotoUrl}
                  onFileChange={handleFileChange}
                  onRemove={handleFileRemove}
                    allowedTypes={['image/jpg', 'image/jpeg', 'image/png', 'image/webp']}
                  maxSizeMB={3}
                  error={errors.photoFile}
                />
              </div>
            ) : (
              <div className="mb-6">
                <FormField
                  type="text"
                  name="photoLink"
                  value={formData.photoLink}
                  onChange={(value) => handleFormFieldChange("photoLink", value)}
                  placeholder="https://example.com/photo.jpg"
                  error={errors.photoLink}
                />
              </div>
            )}
          </div>

          <FormActions
            isSubmitting={isSubmitting}
            onCancel={handleCancel}
            onReset={handleReset}
          />
        </form>
      </div>
    </div>
  );
};

export default PhotoGalaryForm;