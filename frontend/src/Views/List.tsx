import { useEffect, useState, useRef } from 'react';
import { BACKEND_URL } from '../connSettings';
import { useNavigate } from 'react-router-dom';


// Define an interface for your item structure
interface Item {
  _id: string;  // or number, depending on your data
  title: string;
  // Add other properties as needed
}


function List(props: any) {
  // Explicitly type the state
  const [items, setItems] = useState<Item[]>([]);
  const navigate = useNavigate();
  const effectRan = useRef(false);

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
            body: JSON.stringify({ query: "{ documents { _id title content isCode } }" })
          });
          const result = await response.json();
          if (result.data && result.data.documents) {
            setItems(result.data.documents);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      fetchData();
    }
    return () => {
      effectRan.current = true;
    };
  }, []);



  function showSingleDocument(id: string)
  {
    navigate(`/documents/${id}`);
    // props.setDocId(id);
    // props.setView("SingleDocument");
  }

  return (
    <div>
      <h2>Document List</h2>
      <ul className='list-doc'>
        {items.map(item => (
          <li key={item._id}>
            <button onClick={() => showSingleDocument(item._id)}>
              {item.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default List;
