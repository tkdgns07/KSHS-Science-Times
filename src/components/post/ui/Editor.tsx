'use client';

import React, { useEffect, useRef, useState } from 'react';

import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import InlineCode from '@editorjs/inline-code';
import Table from '@editorjs/table';
import Marker from '@editorjs/marker';
import Delimiter from '@editorjs/delimiter';
import Warning from '@editorjs/warning';
import Checklist from '@editorjs/checklist';
import Code from '@editorjs/code';
import Quote from '@editorjs/quote';
import RawTool from '@editorjs/raw';
import SimpleImage from '@editorjs/simple-image';
import ImageTool from '@editorjs/image';
import AttachesTool from '@editorjs/attaches';

interface EditorProps {
  initialContent?: any;
  onChange?: (data: any) => void;
  readOnly? : boolean
}

const Editor: React.FC<EditorProps> = ({ initialContent = { blocks: [] }, onChange, readOnly = false }) => {
  const editorRef = useRef<any | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || editorRef.current) return;

    const initializeEditor = async () => {
      const EditorJS = (await import('@editorjs/editorjs')).default;

      const editor = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: Header,
          list: List,
          embed: Embed,
          inlineCode: InlineCode,
          table: Table,
          marker: Marker,
          delimiter: Delimiter,
          warning: Warning,
          checklist: Checklist,
          code: Code,
          quote: Quote,
          raw: RawTool,
          simpleImage: SimpleImage,
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: '/api/media/upload/im',
              },
              field: 'file',
              types: 'image/*',
            },
          },
          attaches: {
            class: AttachesTool,
            config: {
              endpoint: '/api/media/upload/file',
              field: 'file',
            },
          },
        },
        data: initialContent,
        placeholder: '여기에 내용을 입력하세요...',
        onReady: () => {
          console.log('Editor.js is ready!');
        },
        onChange: async () => {
          if (onChange) {
            const content = await editor.save();
            onChange(content);
          }
        },
        readOnly : readOnly,
      });

      editorRef.current = editor;
    };

    initializeEditor();

    return () => {
      if (editorRef.current && typeof editorRef.current.destroy === 'function') {
        console.log('Cleaning up Editor.js instance...');
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [isClient]);

  return (
    <div className='w-full'>
      <div id="editorjs" className="p-4 w-full"></div>
    </div>
  );
};

export default Editor;
