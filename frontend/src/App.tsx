import {useState, createContext} from 'react';

import List from './Views/List';
import SingleDocument from './Views/SingleDocument';
import AddNew from './Views/AddNew';
import Header from './Components/Header';
import Footer from './Components/Footer';



function App(): JSX.Element {
  const [view, setView] = useState("List");
  const [docId, setDocId] = useState("");

  // Function to render the current component using a switch statement
  function renderComponent() {
    switch (view) {
      case "List":
        return <List setView={setView} setDocId={setDocId}/>;
      case "AddNew":
        return <AddNew setView={setView}/>;
      case "Home":
          return <div>Hej och välkommen</div>;
      case "SingleDocument":
        return <SingleDocument id={docId} />;
      default:
        return <div></div>;
    }
  }

  function changeView(newView: string) {
    setView(newView);
  }

  return (
    <>
      <Header/>
      <div className='navbar'>
      <button onClick={() => changeView("Home")}>Home</button>
      <button onClick={() => changeView("List")}>List</button>
      <button onClick={() => changeView("AddNew")}>AddNew</button>
      </div>
      {renderComponent()}
      <Footer/>
    </>
  );
}

export default App;
