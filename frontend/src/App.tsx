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

  return (
    
    <AuthProvider>
      <Router basename={process.env.REACT_APP_BASE_NAME}>
        <div>
          <Header />
          <Navigation />
          <Routes>
        <Route>
          <Route index element={<Home />} />          
          <Route path="documents">
            <Route index element={<List />} />
            <Route path=":docID" element={<SingleDocument />} />
          </Route>
          <Route path="addnew" element={<AddNew />} />
          <Route path="register" element={<Registration />} />
          <Route path="login" element={<Login />} />
          <Route path="userlist" element={<UserList />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
