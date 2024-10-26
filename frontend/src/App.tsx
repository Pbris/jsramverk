// import {useState} from 'react';

import List from './Views/List';
import SingleDocument from './Views/SingleDocument';
import AddNew from './Views/AddNew';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Registration from './Components/Registration/Registration';
import Login from './Components/Login/Login';
import UserList from './Components/UserList';
import NotFound from './Components/NotFound';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './Components/Navigation';
import Home from './Components/Home';
import { AuthProvider } from './Contexts/AuthContext';


function App(): JSX.Element {
  // const [view, setView] = useState("List");
  // const [docId, setDocId] = useState("");

  // // Function to render the current component using a switch statement
  // function renderComponent() {
  //   switch (view) {
  //     case "List":
  //       return <List setView={setView} setDocId={setDocId}/>;
  //     case "AddNew":
  //       return <AddNew setView={setView}/>;
  //     case "Home":
  //         return <div>Hej och välkommen {localStorage.getItem("email") ? localStorage.getItem("email") : "du okände!" }</div>;
  //     case "SingleDocument":
  //       return <SingleDocument id={docId} />;
  //     case "Register":
  //       return <Registration />;
  //     case "Login":
  //       localStorage.removeItem('token');
  //       return <Login />;
  //     case "UserList":
  //       return <UserList />;
  //     default:
  //       return <div></div>;
  //   }
  // }

  // function changeView(newView: string) {
  //   setView(newView);
  // }

  return (
    <AuthProvider>
      <Router>
        <div>
          <Header />
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />          {/* Route for the Login page */}
            <Route path="/documents" element={<List />} /> {/* Route for the documents page */}
            <Route path="/documents/:docID" element={<SingleDocument />} /> {/* Route for the DocumentDetails page */}
            <Route path="/addnew" element={<AddNew />} />   {/* Route for the AddNew page */}
            <Route path="/register" element={<Registration />} /> {/* Route for the Registration page */}
            <Route path="/login" element={<Login />} />     {/* Route for the Login page */}
            <Route path="*" element={<NotFound />} />       {/* Catch-all route for 404 Not Found */}
            <Route path="/userlist" element={<UserList />} /> {/* Route for the UserList page */}
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
    // <>
    //   <Header/>
    //   <div className='navbar'>
    //   <button onClick={() => changeView("Home")}>Home</button>
    //   <button onClick={() => changeView("List")}>List</button>
    //   <button onClick={() => changeView("AddNew")}>AddNew</button>
    //   <button onClick={() => changeView("Register")}>Register</button>
    //   <button onClick={() => changeView("Login")}>{localStorage.getItem('token') ? 'Logout' : 'Login'} </button>
    //   <button onClick={() => changeView("UserList")}>UserList</button>
    //   </div>
    //   {renderComponent()}
    //   <Footer/>
    // </>
  );
}

export default App;
