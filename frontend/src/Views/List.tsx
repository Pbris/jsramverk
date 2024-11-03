import { useEffect, useState, useRef } from 'react';
import { BACKEND_URL } from '../connSettings';
import { useNavigate } from 'react-router-dom';


interface Item {
  _id: string; 
  title: string;
}


function List() {
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
          if (response.ok) {
            if (result.data && result.data.documents) {
              setItems(result.data.documents);
            } else {
              console.error("Authentication failed", result.errors?.[0]?.message || "Unknown error");
              navigate('/login');
            }
          } else {
            console.error('Error fetching data:', result.errors);
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
  }, [navigate]);



  function showSingleDocument(id: string) {
    navigate(`/documents/${id}`);
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
