
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
            shouldNotGroupWhenFull: true
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
            TextPartLanguage, TextTransformation, TodoList, Underline, WordCount
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