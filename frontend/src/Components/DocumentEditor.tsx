import React, { MutableRefObject } from 'react';
import { Socket } from "socket.io-client";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { CommentManager } from './CommentManager';

interface DocumentEditorProps {
  doc: Document;
  setDoc: React.Dispatch<React.SetStateAction<Document>>;
  socket: MutableRefObject<Socket | null>;
  contentRef: React.RefObject<HTMLDivElement>;
  cursorRef: MutableRefObject<number | null>;
  cursorElement: MutableRefObject<string>;
  executionResult: string | null;
  setExecutionResult: React.Dispatch<React.SetStateAction<string | null>>;
}

interface Document {
    _id: string;
    title: string;
    content: string;
    isCode: boolean;
  }

export function DocumentEditor({ 
  doc, 
  setDoc, 
  socket, 
  contentRef, 
  cursorRef, 
  cursorElement,
  executionResult,
  setExecutionResult
}: DocumentEditorProps) {
  /** Handle changes in document content **/
  function handleChange(e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLDivElement> | string) {
    let name: string;
    let value: string;
    cursorElement.current = "title";

    if (typeof e === 'string') {
      name = 'content';
      value = e;
    } else if (e.target instanceof HTMLInputElement) {
      name = e.target.name;
      value = e.target.value;
    } else if (e.currentTarget instanceof HTMLDivElement) {
      name = 'content';
      value = e.currentTarget.innerHTML;
      cursorElement.current = "content";
    } else {
      return;
    }

    const updatedDoc = { ...doc, [name]: value };
    setDoc(updatedDoc);
    if (socket.current) {
      socket.current.emit("doc", updatedDoc);
    }
    if (!doc.isCode) {
      getCursorPosition();
    }
  }

  /** Get current cursor position in content area **/
  function getCursorPosition() {
    const target = contentRef.current;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && target) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(target);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      cursorRef.current = preCaretRange.toString().length;
    }
  }

  /** Toggle between code and text mode **/
  function toggleCodeMode() {
    if (!doc.isCode && !window.confirm("Warning: all comments will be permanently removed, do you want to proceed?")) {
      return;
    }
    const updatedDoc = { ...doc, isCode: !doc.isCode };
    updatedDoc.content = updatedDoc.content.replace(/<\/?span[^>]*>/g, '');
    setDoc(updatedDoc);
    if (socket.current) {
      socket.current.emit("doc", updatedDoc);
    }
  }

  /** Execute the code and display result **/
  async function executeCode() {
    try {
      const base64Code = btoa(doc.content);
      const response = await fetch('https://execjs.emilfolino.se/code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: base64Code }),
      });
      const result = await response.json();
      const decodedOutput = atob(result.data);
      setExecutionResult(decodedOutput);
      console.log('Execution result:', decodedOutput);
    } catch (error) {
      console.error('Error executing code:', error);
      setExecutionResult('Error executing code. Please try again.');
    }
  }

  return (
    <div className="document-form">
      <label htmlFor="title">Titel</label>
      <input
        type="text"
        name="title" 
        id="title-text" 
        value={doc.title}
        onChange={handleChange}
      />
      <label htmlFor="content">Innehåll</label>
      {doc.isCode ? (
        <CodeMirror
          value={doc.content}
          height="200px"
          extensions={[javascript()]}
          onChange={(value) => handleChange(value)}
        />
      ) : (
        <div 
          ref={contentRef}
          id="content-text" 
          contentEditable={true}
          onInput={handleChange}
          dangerouslySetInnerHTML={{ __html: doc.content }}
          style={{ border: '1px solid black', minHeight: '100px', padding: '5px' }}
        />
      )}
      {!doc.isCode && <CommentManager contentRef={contentRef} handleChange={handleChange} />}
      <button onClick={toggleCodeMode}>
        <h3>{doc.isCode ? "Switch to Text Mode" : "Switch to Code Mode"}</h3>
      </button>
      {doc.isCode && (
        <>
          <button onClick={executeCode}>
            <h3>Execute Code</h3>
          </button>
          {executionResult && (
            <div>
              <h3>Execution Result:</h3>
              <pre>{executionResult}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}