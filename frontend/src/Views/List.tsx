import { useEffect, useState, useContext } from 'react';
import SingleDocument from './SingleDocument';
import { BACKEND_URL } from '../connSettings';


// Define an interface for your item structure
interface Item {
  _id: string;  // or number, depending on your data
  title: string;
  // Add other properties as needed
}


function List() {
  // Explicitly type the state
  const [items, setItems] = useState<Item[]>([]);
  const [singleView, setSingleView] = useState("List");
  const [documentId, setDocumentId] = useState("");
  
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

  // function returnView()
  // {
  //   if (singleView === "SingleDocument") {
  //     return <SingleDocument id={documentId}/>
  //   }
  //   else if(singleView ==="List")
  //   {
  //     return <ul>
  //       {
  //       items.map(item => 
  //       <li key={item._id}>
  //       <button onClick={() =>
  //       showSingleDocument(item._id)}>
  //         {item.title}
  //         </button>
  //         </li>)  
  //         }
  //     </ul>
  //   }
  // }


  function showSingleDocument(id: string)
  {
    setSingleView("SingleDocument");
    setDocumentId(i => i=id);
  }

  function showListView()
  {
    setSingleView("List");
  }

  // return (<>
  //   {returnView}
  //   </>
  // );

  if (singleView === "SingleDocument") {
    return (
      <div>
        <button onClick={showListView}>Back to List</button>
        <SingleDocument id={documentId} />
        </div>
    );
  }

  return (
    <div>
      <h2>Document List</h2>
      <ul>
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
