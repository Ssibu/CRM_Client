// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useModal } from '../../../../context/ModalProvider'; // Adjust path if needed

// // Import the UI components you provided
// import Header from '../../../../Components/Add/Header'; // Adjust path
// import FormActions from '../../../../Components/Add/FormActions'; // Adjust path

// // --- Sub-components for a cleaner form ---

// const FormField = ({ label, name, type = "text", value, onChange, error }) => (
//   <div>
//     <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
//       {label}
//     </label>
//     <input
//       type={type}
//       id={name}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className={`w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
//     />
//     {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
//   </div>
// );

// const FileInput = ({ label, name, onFileChange, error, fileName }) => (
//   <div>
//     <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
//       {label}
//     </label>
//     <input
//       type="file"
//       id={name}
//       name={name}
//       accept=".pdf" // Enforce PDF on the client-side
//       onChange={onFileChange}
//       className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//     />
//     {fileName && <p className="text-xs text-gray-600 mt-1">Selected: {fileName}</p>}
//     <p className="text-xs text-gray-500 mt-1">PDF only, max 1MB.</p>
//     {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
//   </div>
// );


// // --- Main Page Component ---

// const AddTenderPage = () => {
//   const navigate = useNavigate();
//   const { showModal } = useModal();

//   const [formData, setFormData] = useState({
//     en_title: '',
//     od_title: '',
//     date: '',
//     expiry_date: '',
//   });

//   const [files, setFiles] = useState({
//     nit_doc: null,
//     doc: null,
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const { name, files: selectedFiles } = e.target;
//     const file = selectedFiles[0];

//     if (!file) { // User cancelled file selection
//       setFiles(prev => ({ ...prev, [name]: null }));
//       return;
//     }

//     // Client-side validation
//     if (file.type !== 'application/pdf') {
//       setErrors(prev => ({ ...prev, [name]: "Invalid file type. Only PDF is allowed." }));
//       e.target.value = null; // Clear the input
//       return;
//     }
//     if (file.size > 1 * 1024 * 1024) {
//       setErrors(prev => ({ ...prev, [name]: "File size exceeds 1MB." }));
//       e.target.value = null; // Clear the input
//       return;
//     }

//     // Clear previous error and set file
//     setErrors(prev => ({ ...prev, [name]: null }));
//     setFiles(prev => ({ ...prev, [name]: file }));
//   };
  
//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.en_title.trim()) newErrors.en_title = "English title is required.";
//     if (!formData.date) newErrors.date = "Tender date is required.";
//     if (!formData.expiry_date) newErrors.expiry_date = "Expiry date is required.";
//     if (!files.nit_doc) newErrors.nit_doc = "NIT document is required.";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setIsSubmitting(true);

//     const submissionData = new FormData();
//     // Append form fields
//     Object.keys(formData).forEach(key => {
//       submissionData.append(key, formData[key]);
//     });
//     // Append files
//     if (files.nit_doc) submissionData.append('nit_doc', files.nit_doc);
//     if (files.doc) submissionData.append('doc', files.doc);

//     try {
//       await axios.post(`${process.env.REACT_APP_API_URL}/tenders`, submissionData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         withCredentials: true,
//       });
//       showModal("success", "Tender added successfully!");
//       navigate('/admin/notifications/tenders'); // Navigate to the tenders list page
//     } catch (error) {
//       showModal("error", error.response?.data?.message || "Failed to add tender.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleReset = () => {
//     setFormData({ en_title: '', od_title: '', date: '', expiry_date: '' });
//     setFiles({ nit_doc: null, doc: null });
//     setErrors({});
//     // This requires a bit of a trick to clear the file input visually
//     document.getElementById('nit_doc').value = null;
//     document.getElementById('doc').value = null;
//   };
  
//   return (
//     <div className="p-6 min-h-[80vh]">

      
//       <div className="bg-white p-8 rounded-lg shadow-md">
//       	      <Header title="Add New Tender" onGoBack={() => navigate('/tenders')} />
//         <form onSubmit={handleSubmit} noValidate>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <FormField
//               label="Title (English)"
//               name="en_title"
//               value={formData.en_title}
//               onChange={handleChange}
//               error={errors.en_title}
//             />
//             <FormField
//               label="Title (Odia)"
//               name="od_title"
//               value={formData.od_title}
//               onChange={handleChange}
//               error={errors.od_title}
//             />
//             <FormField
//               label="Tender Date"
//               name="date"
//               type="date"
//               value={formData.date}
//               onChange={handleChange}
//               error={errors.date}
//             />
//             <FormField
//               label="Expiry Date"
//               name="expiry_date"
//               type="date"
//               value={formData.expiry_date}
//               onChange={handleChange}
//               error={errors.expiry_date}
//             />
//             <FileInput
//               label="NIT Document (Required)"
//               name="nit_doc"
//               onFileChange={handleFileChange}
//               error={errors.nit_doc}
//               fileName={files.nit_doc?.name}
//             />
//             <FileInput
//               label="Other Document (Optional)"
//               name="doc"
//               onFileChange={handleFileChange}
//               error={errors.doc}
//               fileName={files.doc?.name}
//             />
//           </div>

//           <FormActions
//             onSubmit={handleSubmit}
//             onReset={handleReset}
//             onCancel={() => navigate('/tenders')}
//             isSubmitting={isSubmitting}
//           />
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddTenderPage;


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useModal } from '../../../../context/ModalProvider';
import Header from '../../../../Components/Add/Header';
import FormActions from '../../../../Components/Add/FormActions';



