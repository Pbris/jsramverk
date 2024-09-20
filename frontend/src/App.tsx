import {useState, useEffect} from 'react';

import './App.css';

import List from './Components/List'
import SingleDocument from './Components/SingleDocument';
import AddNew from './Components/AddNew';

function App(): JSX.Element {
  const [view, setView] = useState("List");

  // Function to render the current component using a switch statement
  function renderComponent() {
    switch (view) {
      case "List":
        return <List />;
      case "SingleDocument":
        return <SingleDocument />;
      case "AddNew":
        return <AddNew />;
      case "Home":
          return <div>Hej och välkommen</div>;
      default:
        return <div></div>;
    }
  }

  function changeView(newView: any) {
    setView(newView);
  }

  return (
    <>
      <button onClick={() => changeView("Home")}>Home</button>
      <button onClick={() => changeView("List")}>List</button>
      <button onClick={() => changeView("SingleDocument")}>SingleDocument</button>
      <button onClick={() => changeView("AddNew")}>AddNew</button>
      {renderComponent()}
    </>
  );
}

export default App;
