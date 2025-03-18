import { useState, useEffect } from 'react'
import './App.css'
// import axios from 'axios';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from './Pages/Home';
import Header from './Components/Header';
import NavBar from './Components/Navbar';
import Footer from './Components/Footer';
import MapPage from './Pages/Map';
import ListPage from './Pages/List';
import ProfilePage from './Pages/Profile';
import LoginPage from './Pages/Login';


function App() {
  // const [users, setUsers] = useState([])

  // const fetchAPI = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:3080/api/users");
  //     console.log(response.data.users);
  //     setUsers(response.data.users);
  //   } catch (err) {
  //     console.error("Error fetching data:", err);
  //   }
  // }

  // useEffect(() => {
  //   fetchAPI();
  // }, []);

  return (
    <>
     {/* Test for users test api */}
      {/* <div>
        <h2>Users Test</h2>
          {users.map((user) => (
          <div key={user.id}>
            <h3>{user.name}</h3>
          </div>
        ))}
      </div> */}
      
      {/* Add Header, NavBar, Footer, and Routes here */}
      {/* <Header /> Not Needed */}
      < Router >
      <div className="d-flex flex-column min-vh-100 w-100">
        <NavBar />
        <main className="flex-grow-1 container-fluid py-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path='/map' element={<MapPage />} />
            <Route path='/list' element={<ListPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/login' element={<LoginPage />} /> 
          </Routes>
        </main>
      </div>
      </Router>

      <Footer className="sticky-footer" />
    </>
  )
}

export default App
