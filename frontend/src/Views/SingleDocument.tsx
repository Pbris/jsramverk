import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from '../connSettings';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import InviteEmailComponent from '../Components/InviteEmailComponent';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { DocumentEditor } from '../Components/DocumentEditor';
import { CommentManager } from '../Components/CommentManager';

interface Document {
  _id: string;
  title: string;
  content: string;
  isCode: boolean;
}

function SingleDocument() {
  const { docID } = useParams<{ docID: string }>();
  const [doc, setDoc] = useState<Document>({ _id: "", title: "", content: "", isCode: false });
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const socket = useRef<Socket | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<number | null>(null);
  const cursorElement = useRef<string>("title");
  const effectRan = useRef(false);
  const [submit, setSubmit] = useState(false);
  const navigate = useNavigate();

  /** Fetch document data  **/
  useEffect(() => {
    if (effectRan.current === false) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${BACKEND_URL}/graphql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` }),
            },
            body: JSON.stringify({ query: `{ document(id: "${docID}") { _id title content isCode } }` })
          });
          const result = await response.json();
          if (result.data && result.data.document) {
            setDoc(result.data.document);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }

    return () => {
      effectRan.current = true;
    }
  }, [docID]);

  /** Set up socket connection **/
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      console.log("token: " + token);
      socket.current = io(BACKEND_URL, {
        auth: {
          token: token,
        }
      });

      socket.current.emit("create", docID);
      socket.current?.on("doc", (updatedDoc: Document) => {
        setDoc(updatedDoc);
      });
    }
    return () => {
      socket.current?.disconnect();
    }
  }, [docID]);

  // Delete a document
  useEffect(() => {
    const deleteDocument = async () => {
      if (submit) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${BACKEND_URL}/api/${docID}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              ...(token && { 'Authorization': `Bearer ${token}` }),
            },
          });

          if (response.ok) {
            setSubmit(false);
            navigate('/documents');
          } else {
            console.error('Failed to delete document');
          }
        } catch (error) {
          console.error('Error deleting document:', error);
          setSubmit(false);
        }
      }
    };
    deleteDocument();
  }, [submit, doc]);

  /** Set cursor position in content area **/
  useEffect(() => {
    if (cursorElement.current === "content" && !doc.isCode) {
      setCursorPosition();
    }
  }, [doc])

  /** Set cursor position in content area **/
  function setCursorPosition() {
    if (!contentRef.current || cursorRef.current === null) return;

    const range = document.createRange();
    const sel = window.getSelection();
    let currentOffset = 0;

    const walker = document.createTreeWalker(contentRef.current, NodeFilter.SHOW_TEXT);
    let node;
    // eslint-disable-next-line no-cond-assign
    while (node = walker.nextNode()) {
      const nodeLength = node.textContent?.length || 0;
      if (currentOffset + nodeLength >= cursorRef.current) {
        range.setStart(node, cursorRef.current - currentOffset);
        range.collapse(true);
        sel?.removeAllRanges();
        sel?.addRange(range);
        break;
      }
      currentOffset += nodeLength;
    }
  }

  return (
    <>
      <h2>Dokument</h2>
      <DocumentEditor
        doc={doc}
        setDoc={setDoc}
        socket={socket}
        contentRef={contentRef}
        cursorRef={cursorRef}
        cursorElement={cursorElement}
        executionResult={executionResult}
        setExecutionResult={setExecutionResult}
      />
      <InviteEmailComponent docId={doc._id} />
      <button
        onClick={() => {
          if (window.confirm('Are you sure you want to delete this document?')) {
            setSubmit(true);
          }
        }}
        style={{ backgroundColor: '#ff4444' }}
      >
        <h3>Delete Document</h3>
      </button>
    </>
  );
}

export default SingleDocument;