// --- Reusable Sub-components (no changes needed) ---
const FormField = ({ label, name, type = "text", value, onChange, error }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
    />
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

const FileInput = ({ label, name, onFileChange, error, fileName }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type="file"
      id={name}
      name={name}
      accept=".pdf" // Enforce PDF on the client-side
      onChange={onFileChange}
      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
    />
    {fileName && <p className="text-xs text-gray-600 mt-1">Selected: {fileName}</p>}
    <p className="text-xs text-gray-500 mt-1">PDF only, max 1MB.</p>
    {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
  </div>
);

// --- Main Page Component ---
const TenderFormPage = () => {
const { id } = useParams(); // Get the ID from the URL
const isEditMode = !!id; // Determine if we are in "edit" mode
const navigate = useNavigate();
const { showModal } = useModal();
const [formData, setFormData] = useState({
en_title: '',
od_title: '',
date: '',
expiry_date: '',
});
const [files, setFiles] = useState({ nit_doc: null, doc: null });
const [existingFileNames, setExistingFileNames] = useState({ nit_doc: '', doc: '' });
const [errors, setErrors] = useState({});
const [isSubmitting, setIsSubmitting] = useState(false);
// --- Fetch data for editing ---
useEffect(() => {
if (isEditMode) {
const fetchTenderData = async () => {
try {
const response = await axios.get(`${process.env.REACT_APP_API_URL}/tenders/${id}`, { withCredentials: true });
const { en_title, od_title, date, expiry_date, nit_doc, doc } = response.data;
setFormData({
en_title,
od_title,
date: date || '', // Handle null dates
expiry_date: expiry_date || ''
});
setExistingFileNames({ nit_doc, doc });
} catch (error) {
showModal("error", "Failed to fetch tender data.");
navigate('/tenders');
}
};
fetchTenderData();
}
}, [id, isEditMode, navigate, showModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];

    if (!file) { // User cancelled file selection
      setFiles(prev => ({ ...prev, [name]: null }));
      return;
    }

    // Client-side validation
    if (file.type !== 'application/pdf') {
      setErrors(prev => ({ ...prev, [name]: "Invalid file type. Only PDF is allowed." }));
      e.target.value = null; // Clear the input
      return;
    }
    if (file.size > 1 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [name]: "File size exceeds 1MB." }));
      e.target.value = null; // Clear the input
      return;
    }

    // Clear previous error and set file
    setErrors(prev => ({ ...prev, [name]: null }));
    setFiles(prev => ({ ...prev, [name]: file }));
  };
const validateForm = () => {
const newErrors = {};
if (!formData.en_title.trim()) newErrors.en_title = "English title is required.";
if (!formData.date) newErrors.date = "Tender date is required.";
if (!formData.expiry_date) newErrors.expiry_date = "Expiry date is required.";
// In edit mode, a file is not required if one already exists
if (!isEditMode && !files.nit_doc) {
newErrors.nit_doc = "NIT document is required.";
}
setErrors(newErrors);
return Object.keys(newErrors).length === 0;
};
const handleSubmit = async (e) => {
e.preventDefault();
if (!validateForm()) return;
setIsSubmitting(true);

const submissionData = new FormData();
Object.keys(formData).forEach(key => submissionData.append(key, formData[key]));
if (files.nit_doc) submissionData.append('nit_doc', files.nit_doc);
if (files.doc) submissionData.append('doc', files.doc);

try {
  if (isEditMode) {
    // --- UPDATE LOGIC ---
    await axios.patch(`${process.env.REACT_APP_API_URL}/tenders/${id}`, submissionData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });
    showModal("success", "Tender updated successfully!");
  } else {
    // --- ADD LOGIC ---
    await axios.post(`${process.env.REACT_APP_API_URL}/tenders`, submissionData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    });
    showModal("success", "Tender added successfully!");
  }
  navigate('/admin/notifications/tenders');
} catch (error) {
  showModal("error", error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} tender.`);
} finally {
  setIsSubmitting(false);
}
};
  const handleReset = () => {
    setFormData({ en_title: '', od_title: '', date: '', expiry_date: '' });
    setFiles({ nit_doc: null, doc: null });
    setErrors({});
    // This requires a bit of a trick to clear the file input visually
    document.getElementById('nit_doc').value = null;
    document.getElementById('doc').value = null;
  };
return (
<div className="p-6 min-h-[80vh]">
<Header title={isEditMode ? "Edit Tender" : "Add New Tender"} onGoBack={() => navigate('/admin/notifications/tenders')} />

<div className="bg-white p-8 rounded-lg shadow-md">
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <FormField
              label="Title (English)"
              name="en_title"
              value={formData.en_title}
              onChange={handleChange}
              error={errors.en_title}
            />
            <FormField
              label="Title (Odia)"
              name="od_title"
              value={formData.od_title}
              onChange={handleChange}
              error={errors.od_title}
            />
            <FormField
              label="Tender Date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              error={errors.date}
            />
            <FormField
              label="Expiry Date"
              name="expiry_date"
              type="date"
              value={formData.expiry_date}
              onChange={handleChange}
              error={errors.expiry_date}
            />
        <FileInput
          label={isEditMode ? "Replace NIT Document (Optional)" : "NIT Document (Required)"}
          name="nit_doc"
          onFileChange={handleFileChange}
          error={errors.nit_doc}
          fileName={files.nit_doc?.name || existingFileNames.nit_doc}
        />
        <FileInput
          label="Replace Other Document (Optional)"
          name="doc"
          onFileChange={handleFileChange}
          error={errors.doc}
          fileName={files.doc?.name || existingFileNames.doc}
        />
      </div>

      <FormActions
        onSubmit={handleSubmit}
        onReset={handleReset}
        onCancel={() => navigate('/admin/notifications/tenders')}
        isSubmitting={isSubmitting}
      />
    </form>
  </div>
</div>
);
};

 export default TenderFormPage;
