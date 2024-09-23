import {useState, useEffect} from 'react';
import { BACKEND_URL } from '../connSettings';

function SingleDocument(props: { id: string }) {
  const [doc, setDocs] = useState({_id: 0, title:"", content:""});
  const [submit, setSubmit] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/${props.id}`);
        const data = await response.json();
        setDocs(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [props.id]);

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
        }
    };
    updateDocument();
  }, [submit, doc]);

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
              onChange={(e) => setDocs({ ...doc, title: e.target.value })}/>
              <label htmlFor="content">Innehåll</label>
              <textarea name="content" id="content-text" value={doc.content}
              onChange={(e) => setDocs({ ...doc, content: e.target.value })}></textarea>
          <input type="submit" value="Uppdatera" disabled={submit}/>
      </form>
        </>
      );
}

export default SingleDocument;