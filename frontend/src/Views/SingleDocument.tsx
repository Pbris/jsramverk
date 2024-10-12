import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from '../connSettings';

interface Document {
  _id: string;
  title: string;
  content: string;
}

function SingleDocument(props: { id: string }) {
  const [doc, setDoc] = useState<Document>({ _id: "", title: "", content: "" });
  const socket = useRef<Socket | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<number | null>(null);
  const cursorElement = useRef<string>("title");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/${props.id}`);
        const data = await response.json();
        setDoc(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

    socket.current = io(BACKEND_URL);
    socket.current.emit("create", props.id);
    socket.current?.on("doc", (updatedDoc: Document) => {
      setDoc(updatedDoc);
    });

    return () => {
      socket.current?.disconnect();
    }
  }, [props.id]);


  useEffect(() => {
    if (cursorElement.current === "content") {
      setCursorPosition();
    }
  }, [doc])

  function handleChange(e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLDivElement>) {
    let name: string;
    let value: string;
    cursorElement.current = "title";
    if (e.target === contentRef.current) {
      cursorElement.current = "content";
    }

    if (e.target instanceof HTMLInputElement) {
      name = e.target.name;
      value = e.target.value;
    } else if (e.currentTarget instanceof HTMLDivElement) {
      name = 'content';
      value = e.currentTarget.innerHTML;
    } else {
      return;
    }

    const updatedDoc = { ...doc, [name]: value };
    setDoc(updatedDoc);
    if (socket.current) {
      socket.current.emit("doc", updatedDoc);
    }
    getCursorPosition();
  }

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


  function setCursorPosition() {
    if (!contentRef.current || cursorRef.current === null) return;
  
    const range = document.createRange();
    const sel = window.getSelection();
    let currentOffset = 0;
  
    const walker = document.createTreeWalker(contentRef.current, NodeFilter.SHOW_TEXT);
    let node;
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

  function showComments() {
    const selection = window.getSelection();
    const spanTags = document.getElementsByTagName('span'); // returns an HTMLCollection
    const commentList = document.getElementById("comments-list");
    if (commentList) {
      commentList.innerHTML = "";
    }

    Array.from(spanTags).forEach((span) => {
      // console.log(span);
      console.log(span.innerHTML + "inner");
      
      let listObject = document.createElement('button');
      listObject.onclick = (event) => deleteComment(event, span);
      
      listObject.innerText = span.textContent ?? "Tomt";
      commentList?.appendChild(listObject);
      // console.log(span.textContent);
    });

    if (selection && !selection.isCollapsed && contentRef.current) {

    }
  }

  function deleteComment(event: MouseEvent, span: HTMLElement) {
    var text = document.createTextNode(span.innerHTML);
    span.parentNode?.insertBefore(text, span);
    span.remove();
    if (event.target instanceof HTMLElement) {
      event.target.remove();
    }

    handleChange({ currentTarget: contentRef.current } as React.FormEvent<HTMLDivElement>);
    
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
        <div 
          ref={contentRef}
          id="content-text" 
          contentEditable={true}
          onInput={handleChange}
          dangerouslySetInnerHTML={{ __html: doc.content }}
          style={{ border: '1px solid black', minHeight: '100px', padding: '5px' }}
        />
        <button onClick={addComment}>Add Comment</button>
      </div>
      <button onClick={showComments}>
        Show comments
      </button>
      <div id="comments-list"></div>
      <style>{`
        #content-text span[id^="comment-"] {
          background-color: yellow;
          cursor: pointer;
        }
        #content-text span[id^="comment-"]::after {
          content: " 💬";
          font-size: 0.8em;
        }
      `}</style>
    </>
  );
}

export default SingleDocument;