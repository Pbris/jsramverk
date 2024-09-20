import {useState, useEffect} from 'react';

// Define an interface for your item structure
interface Docs {
    _id: string;  // or number, depending on your data
    title: string;
    content: string;
    // Add other properties as needed
  }


function SingleDocument() {
    // const [doc, setDocs] = useState<Docs[]>([]);
    const [doc, setDocs] = useState({_id: 0, title:"", content:""});

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:1337/api/66e4061776c7528cfa0b4840');
          
        //   const data: Docs[] = await response.json();
        const data = await response.json();
          setDocs(data);
          console.log(data);
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
            <li key={doc.title}>{doc.title}</li>
            <li key={doc.content}>{doc.content}</li>
            </ul>
        </div>

      );
}

export default SingleDocument;