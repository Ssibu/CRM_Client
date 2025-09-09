import ClassicEditorBase from "@ckeditor/ckeditor5-build-classic";
import SourceEditing from "@ckeditor/ckeditor5-source-editing/src/sourceediting";
import CodeBlock from "@ckeditor/ckeditor5-code-block/src/codeblock";
import Table from "@ckeditor/ckeditor5-table/src/table";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";

class ClassicEditor extends ClassicEditorBase {}

// Add extra plugins
ClassicEditor.builtinPlugins = [
  ...ClassicEditorBase.builtinPlugins,
  SourceEditing,
  CodeBlock,
  Table,
  TableToolbar,
];

// Customize toolbar
ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      "heading", "|",
      "bold", "italic", "underline", "strikethrough", "link", "bulletedList", "numberedList", "|",
      "blockQuote", "insertTable", "uploadImage", "codeBlock", "|",
      "undo", "redo", "|",
      "sourceEditing" // 🔥 this enables HTML editing
    ],
  },
  table: {
    contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  },
  language: "en",
};

export default ClassicEditor;
