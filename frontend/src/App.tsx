import {useState} from 'react';

import List from './Views/List';
import SingleDocument from './Views/SingleDocument';
import AddNew from './Views/AddNew';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Registration from './Components/Registration/Registration';
import Login from './Components/Login/Login';
import UserList from './Components/UserList';



function App(): JSX.Element {
  const [view, setView] = useState("List");
  const [docId, setDocId] = useState("");
  const [count, setCount] = useState(0);

  // Function to handle button click and update the count
  function registerUser(Event: any) {
      alert('Successfully registered');

      setCount(count + 1);
  }

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
      case "Register":
        return <Registration />;
      case "Login":
        return <Login />;
      case "UserList":
        return <UserList />;
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
      <button onClick={() => changeView("Register")}>Register</button>
      <button onClick={() => changeView("Login")}>Login</button>
      <button onClick={() => changeView("UserList")}>UserList</button>
      </div>
      {renderComponent()}
      <Footer/>
    </>
  );
}

export default App;
