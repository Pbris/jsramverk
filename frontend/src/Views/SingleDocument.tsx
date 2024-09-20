import {useState, useEffect} from 'react';
import { BACKEND_URL } from '../connSettings';
import PropTypes from 'prop-types';
// Define an interface for your item structure
interface Docs {
    _id: string;  // or number, depending on your data
    title: string;
    content: string;
    // Add other properties as needed
  }


function SingleDocument(props: { id: string }) {
    // const [doc, setDocs] = useState<Docs[]>([]);
    const [doc, setDocs] = useState({_id: 0, title:"", content:""});

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${BACKEND_URL}/api/${props.id}`);
          
        //   const data: Docs[] = await response.json();
        const data = await response.json();
          setDocs(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);

    return (

      <>
      <h2>Dokument</h2>
      <form className="new-doc">
          <label htmlFor="title">Titel</label>
              <input type="text" name="title" id="title-text" value={doc.title}
              onChange={(e) => setDocs({ ...doc, title: e.target.value })}/>
              <label htmlFor="content">Innehåll</label>
              <textarea name="content" id="content-text" value={doc.content}
              onChange={(e) => setDocs({ ...doc, content: e.target.value })}></textarea>
          <input type="submit" value="Uppdatera"/>
      </form>
        </>
      );
}

export default SingleDocument;