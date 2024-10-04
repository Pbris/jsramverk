import {useState, useEffect, useRef} from 'react';
import { BACKEND_URL } from '../connSettings';
import { Socket } from 'socket.io-client';

import { io } from "socket.io-client";

let socket: Socket;

type SingleDocumentProps = {
  id: string
}

type DocsType = {
  _id: string,
  title: string,
  content: string
}

function SingleDocument( {id} : SingleDocumentProps) {
  const [doc, setDocs] = useState({_id: "0", title:"", content:""});
  const [submit, setSubmit] = useState(false);
  const [confirmation, setConfirmation] = useState(false);

  const localChangeRef = useRef(true);

  /**useEffect to fetch data when changing document id **/
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/${id}`);
        const data = await response.json();
        setDocs(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

    /**useEffect to connect to socket when component is created **/
  useEffect(() => {
    socket = io(BACKEND_URL);
    socket.emit("create", id);
    console.log()

    return () => {
      socket.disconnect();
    }

  }, []);

  /**useEffect to update content when submit button is pressed **/
  useEffect(() => {
    const updateDocument = async () => {
      if (submit) {
        await fetch(`${BACKEND_URL}/api/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(doc),
            });
            setSubmit(false);

            setConfirmation(true);
            setTimeout(() => {
              setConfirmation(false);
            }, 3000);
        }
      };
    updateDocument();
  
  }, [submit, doc]);

  /**useEffect to send updated doc content/title to websockets **/
  useEffect(() => {
    if (localChangeRef.current) {
      socket.emit("updateDoc", doc);
    }
  }, [doc]);
  
  /**useEffect to get updated doc content/title from websockets **/
  useEffect(() => {
    socket.on("updateDoc", (newDoc: DocsType) => {
      localChangeRef.current = false;
      setDocs({...newDoc});
    });
  }, [socket]);
  
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmit(true);
  }
    return (
      <>
      <h2>Dokument</h2>
      <form onSubmit={handleSubmit} className="new-doc">
          <label htmlFor="title">Titel</label>
              <input type="text" name="title" id="title-text" value={doc.title}
              onChange={(e) => {
                      localChangeRef.current=true;
                      setDocs({ ...doc, title: e.target.value })
                    }
                  }/>
              <label htmlFor="content">Innehåll</label>
              <textarea name="content" id="content-text" value={doc.content}
              onChange={(e) => {
                      localChangeRef.current=true;
                      setDocs({ ...doc, content: e.target.value })
                    }
                  }></textarea>
          <input type="submit" value="Uppdatera" disabled={submit}/>
      </form>

      {confirmation && (
        <p style={{ color: 'green' }}>Dokumentet har uppdaterats!</p>
      )}

        </>
      );
}

export default SingleDocument;