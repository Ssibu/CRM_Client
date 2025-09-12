
// import React, { useRef, useState, useEffect } from "react";
// import {
//   Bold, Italic, Underline, Strikethrough, Paintbrush2,
//   List, ListOrdered, AlignLeft, Table, Link2, Image as ImageIcon,
//   Code, XCircle, HelpCircle
// } from "lucide-react";
// import ToolbarButton from "./ToolbarButton"; // Assumes ToolbarButton is in a separate file

// const RichTextEditor = ({ value, onChange, placeholder, error }) => {
//   const editorRef = useRef(null);
//   const [activeFormats, setActiveFormats] = useState(new Set());

//   // This useEffect prevents the "reversed text" bug by only setting HTML
//   // if the value prop is different from the editor's current content.
//   useEffect(() => {
//     const editor = editorRef.current;
//     if (editor && value !== editor.innerHTML) {
//       editor.innerHTML = value || "";
//     }
//   }, [value]);

//   const updateActiveFormats = () => {
//     const formats = new Set();
//     if (document.queryCommandState("bold")) formats.add("bold");
//     if (document.queryCommandState("italic")) formats.add("italic");
//     if (document.queryCommandState("underline")) formats.add("underline");
//     if (document.queryCommandState("strikeThrough")) formats.add("strikeThrough");
//     if (document.queryCommandState("insertOrderedList")) formats.add("insertOrderedList");
//     if (document.queryCommandState("insertUnorderedList")) formats.add("insertUnorderedList");
//     setActiveFormats(formats);
//   };

//   const executeCommand = (command, value = null) => {
//     document.execCommand(command, false, value);
//     editorRef.current.focus();
//     updateActiveFormats();
//   };

//   const handleInput = () => {
//     if (onChange && editorRef.current) {
//       onChange(editorRef.current.innerHTML);
//     }
//     updateActiveFormats();
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const text = e.clipboardData.getData("text/plain");
//     document.execCommand("insertText", false, text);
//   };

//   const insertLink = () => {
//     const url = prompt("Enter URL:");
//     if (url) executeCommand("createLink", url);
//   };

//   const insertImage = () => {
//     const url = prompt("Enter image URL:");
//     if (url) executeCommand("insertImage", url);
//   };

//   const insertTable = () => {
//     const rows = parseInt(prompt("Number of rows:") || 2, 10);
//     const cols = parseInt(prompt("Number of columns:") || 2, 10);
//     if (isNaN(rows) || isNaN(cols) || rows <= 0 || cols <= 0) return;
    
//     let table = '<table style="border-collapse: collapse; width: 100%; border: 1px solid #ccc;">';
//     for (let i = 0; i < rows; i++) {
//       table += "<tr>";
//       for (let j = 0; j < cols; j++) {
//         table += '<td style="padding: 8px; border: 1px solid #ccc;">&nbsp;</td>';
//       }
//       table += "</tr>";
//     }
//     table += "</table>";
//     executeCommand("insertHTML", table);
//   };

//   // Conditionally set classes for the border based on the error prop
//   const containerClasses = `w-full border rounded-md focus-within:ring-2 focus-within:ring-blue-500 ${
//     error ? 'border-red-500' : 'border-gray-300'
//   }`;
  
//   const editorClasses = `w-full px-3 py-3 min-h-[160px] bg-white overflow-y-auto relative rounded-b-md outline-none`;

