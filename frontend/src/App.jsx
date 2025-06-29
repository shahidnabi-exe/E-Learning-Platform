import React from 'react'
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './Pages/Home/Home';
import Header from './Components/Header/Header';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Verify from './Pages/Auth/Verify';
import Footer from './Components/Footer/Footer';


function App() {
  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes> 
          <Route path='/' element= {<Home/>} />
          <Route path='/login' element= {<Login />} />
          <Route path='/register' element= {<Register />} />
          <Route path='/verify' element= {<Verify />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App