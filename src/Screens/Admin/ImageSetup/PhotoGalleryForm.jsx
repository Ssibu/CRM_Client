import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "@/Components/Admin/Add/Header";
import DocumentUploader from "@/Components/Admin/TextEditor/DocumentUploader";
import axios from "axios";
import { useModal } from "@/context/ModalProvider";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PhotoGalaryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [formData, setFormData] = useState({
    en_title: "",
    od_title: "",
    category: "",
    photoSourceType: "upload", // 'upload' or 'link'
    photoFile: null,
    photoLink: "",
  });

  const [existingPhotoName, setExistingPhotoName] = useState("");
  const [existingPhotoUrl, setExistingPhotoUrl] = useState("");
  const [existingPhotoRemoved, setExistingPhotoRemoved] = useState(false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const axiosConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
      
    },
    withCredentials: true,
  };

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/image-setup/all-categories`, axiosConfig);
        if (res.data && Array.isArray(res.data.data)) {
          setCategories(res.data.data.filter(cat => cat.category_type === "photo"));
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        showModal("error", "Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);

  // Fetch photo if editing
useEffect(() => {
  if (!id) return;

  const fetchPhoto = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/image-setup/photo/${id}`, axiosConfig);
      if (res.data.success && res.data.photo) {
        const photo = res.data.photo;
        const isLinked = photo.phototype === "link";
        const isUploaded = photo.phototype === "file";

        setFormData({
          en_title: photo.en_title || "",
          od_title: photo.od_title || "",
          category: photo.category_id?.toString() || "",
          photoSourceType: isLinked ? "link" : "upload",
          photoFile: null,
          photoLink: isLinked ? photo.photolink : "",
        });

        if (isUploaded && photo.photo_url) {
          setExistingPhotoName(photo.photofile || "");
          setExistingPhotoUrl(photo.photo_url);
        } else if (isLinked && photo.photolink) {
          // Optionally set a filename from the link
          setExistingPhotoName(photo.photolink.split("/").pop() || "");
          setExistingPhotoUrl(photo.photolink);
        } else {
          setExistingPhotoName("");
          setExistingPhotoUrl("");
        }

        setExistingPhotoRemoved(false);
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
    if (name === "photoSourceType") {
      setFormData((prev) => ({
        ...prev,
        photoSourceType: value,
        photoFile: null,
        photoLink: "",
      }));
      setExistingPhotoUrl("");
      setExistingPhotoName("");
      setExistingPhotoRemoved(false);
      setErrors({});
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (file, validationError) => {
    if (validationError) {
      setFormData(prev => ({ ...prev, photoFile: null }));
      setErrors(prev => ({ ...prev, photoFile: validationError }));
    } else {
      setFormData(prev => ({
        ...prev,
        photoFile: file,
        photoLink: "",
      }));
      setExistingPhotoUrl("");
      setExistingPhotoName("");
      setExistingPhotoRemoved(false);
      setErrors(prev => ({ ...prev, photoFile: "" }));
    }
  };

  const handleFileRemove = () => {
    setFormData(prev => ({ ...prev, photoFile: null }));
    setExistingPhotoUrl("");
    setExistingPhotoName("");
    setExistingPhotoRemoved(true);
    setErrors(prev => ({ ...prev, photoFile: "" }));
  };

  const handleReset = () => {
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
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.en_title.trim()) newErrors.en_title = "Title (EN) is required";
    if (!formData.od_title.trim()) newErrors.od_title = "Title (OD) is required";
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
          // Tell backend to remove photo (empty string or a flag)
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
        showModal("success", id ? "Photo updated successfully!" : "Photo uploaded successfully!");
        navigate("/admin/image-setup/photo-galary");
      } else {
        showModal("error", res.data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Submission error:", err);
      showModal("error", "Error occurred while submitting form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto p-6 min-h-[80vh]">
      <div className="bg-white p-6 rounded">
        <Header
          title={id ? "Edit Photo Gallery Item" : "Add Photo Gallery Item"}
          onGoBack={handleCancel}
        />

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Title (EN) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title (In English)</label>
            <input
              type="text"
              name="en_title"
              value={formData.en_title}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
            {errors.en_title && <p className="text-red-600 text-sm">{errors.en_title}</p>}
          </div>

          {/* Title (OD) */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Title (In Odia)</label>
            <input
              type="text"
              name="od_title"
              value={formData.od_title}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            />
            {errors.od_title && <p className="text-red-600 text-sm">{errors.od_title}</p>}
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full border rounded px-2 py-1"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.en_category}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-600 text-sm">{errors.category}</p>}
          </div>

          {/* Photo Source Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Photo Source Type</label>
            <div className="flex space-x-6 mt-1">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="photoSourceType"
                  value="upload"
                  checked={formData.photoSourceType === "upload"}
                  onChange={handleChange}
                />
                <span className="ml-2">Upload File</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="photoSourceType"
                  value="link"
                  checked={formData.photoSourceType === "link"}
                  onChange={handleChange}
                />
                <span className="ml-2">Paste Link</span>
              </label>
            </div>
          </div>

          {/* Upload or Link Section */}
          {formData.photoSourceType === "upload" ? (
            <div className="mb-6">
              <div className="mb-6">
  <DocumentUploader
    label="Upload Photo"
    file={formData.photoFile}
    existingFileName={existingPhotoName} // ✅ Add this line
    existingFileUrl={existingPhotoUrl}
    onFileChange={handleFileChange}
    onRemove={handleFileRemove}
    allowedTypes={["image/jpeg", "image/png", "image/webp"]}
    maxSizeMB={2}
    error={errors.photoFile}
  />
</div>

              



            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">Paste Photo Link</label>
              <input
                type="text"
                name="photoLink"
                value={formData.photoLink}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="mt-1 block w-full border rounded px-2 py-1"
              />
              {errors.photoLink && <p className="text-red-600 text-sm">{errors.photoLink}</p>}
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-1 rounded"
            >
              {isSubmitting ? (id ? "Updating..." : "Uploading...") : id ? "Update" : "Upload"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-1 rounded"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhotoGalaryForm;