//   return (
//     <div className="w-full">
//       <div className={containerClasses}>
//         <div className="px-2 py-1.5 bg-gray-50 flex items-center gap-1 border-b flex-wrap rounded-t-md">
//             <ToolbarButton title="Bold" icon={Bold} active={activeFormats.has("bold")} onClick={() => executeCommand("bold")} />
//             <ToolbarButton title="Italic" icon={Italic} active={activeFormats.has("italic")} onClick={() => executeCommand("italic")} />
//             <ToolbarButton title="Underline" icon={Underline} active={activeFormats.has("underline")} onClick={() => executeCommand("underline")} />
//             <ToolbarButton title="Strikethrough" icon={Strikethrough} active={activeFormats.has("strikeThrough")} onClick={() => executeCommand("strikeThrough")} />
//             <ToolbarButton title="Text Color" icon={Paintbrush2} onClick={() => {
//               const color = prompt("Enter color (e.g., #FF0000 or red):");
//               if (color) executeCommand("foreColor", color);
//             }} />
//             <ToolbarButton title="Unordered List" icon={List} active={activeFormats.has("insertUnorderedList")} onClick={() => executeCommand("insertUnorderedList")} />
//             <ToolbarButton title="Ordered List" icon={ListOrdered} active={activeFormats.has("insertOrderedList")} onClick={() => executeCommand("insertOrderedList")} />
//             <ToolbarButton title="Align Left" icon={AlignLeft} onClick={() => executeCommand("justifyLeft")} />
//             <ToolbarButton title="Insert Table" icon={Table} onClick={insertTable} />
//             <ToolbarButton title="Insert Link" icon={Link2} onClick={insertLink} />
//             <ToolbarButton title="Insert Image" icon={ImageIcon} onClick={insertImage} />
//             <ToolbarButton title="Code Block" icon={Code} onClick={() => executeCommand("formatBlock", "pre")} />
//             <ToolbarButton title="Clear Formatting" icon={XCircle} onClick={() => executeCommand("removeFormat")} />
//             <ToolbarButton title="Help" icon={HelpCircle} onClick={() => {
//               alert("Shortcuts:\nCtrl+B: Bold\nCtrl+I: Italic\nCtrl+U: Underline");
//             }} />
//         </div>

//         <div
//           ref={editorRef}
//           contentEditable
//           dir="ltr"
//           onInput={handleInput}
//           onPaste={handlePaste}
//           onKeyUp={updateActiveFormats}
//           onMouseUp={updateActiveFormats}
//           onFocus={updateActiveFormats}
//           suppressContentEditableWarning
//           className={editorClasses}
//         >
//         </div>
//       </div>
      
//       {/* Display the error message if it exists */}
//       {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
//     </div>
//   );
// };

// export default RichTextEditor;




import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
    ClassicEditor,
    Alignment,
    AutoImage,
    AutoLink,
    Autosave,
    Base64UploadAdapter,
    BlockQuote,
    Bold,
    Bookmark,
    Code,
    CodeBlock,
    Emoji,
    Essentials,
    FindAndReplace,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    FullPage,
    Fullscreen,
    GeneralHtmlSupport,
    Heading,
    Highlight,
    HorizontalLine,
    HtmlComment,
    HtmlEmbed,
    ImageBlock,
    ImageCaption,
    ImageInline,
    ImageInsert,
    ImageInsertViaUrl,
    ImageResize,
    ImageStyle,
    ImageTextAlternative,
    ImageToolbar,
    ImageUpload,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    Mention,
    PageBreak,
    Paragraph,
    PasteFromOffice,
    PlainTableOutput,
    RemoveFormat,
    SourceEditing,
    SpecialCharacters,
    SpecialCharactersArrows,
    SpecialCharactersCurrency,
    SpecialCharactersEssentials,
    SpecialCharactersLatin,
    SpecialCharactersMathematical,
    SpecialCharactersText,
    Strikethrough,
    Style,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableLayout,
    TableProperties,
    TableToolbar,
    TextPartLanguage,
    TextTransformation,
    Title,
    TodoList,
    Underline,
    WordCount
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css';

import './Editor.css';



const LICENSE_KEY = 'GPL'; 

