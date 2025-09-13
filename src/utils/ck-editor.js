import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const MyCKEditor = ({ value, onChange, placeholder, error }) => {
  // Custom styles to handle the error state
  const editorStyles = {
    '--ck-focus-ring': error ? '1px solid red' : '1px solid #3b82f6', // blue-500
    '--ck-border-color': error ? 'red' : '#d1d5db', // gray-300
    '--ck-focus-border-color': error ? 'red' : '#3b82f6',
  };

  return (
    <div className="w-full" style={editorStyles}>
      <CKEditor
        editor={ClassicEditor}
        data={value || ""}
        config={{
          placeholder: placeholder || "Start writing here...",
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          // The onChange prop is a function passed from the parent
          if (onChange) {
            onChange(data);
          }
        }}
      />
      {/* Display the error message if it exists */}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default MyCKEditor;