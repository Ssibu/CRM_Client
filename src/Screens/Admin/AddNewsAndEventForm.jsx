import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Bold, Italic, Underline, Strikethrough, Paintbrush2,
  List, ListOrdered, AlignLeft, Table, Link2, Image as ImageIcon,
  Code, XCircle, HelpCircle
} from "lucide-react";

//==============================================================================
// 1. ATOMIC & REUSABLE FORM COMPONENTS
//==============================================================================

const Header = ({ title, onGoBack }) => (
  <div className="mb-6 flex items-center justify-between">
    <h1 className="text-xl font-semibold text-black">{title}</h1>
    <button
      onClick={onGoBack}
      className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 py-2 rounded-md font-medium flex items-center gap-2 transition"
    >
      <ArrowLeft size={16} />
      Go Back
    </button>
  </div>
);

const FormField = ({ label, placeholder, value, onChange, required = false, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && "*"}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-300 px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const FormActions = ({ onSubmit, onReset, onCancel, isSubmitting }) => (
  <div className="flex items-center gap-4 mt-8">
    <button
      type="submit"
      disabled={isSubmitting}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-all disabled:opacity-50"
      onClick={onSubmit}
    >
      Submit
    </button>
    <button
      type="button"
      onClick={onReset}
      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition-all"
    >
      Reset
    </button>
    <button
      type="button"
      onClick={onCancel}
      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition-all"
    >
      Cancel
    </button>
  </div>
);

const SkeletonBox = ({ height = "h-40" }) => (
  <div className={`bg-gray-200 animate-pulse rounded-md ${height}`} />
);

const FilePreview = ({ file, isLoading }) => (
  <motion.div className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    {file && (
      <>
        <p className="text-sm text-green-600">
          Selected File: {file.name} ({Math.round(file.size / 1024)} KB)
        </p>
        {isLoading ? (
          <SkeletonBox />
        ) : (
          <img src={URL.createObjectURL(file)} alt="Preview" className="mt-2 rounded-md border max-h-48 object-contain" />
        )}
      </>
    )}
  </motion.div>
);

const ImageUploader = ({ onChange, file, isLoading }) => {
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    if (selectedFile.size > 10240 * 1024) { alert("File size must be less than 10MB"); return; }
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) { alert("Only JPG, PNG, JPEG, and WebP files are allowed"); return; }
    
    const image = new Image();
    image.onload = () => onChange(selectedFile, false);
    image.onerror = () => onChange(null, false);
    image.src = URL.createObjectURL(selectedFile);
    onChange(selectedFile, true);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Upload Image <span className="text-xs text-gray-500">(JPG, PNG, WEBP, max: 10MB)</span>
      </label>
      <input
        type="file"
        onChange={handleFileUpload}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="w-full border border-gray-300 px-3 py-[7px] rounded-md file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      <FilePreview file={file} isLoading={isLoading} />
    </div>
  );
};


//==============================================================================
// 2. RICH TEXT EDITOR COMPONENTS
//==============================================================================