const RichTextEditor = ({ value, onChange, placeholder, error }) => {
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const editorWordCountRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);

    useEffect(() => {
        setIsLayoutReady(true);
        return () => setIsLayoutReady(false);
    }, []);

    const editorConfig = useMemo(() => ({
        toolbar: {
            items: [
                'undo', 'redo', '|', 'sourceEditing', 'findAndReplace', 'textPartLanguage', 'fullscreen', '|',
                'heading', 'style', '|', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
                'bold', 'italic', 'underline', 'strikethrough', 'subscript', 'superscript', 'code', 'removeFormat', '|',
                'emoji', 'specialCharacters', 'horizontalLine', 'pageBreak', 'link', 'bookmark', 'insertImage',
                'mediaEmbed', 'insertTable', 'highlight', 'blockQuote', 'codeBlock', 'htmlEmbed', '|',
                'alignment', '|', 'bulletedList', 'numberedList', 'todoList', 'outdent', 'indent'
            ],
            shouldNotGroupWhenFull: false
        },
        plugins: [
            Alignment, AutoImage, AutoLink, Autosave, Base64UploadAdapter, BlockQuote, Bold, Bookmark, Code, CodeBlock,
            Emoji, Essentials, FindAndReplace, FontBackgroundColor, FontColor, FontFamily, FontSize, FullPage, Fullscreen,
            GeneralHtmlSupport, Heading, Highlight, HorizontalLine, HtmlComment, HtmlEmbed, ImageBlock, ImageCaption,
            ImageInline, ImageInsert, ImageInsertViaUrl, ImageResize, ImageStyle, ImageTextAlternative, ImageToolbar,
            ImageUpload, Indent, IndentBlock, Italic, Link, LinkImage, List, ListProperties, MediaEmbed, Mention, PageBreak,
            Paragraph, PasteFromOffice, PlainTableOutput, RemoveFormat, SourceEditing, SpecialCharacters,
            SpecialCharactersArrows, SpecialCharactersCurrency, SpecialCharactersEssentials, SpecialCharactersLatin,
            SpecialCharactersMathematical, SpecialCharactersText, Strikethrough, Style, Subscript, Superscript, Table,
            TableCaption, TableCellProperties, TableColumnResize, TableLayout, TableProperties, TableToolbar,
            TextPartLanguage, TextTransformation, Title, TodoList, Underline, WordCount
        ],
        fontFamily: {
            supportAllValues: true
        },
        fontSize: {
            options: [10, 12, 14, 'default', 18, 20, 22],
            supportAllValues: true
        },
        fullscreen: {
            onEnterCallback: container =>
                container.classList.add(
                    'editor-container', 'editor-container_classic-editor', 'editor-container_include-style',
                    'editor-container_include-word-count', 'editor-container_include-fullscreen', 'main-container'
                )
        },
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
        },
        htmlSupport: {
            allow: [{
                name: /.*/,
                styles: true,
                attributes: true,
                classes: true
            }]
        },
        image: {
            toolbar: [
                'toggleImageCaption', 'imageTextAlternative', '|', 'imageStyle:inline',
                'imageStyle:wrapText', 'imageStyle:breakText', '|', 'resizeImage'
            ]
        },
        licenseKey: LICENSE_KEY,
        link: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            decorators: {
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true
            }
        },
        mention: {
            feeds: [{
                marker: '@',
                feed: [
                     // See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html 
                ]
            }]
        },
        placeholder: placeholder || 'Type or paste your content here!',
        style: {
            definitions: [
                { name: 'Article category', element: 'h3', classes: ['category'] },
                { name: 'Title', element: 'h2', classes: ['document-title'] },
                { name: 'Subtitle', element: 'h3', classes: ['document-subtitle'] },
                { name: 'Info box', element: 'p', classes: ['info-box'] },
                { name: 'CTA Link Primary', element: 'a', classes: ['button', 'button--green'] },
                { name: 'CTA Link Secondary', element: 'a', classes: ['button', 'button--black'] },
                { name: 'Marker', element: 'span', classes: ['marker'] },
                { name: 'Spoiler', element: 'span', classes: ['spoiler'] }
            ]
        },
        table: {
            contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties']
        }
    }), [placeholder]);

    const containerClasses = [
        "editor-container",
        "editor-container_classic-editor",
        "editor-container_include-style",
        "editor-container_include-word-count",
        "editor-container_include-fullscreen",
        "border",
        "rounded-md",
        "focus-within:ring-2",
        "focus-within:ring-blue-500",
        error ? 'border-red-500' : 'border-gray-300'
    ].join(' ');
    
    if (!isLayoutReady) {
        return null; 
    }

    return (
        <div  className='w-full' >
            <div className={`${containerClasses}`} ref={editorContainerRef}>
                <div className="editor-container__editor ">
                    <div ref={editorRef}   >
                        <CKEditor
                            editor={ClassicEditor}
                            config={editorConfig}
                            data={value || ''}
                            onReady={editor => {
                                if (editorWordCountRef.current) {
                                    const wordCountPlugin = editor.plugins.get('WordCount');
                                    editorWordCountRef.current.appendChild(wordCountPlugin.wordCountContainer);
                                }
                            }}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                if (onChange) {
                                    onChange(data);
                                }
                            }}
                            onAfterDestroy={() => {
                                if (editorWordCountRef.current) {
                                    Array.from(editorWordCountRef.current.children).forEach(child => child.remove());
                                }
                            }}
                        />
                    </div>
                </div>
                <div className="editor_container__word-count" ref={editorWordCountRef}></div>
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}

export default RichTextEditor ;