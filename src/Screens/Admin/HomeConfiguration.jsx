import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

// Reusable Components
import FormField from "../../Components/Admin/TextEditor/FormField";
import RichTextEditor from "../../Components/Admin/TextEditor/RichTextEditor";
import ImageUploader from "../../Components/Admin/TextEditor/ImageUploader";
import { ModalDialog } from "../../Components/Admin/Modal/MessageModal";
import DocumentUploader from "../../Components/Admin/TextEditor/DocumentUploader";
const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/home-settings`;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const defaultFormData = {
  en_org_name: "",
  od_org_name: "",
  en_person_designation: "",
  od_person_designation: "",
  en_person_name: "",
  od_person_name: "",
  en_overview_description: "",
  od_overview_description: "",
  en_address: "",
  od_address: "",
  email: "",
  mobileNumber: "",
  facebookLink: "",
  instagramLink: "",
  twitterLink: "",
  linkedinLink: "",
  showInnerpageSidebar: false,
  showChatbot: false,
  odishaLogo: "",
  cmPhoto: ""
};

// Define field labels for error messages
const fieldLabels = {
  en_org_name: "Organization Name (English)",
  od_org_name: "Organization Name (Odia)",
  en_person_designation: "Person Designation (English)",
  od_person_designation: "Person Designation (Odia)",
  en_person_name: "Person Name (English)",
  od_person_name: "Person Name (Odia)",
  en_overview_description: "Overview Description (English)",
  od_overview_description: "Overview Description (Odia)",
  en_address: "Address (English)",
  od_address: "Address (Odia)",
  email: "Email",
  mobileNumber: "Mobile Number",
  odishaLogo: "Odisha Logo",
  cmPhoto: "CM Photo",
  facebookLink: "Facebook Link",
  instagramLink: "Instagram Link",
  twitterLink: "Twitter Link",
  linkedinLink: "LinkedIn Link"
};

const HomeConfiguration = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [odishaLogoFile, setOdishaLogoFile] = useState(null);
  const [cmPhotoFile, setCmPhotoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalVariant, setModalVariant] = useState("info");
  const [modalFields, setModalFields] = useState([]);
const [initialSettings, setInitialSettings] = useState(defaultFormData);
  const odishaLogoUploaderRef = useRef();
  const cmPhotoUploaderRef = useRef();

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(API_URL, {withCredentials:true});
        const settings = response.data;

        const updatedSettings = { ...defaultFormData };
        for (const key in defaultFormData) {
          if (settings.hasOwnProperty(key)) {
            if (key === "showInnerpageSidebar" || key === "showChatbot") {
              updatedSettings[key] = String(settings[key]) === "true";
            } else {
              updatedSettings[key] = settings[key];
            }
          }
        }
        setFormData(updatedSettings);
        setInitialSettings(updatedSettings); 
      } catch (error) {
        console.error("Error fetching settings:", error);
        alert("Could not load settings.");
        setFormData(defaultFormData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const requiredFields = [
      "en_org_name", "od_org_name",
      "en_person_designation", "od_person_designation",
      "en_person_name", "od_person_name",
      "en_overview_description", "od_overview_description",
      "en_address", "od_address",
      "email", "mobileNumber"
    ];

    // Check required text fields
    requiredFields.forEach(field => {
      if (typeof formData[field] === 'string' && !formData[field].trim()) {
        newErrors[field] = `${fieldLabels[field] || field} is required.`;
      }
    });

    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    // Mobile number validation
    if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be 10 digits.";
    }

    // Image validation - check if either existing image or new file is present
    if (!formData.odishaLogo && !odishaLogoFile) {
      newErrors.odishaLogo = "Odisha Logo is required.";
    }

    // Social media link validation
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/i;
    
    if (formData.facebookLink && !urlPattern.test(formData.facebookLink)) {
      newErrors.facebookLink = "Please enter a valid Facebook link.";
    }
    if (formData.instagramLink && !urlPattern.test(formData.instagramLink)) {
      newErrors.instagramLink = "Please enter a valid Instagram link.";
    }
    if (formData.twitterLink && !urlPattern.test(formData.twitterLink)) {
      newErrors.twitterLink = "Please enter a valid Twitter link.";
    }
    if (formData.linkedinLink && !urlPattern.test(formData.linkedinLink)) {
      newErrors.linkedinLink = "Please enter a valid LinkedIn link.";
    }

    if (!formData.cmPhoto && !cmPhotoFile) {
      newErrors.cmPhoto = "CM Photo is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, odishaLogoFile, cmPhotoFile]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for the field as user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  }, [errors]);

  const handleReset = () => {
    // setFormData(defaultFormData);
     setFormData(initialSettings);
    setOdishaLogoFile(null);
    setCmPhotoFile(null);
    setErrors({});

    if (odishaLogoUploaderRef.current) {
      odishaLogoUploaderRef.current.clearFile();
    }
    if (cmPhotoUploaderRef.current) {
      cmPhotoUploaderRef.current.clearFile();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const dataToSubmit = new FormData();
    for (const key in formData) {
      if (formData[key] !== null && key !== "odishaLogo" && key !== "cmPhoto") {
        dataToSubmit.append(key, formData[key]);
      }
    }
    if (odishaLogoFile) dataToSubmit.append("odishaLogo", odishaLogoFile);
    if (cmPhotoFile) dataToSubmit.append("cmPhoto", cmPhotoFile);

    try {
      await axios.put(API_URL, dataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      setModalMessage("Congratulations! Settings updated successfully.");
      setModalVariant("success");
      setModalOpen(true);
    } catch (error) {
      setModalMessage(error.response?.data?.message || 'An error occurred.');
      setModalVariant("error");
      setModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center font-semibold">
        Loading Configuration...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-lg font-semibold mb-6">
          Homepage Configuration
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* English / Odia Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
  <label className="block text-sm font-medium mb-1">
    Organization Name (In English) <span className="text-red-500">*</span>
  </label>

  <div
    className={`rounded-md border ${
      errors?.en_org_name ? "border-red-500" : "border-gray-300"
    }`}
  >
    <RichTextEditor
      value={formData.en_org_name}
      onChange={(val) => handleInputChange("en_org_name", val)}
      placeholder="Enter organization name..."
    />
  </div>

  {errors.en_org_name && (
    <p className="text-red-500 text-xs mt-1">{errors.en_org_name}</p>
  )}
</div>
<div>
  <label className="block text-sm font-medium mb-1">
    Organization Name (In Odia) <span className="text-red-500">*</span>
  </label>
  <div
    className={`rounded-md border ${
      errors?.od_org_name ? "border-red-500" : "border-gray-300"
    }`}
  >
    <RichTextEditor
      value={formData.od_org_name}
      onChange={(val) => handleInputChange("od_org_name", val)}
      placeholder="Enter Organization Name in Odia..."
    />
  </div>
  {errors.od_org_name && (
    <p className="text-red-500 text-xs mt-1">{errors.od_org_name}</p>
  )}
</div>

          <div>
  <label className="block text-sm font-medium mb-1">
    Person Designation (In English) <span className="text-red-500">*</span>
  </label>
  <div
    className={`rounded-md border ${
      errors?.en_person_designation ? "border-red-500" : "border-gray-300"
    }`}
  >
    <RichTextEditor
      value={formData.en_person_designation}
      onChange={(val) => handleInputChange("en_person_designation", val)}
      placeholder="Enter Person Designation in English..."
    />
  </div>
  {errors.en_person_designation && (
    <p className="text-red-500 text-xs mt-1">{errors.en_person_designation}</p>
  )}
</div>

         <div>
  <label className="block text-sm font-medium mb-1">
    Person Designation (In Odia) <span className="text-red-500">*</span>
  </label>
  <div
    className={`rounded-md border ${
      errors?.od_person_designation ? "border-red-500" : "border-gray-300"
    }`}
  >
    <RichTextEditor
      value={formData.od_person_designation}
      onChange={(val) =>
        handleInputChange("od_person_designation", val)
      }
      placeholder="Enter Person Designation in Odia..."
    />
  </div>
  {errors.od_person_designation && (
    <p className="text-red-500 text-xs mt-1">{errors.od_person_designation}</p>
  )}
</div>


            <div>
              <FormField
                label={
                  <>
                    Person Name (In English) <span className="text-red-500">*</span>
                  </>
                }
                value={formData.en_person_name}
                onChange={(val) => handleInputChange("en_person_name", val)}
                error={errors.en_person_name}
              />
            </div>
            <div>
              <FormField
                label={
                  <>
                    Person Name (In Odia) <span className="text-red-500">*</span>
                  </>
                }
                value={formData.od_person_name}
                onChange={(val) => handleInputChange("od_person_name", val)}
                error={errors.od_person_name}
              />
            </div>
<div>
  <label className="block text-sm font-medium mb-1">
    Overview Description (In English) <span className="text-red-500">*</span>
  </label>
  <div
    className={`rounded-md border ${
      errors?.en_overview_description ? "border-red-500" : "border-gray-300"
    }`}
  >
    <RichTextEditor
      value={formData.en_overview_description}
      onChange={(val) => handleInputChange("en_overview_description", val)}
      placeholder="Enter Overview Description in English..."
    />
  </div>
  {errors.en_overview_description && (
    <p className="text-red-500 text-xs mt-1">{errors.en_overview_description}</p>
  )}
</div>

          <div>
  <label className="block text-sm font-medium mb-1">
    Overview Description (In Odia) <span className="text-red-500">*</span>
  </label>
  <div
    className={`rounded-md border ${
      errors?.od_overview_description ? "border-red-500" : "border-gray-300"
    }`}
  >
    <RichTextEditor
      value={formData.od_overview_description}
      onChange={(val) => handleInputChange("od_overview_description", val)}
      placeholder="Enter Overview Description in Odia..."
    />
  </div>
  {errors.od_overview_description && (
    <p className="text-red-500 text-xs mt-1">
      {errors.od_overview_description}
    </p>
  )}
</div>

<div>
  <label className="block text-sm font-medium mb-1">
    Address (In English) <span className="text-red-500">*</span>
  </label>
  <div
    className={`rounded-md border ${
      errors?.en_address ? "border-red-500" : "border-gray-300"
    }`}
  >
    <RichTextEditor
      value={formData.en_address}
      onChange={(val) => handleInputChange("en_address", val)}
      placeholder="Enter Address in English..."
    />
  </div>
  {errors.en_address && (
    <p className="text-red-500 text-xs mt-1">{errors.en_address}</p>
  )}
</div>
<div className="mb-4">
  <label className="block text-sm font-medium mb-1">
    Address (In Odia) <span className="text-red-500">*</span>
  </label>
  <div
    className={`rounded-md border ${
      errors?.od_address ? "border-red-500" : "border-gray-300"
    }`}
  >
    <RichTextEditor
      value={formData.od_address}
      onChange={(val) => handleInputChange("od_address", val)}
      placeholder="Enter Address in Odia..."
    />
  </div>
  {errors.od_address && (
    <p className="text-red-500 text-xs mt-1">{errors.od_address}</p>
  )}
</div>

          </div>

          {/* Contact & Social Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FormField
                label={
                  <>
                    Email <span className="text-red-500">*</span>
                  </>
                }
                type="email"
                value={formData.email}
                onChange={(val) => handleInputChange("email", val)}
                error={errors.email}
              />
            </div>

            <div>
              <FormField
                label={
                  <>
                    Mobile No. <span className="text-red-500">*</span>
                  </>
                }
                value={formData.mobileNumber}
                onChange={(val) => handleInputChange("mobileNumber", val)}
                error={errors.mobileNumber}
             
              />
            </div>

            <div>
              <FormField
                label="Facebook Link"
                value={formData.facebookLink}
                onChange={(val) => handleInputChange("facebookLink", val)}
                error={errors.facebookLink}
              />
            </div>
            <div>
              <FormField
                label="Twitter Link"
                value={formData.twitterLink}
                onChange={(val) => handleInputChange("twitterLink", val)}
                error={errors.twitterLink}
              />
            </div>

            <div>
              <FormField
                label="Instagram Link"
                value={formData.instagramLink}
                onChange={(val) => handleInputChange("instagramLink", val)}
                error={errors.instagramLink}
              />
            </div>
            <div>
              <FormField
                label="LinkedIn Link"
                value={formData.linkedinLink}
                onChange={(val) => handleInputChange("linkedinLink", val)}
                error={errors.linkedinLink}
              />
            </div>
          </div>

          {/* Upload Section */}
   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
  {/* Left Side - Image Uploaders */}
  <div className="grid grid-cols-2 gap-6">
    {/* Odisha Logo */}
    <div>  
          <DocumentUploader
                label="Upload Odisha Logo"
                file={formData.image}
               
                onFileChange={setOdishaLogoFile}
             
                error={errors.image}
                allowedTypes={[
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                  "image/webp",
                  "image/gif",
                ]}
                maxSizeMB={5}
              />
      
      {errors.odishaLogo && (
        <p className="text-red-500 text-xs mt-1">{errors.odishaLogo}</p>
      )}
      {/* Current / New Preview */}
      <div
        className={`mt-3 h-24 w-24 border rounded ${
          !!errors.odishaLogo ? "border-red-500" : "border-gray-300"
        } flex items-center justify-center`}
      >
        {odishaLogoFile ? (
          <img
            src={URL.createObjectURL(odishaLogoFile)}
            alt="New Odisha Logo Preview"
            className="h-24 w-24 object-contain"
          />
        ) : formData.odishaLogo ? (
          <img
            src={`${API_BASE_URL}/uploads/settings/${formData.odishaLogo}`}
            alt="Odisha Logo Preview"
            className="h-24 w-24 object-contain"
          />
        ) : (
          <span className="text-gray-400 text-xs">No Logo</span>
        )}
      </div>
    </div>

    {/* CM Photo */}
    <div>
                  <DocumentUploader
                label="Upload CM Photo"
                file={formData.image}
           
                onFileChange={setCmPhotoFile}

                error={errors.image}
                allowedTypes={[
                  "image/jpeg",
                  "image/png",
                  "image/jpg",
                  "image/webp",
                  "image/gif",
                ]}
                maxSizeMB={5}
              />
      {errors.cmPhoto && (
        <p className="text-red-500 text-xs mt-1">{errors.cmPhoto}</p>
      )}
      <div
        className={`mt-3 h-24 w-24 border rounded ${
          !!errors.cmPhoto ? "border-red-500" : "border-gray-300"
        } flex items-center justify-center`}
      >
        {cmPhotoFile ? (
          <img
            src={URL.createObjectURL(cmPhotoFile)}
            alt="New CM Photo Preview"
            className="h-24 w-24 object-cover"
          />
        ) : formData.cmPhoto ? (
          <img
            src={`${API_BASE_URL}/uploads/settings/${formData.cmPhoto}`}
            alt="CM Photo Preview"
            className="h-24 w-24 object-cover"
          />
        ) : (
          <span className="text-gray-400 text-xs">No Photo</span>
        )}
      </div>
    </div>
  </div>
  {/* Right Side - Toggles */}
  <div className="grid grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Show Innerpage Sidebar
      </label>
      <select
        value={String(formData.showInnerpageSidebar)}
        onChange={(e) =>
          handleInputChange(
            "showInnerpageSidebar",
            e.target.value === "true"
          )
        }
        className="mt-1 w-full p-2 border rounded-md"
      >
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Show Chatbot
      </label>
      <select
        value={String(formData.showChatbot)}
        onChange={(e) =>
          handleInputChange("showChatbot", e.target.value === "true")
        }
        className="mt-1 w-full p-2 border rounded-md"
      >
        <option value="true">Yes</option>
        <option value="false">No</option>
      </select>
    </div>
  </div>
</div>
          {/* Buttons */}
              <div className="flex items-center gap-4 mt-8">
                        <button type="submit" disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-all disabled:opacity-50">
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </button>
                        <button type="button" onClick={handleReset} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-all">
                            Reset
                        </button>
                    </div>
        </form>
      </div>
      <ModalDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        variant={modalVariant}
        message={modalMessage} >
        {modalVariant === "error" && modalFields.length > 0 && (
          <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
            {modalFields.map((field, idx) => (
              <li key={idx}>{field}</li>
            ))}
          </ul>
        )}
      </ModalDialog>
    </div>
  );
};

export default HomeConfiguration;