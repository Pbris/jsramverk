import {useState, useEffect} from 'react';

import './App.css';

import List from './Components/List'
import SingleDocument from './Components/SingleDocument';


function App(): JSX.Element {
  const [view, setView] = useState("List");

  // Function to render the current component using a switch statement
  function renderComponent() {
    switch (view) {
      case "List":
        return <List />;
      case "SingleDocument":
        return <SingleDocument />;
      default:
        return <div>Invalid view selected</div>;
    }
  }

  function changeView(newView: any) {
    setView(newView);
  }

  return (
    <>
    <button onClick={() => changeView("List")}>List</button>
    <button onClick={() => changeView("SingleDocument")}>SingleDocument</button>
    {renderComponent()}
    </>
  );
}

export default App;
