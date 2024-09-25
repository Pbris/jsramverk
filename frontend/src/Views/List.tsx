import { useEffect, useState } from 'react';
import { BACKEND_URL } from '../connSettings';


// Define an interface for your item structure
interface Item {
  _id: string;  // or number, depending on your data
  title: string;
  // Add other properties as needed
}


function List(props: any) {
  // Explicitly type the state
  const [items, setItems] = useState<Item[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api`);
        const data: Item[] = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();

  }, []);


  function showSingleDocument(id: string)
  {
    props.setDocId(id);
    props.setView("SingleDocument");
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