const ToolbarButton = ({ title, icon: Icon, onClick, active }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${active ? "bg-blue-100 text-blue-700" : "text-gray-700"}`}
  >
    <Icon size={16} />
  </button>
);

// const RichTextEditor = ({ value, onChange, placeholder }) => {
//   const editorRef = useRef(null);
//   const [activeFormats, setActiveFormats] = useState(new Set());
//   useEffect(() => { if (editorRef.current && !editorRef.current.innerHTML && value) { editorRef.current.innerHTML = value; } }, [value]);
//   const updateActiveFormats = () => { /* ... (implementation in previous steps) */ };
//   const executeCommand = (command, val = null) => { document.execCommand(command, false, val); editorRef.current.focus(); };
//   const handleInput = () => onChange(editorRef.current.innerHTML);
//   return (
//     <div className="w-full">
//       <div className="border border-gray-300 rounded-t bg-gray-50 px-2 py-1.5 flex items-center gap-1 border-b-0 flex-wrap">
//         <ToolbarButton title="Bold" icon={Bold} onClick={() => executeCommand("bold")} />
//         <ToolbarButton title="Italic" icon={Italic} onClick={() => executeCommand("italic")} />
//         <ToolbarButton title="Underline" icon={Underline} onClick={() => executeCommand("underline")} />
//         {/* ... Other toolbar buttons ... */}
//       </div>
//       <div
//         ref={editorRef}
//         contentEditable
//         onInput={handleInput}
//         suppressContentEditableWarning
//         className="w-full px-3 py-3 border border-gray-300 rounded-b focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[160px] bg-white"
//         dangerouslySetInnerHTML={{ __html: value }}
//       ></div>
//        {!value && <div className="absolute top-3 left-3 text-gray-400 pointer-events-none">{placeholder}</div>}
//     </div>
//   );
// };


//==============================================================================
// 3. COMPOSITE FORM GROUPS
//==============================================================================

const FormFieldsGroup = ({ formData, onInputChange, onImageChange, isLoadingImage }) => (
  <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
    <FormField
      label="ଇভେଣ୍ଟ୍‌ ଶିର୍ଷକ (ଇଂରାଜୀରେ) / Event Title (In English)"
      placeholder="Enter title in English..."
      value={formData.titleEnglish}
      onChange={(val) => onInputChange("titleEnglish", val)}
      required
    />
    <FormField
      label="ଇଭେଣ୍ଟ୍‌ ଶିର୍ଷକ (ଓଡ଼ିଆରେ) / Event Title (In Odia)"
      placeholder="Enter title in Odia..."
      value={formData.titleOdia}
      onChange={(val) => onInputChange("titleOdia", val)}
      required
    />
    <FormField
      label="ଇଭେଣ୍ଟ୍‌ ତାରିଖ / Event Date"
      type="date"
      value={formData.eventDate}
      onChange={(val) => onInputChange("eventDate", val)}
      required
    />
    <ImageUploader
      file={formData.image}
      onChange={onImageChange}
      isLoading={isLoadingImage}
    />
  </div>
);

// const DescriptionFields = ({ formData, onInputChange }) => (
//   <div className="bg-white p-6 rounded-lg shadow-md grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
//     <div className="md:col-span-2">
//       <label className="block text-sm font-medium text-gray-700 mb-1">ବିବରଣୀ (ଇଂରାଜୀରେ) / Description (In English) *</label>
//       <RichTextEditor
//         value={formData.descriptionEnglish}
//         onChange={(val) => onInputChange("descriptionEnglish", val)}
//         placeholder="Enter description in English..."
//       />
//     </div>
//     <div className="md:col-span-2">
//       <label className="block text-sm font-medium text-gray-700 mb-1">ବିବରଣୀ (ଓଡ଼ିଆରେ) / Description (In Odia) *</label>
//       <RichTextEditor
//         value={formData.descriptionOdia}
//         onChange={(val) => onInputChange("descriptionOdia", val)}
//         placeholder="Enter description in Odia..."
//       />
//     </div>
//   </div>
// );


//==============================================================================
// 4. MAIN PAGE COMPONENT
//==============================================================================

const AddNewsAndEventForm = () => {
  const [formData, setFormData] = useState({
    titleEnglish: "",
    titleOdia: "",
    eventDate: "",
    image: null,
    descriptionEnglish: "",
    descriptionOdia: "",
  });

  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (file, loading) => {
    setIsLoadingImage(loading);
    handleInputChange("image", file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const requiredFields = [
      ["Title (English)", formData.titleEnglish],
      ["Title (Odia)", formData.titleOdia],
      ["Event Date", formData.eventDate]
    //   ["Description (English)", formData.descriptionEnglish],
    //   ["Description (Odia)", formData.descriptionOdia],
    ];
    for (const [name, value] of requiredFields) {
      if (typeof value === 'string' && !value.trim()) {
        alert(`${name} is required`);
        return;
      }
    }
    console.log("News & Event Form submitted:", formData);
    alert("News & Event submitted successfully!");
  };

  const handleReset = () => {
    setFormData({
      titleEnglish: "",
      titleOdia: "",
      eventDate: "",
      image: null
    //   descriptionEnglish: "",
    //   descriptionOdia: "",
    });
    setIsLoadingImage(false);
  };

  const handleGoBack = () => {
    window.history.back();
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
        <FormFieldsGroup
          formData={formData}
          onInputChange={handleInputChange}
          onImageChange={handleImageChange}
          isLoadingImage={isLoadingImage}
        />

        {/* <DescriptionFields formData={formData} onInputChange={handleInputChange} /> */}

        <FormActions
          onSubmit={handleSubmit}
          onReset={handleReset}
          onCancel={handleGoBack}
          isSubmitting={false}
        />
      </form>
    </motion.div>
  );
};

export default AddNewsAndEventForm;