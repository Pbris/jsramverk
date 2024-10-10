import { useState, useEffect, useRef } from 'react';
import { io, Socket } from "socket.io-client";
import { BACKEND_URL } from '../connSettings';

interface Document {
  _id: string;
  title: string;
  content: string;
}


function SingleDocument(props: { id: string }) {
  const [doc, setDoc] = useState({ _id: "", title: "", content: "" });
  const socket = useRef<Socket | null>(null);
  const cursorPositionRef = useRef<number | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

    /** fetch data **/
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
  }, [props.id]);

  /** connect to socket, join room **/
  useEffect(() => {
    socket.current = io(BACKEND_URL);
    // Join a room based on the document ID
    socket.current.emit("create", props.id);
    socket.current?.on("doc", (updatedDoc: Document) => {
      setDoc(updatedDoc);

    });

    return () => {
      socket.current?.disconnect();
    }
  }, []);
  
    /** Move cursor position to original state**/
    useEffect(() => {
      if (contentRef.current) {
        contentRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
      }
  
      if (titleRef.current) {
        titleRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
      }
    }, [doc]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    const updatedDoc = { ...doc, [name]: value };
    cursorPositionRef.current = e.target.selectionStart;

    if (socket.current) {
      socket.current.emit("doc", updatedDoc);
    }
  }

  return (
    <>
      <h2>Dokument</h2>
      <div className="document-form">
        <label htmlFor="title">Titel</label>
        <input
          ref={titleRef}
          type="text" 
          name="title" 
          id="title-text" 
          value={doc.title}
          onChange={handleChange}
        />
        <label htmlFor="content">Innehåll</label>
        <textarea
          ref={contentRef}
          name="content" 
          id="content-text" 
          value={doc.content}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="editor-text">
        <div className="edit-title">
        {doc.title}
        </div>
        <div className="editor-content" dangerouslySetInnerHTML={{__html: doc.content}}>
        </div>
      </div>
    </>
  );
}

export default SingleDocument;