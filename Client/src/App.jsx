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
import RegisterPage from './Pages/Register';

function App() {

  return (
    <>
      < Router >
      <div className="container-fluid">
        <NavBar />
        <main className="container-fluid">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path='/map' element={<MapPage />} />
            <Route path='/list' element={<ListPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
      </Router>

      <Footer className="sticky-footer" />
    </>
  )
}

export default App
