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
        <div className="single-doc">
            <ul>
            <li key={doc._id}>{doc._id}</li>
            <li key={doc._id+`title`}>{doc.title}</li>
            <li key={doc.content+`content`}>{doc.content}</li>
            </ul>
        </div>

      );
}

export default SingleDocument;