
import React from "react";
import RichTextEditor from "@/Components/Admin/TextEditor/RichTextEditor";

// --- THE FIX IS HERE ---
// We provide a default empty object for the 'errors' prop.
const DescriptionFields = ({ formData, onInputChange, errors = {} }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description (In English) *
      </label>
      <RichTextEditor
        value={formData.en_description}
        onChange={(val) => onInputChange("en_description", val)}
        placeholder="Enter description in English..."
        // If 'errors' is not passed, `errors.en_description` will be undefined, which is safe.
        error={errors.en_description}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description (In Odia) *
      </label>
      <RichTextEditor
        value={formData.od_description}
        onChange={(val) => onInputChange("od_description", val)}
        placeholder="Enter description in Odia..."
        error={errors.od_description}
      />
    </div>
  </div>
);

export default DescriptionFields;