import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from '../connSettings';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import InviteEmailComponent from '../Components/InviteEmailComponent';
import { useParams } from 'react-router-dom';

interface Document {
  _id: string;
  title: string;
  content: string;
  isCode: boolean;
}

function SingleDocument() {
  const { docID } = useParams<{docID: string}>();
  const [doc, setDoc] = useState<Document>({ _id: "", title: "", content: "", isCode: false });
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const socket = useRef<Socket | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<number | null>(null);
  const cursorElement = useRef<string>("title");
  const effectRan = useRef(false);

  /** Fetch document data  **/
  useEffect(() => {
    if (effectRan.current === false) {
    const fetchData = async () => {
        try {
          console.log(docID);
          // const response = await fetch(`${BACKEND_URL}/api/${props.id}`);
          // const data = await response.json();
          // setDoc(data);

          const response = await fetch(`${BACKEND_URL}/graphql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
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

      // socket.current = io(BACKEND_URL);
      // socket.current.emit("create", props.id);
      // socket.current?.on("doc", (updatedDoc: Document) => {
      //   setDoc(updatedDoc);
      // });
    }

    return () => {
      // socket.current?.disconnect();
      effectRan.current = true;
    }
  }, [docID]);

  /** Set up socket connection **/
  useEffect(() => {

      socket.current = io(BACKEND_URL);
      socket.current.emit("create", docID);
      socket.current?.on("doc", (updatedDoc: Document) => {
        setDoc(updatedDoc);
      });
  
    return () => {
      socket.current?.disconnect();
    }
  }, [docID]);



  /** Set cursor position in content area **/
  useEffect(() => {
    if (cursorElement.current === "content" && !doc.isCode) {
      setCursorPosition();
    }
  }, [doc])

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
      console.log("Cursor position  :", cursorRef.current);
    }
  }

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

  /** Add a comment to selected text **/
  function addComment() {
    const selection = window.getSelection();
    if (selection && !selection.isCollapsed && contentRef.current) {
      const range = selection.getRangeAt(0);
      const commentId = Date.now().toString();
      const commentText = prompt("Enter your comment") || "";
      
      const span = document.createElement('span');
      span.id = `comment-${commentId}`;
      span.title = commentText;
      range.surroundContents(span);

      handleChange({ currentTarget: contentRef.current } as React.FormEvent<HTMLDivElement>);

      selection.removeAllRanges();
    }
  }

  /** Display all comments in document **/
  function showComments() {
    const spanTags = document.getElementsByTagName('span');
    const commentList = document.getElementById("comments-list");
    if (commentList) {
      commentList.innerHTML = "";
    }

    if (spanTags.length > 0) {
      const header = document.createElement('h3');
      header.innerHTML = "Click a comment to remove it:";
      commentList?.appendChild(header);
    }

    Array.from(spanTags).forEach((span) => {
      let listObject = document.createElement('button');
      listObject.onclick = (event) => deleteComment(event, span);
      
      listObject.innerText = span.textContent ?? "Tomt";
      commentList?.appendChild(listObject);
    });
  }

  /** Delete a comment from document **/
  function deleteComment(event: MouseEvent, span: HTMLElement) {
    var text = document.createTextNode(span.innerHTML);
    span.parentNode?.insertBefore(text, span);
    span.remove();
    if (event.target instanceof HTMLElement) {
      event.target.remove();
    }

    handleChange({ currentTarget: contentRef.current } as React.FormEvent<HTMLDivElement>);
  }

  /** Toggle between code and text mode **/
  function toggleCodeMode() {
    const updatedDoc = { ...doc, isCode: !doc.isCode };
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
    <>
      <h2>Dokument</h2>
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
        {!doc.isCode && <button onClick={addComment}><h3>Add Comment</h3></button>}
      </div>
      <InviteEmailComponent docId={doc._id}/>
      {console.log(doc._id)}
      {console.log(doc.title)}
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
      {!doc.isCode && (
        <button onClick={showComments}>
          <h3>Show/delete comments</h3>
        </button>
      )}
      <div id="comments-list"></div>
      <style>{`
        #content-text span[id^="comment-"] {
          background-color: yellow;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

export default SingleDocument;