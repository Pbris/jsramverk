import { log } from 'console';
import React, { useEffect, useState } from 'react';

// Define an interface for your item structure
interface Item {
  id: string;  // or number, depending on your data
  title: string;
  // Add other properties as needed
}

function List() {
  // Explicitly type the state
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/list');
        console.log(response);
        
        const data: Item[] = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.title}</li>)}
    </ul>
  );
}

export default List;
