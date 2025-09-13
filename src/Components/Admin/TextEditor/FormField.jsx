

import React from "react";

const FormField = ({
  label,
  placeholder,
  value,
  onChange,
  required = false,
  type = "text",
  error,
  maxLength, 
}) => {
  const handleKeyDown = (e) => {
    if (
      !/[0-9]/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "Tab"
    ) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}{" "}
        {maxLength && (
          <p
            className={`mt-1 text-xs float-end ${
              value.length >= maxLength ? "text-red-500" : "text-gray-500"
            }`}
          >
            {value.length}/{maxLength}
          </p>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength ?? (type === "tel" ? 10 : undefined)}
        onKeyDown={type === "tel" ? handleKeyDown : undefined}
        className={`w-full border ${
          error ? "border-red-500" : "border-gray-300"
        } px-3 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
      />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;
