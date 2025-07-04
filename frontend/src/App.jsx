import React from 'react'
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './Pages/Home/Home';
import Header from './Components/Header/Header';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Verify from './Pages/Auth/Verify';
import Footer from './Components/Footer/Footer';
import About from './Pages/About/About';
import Account from './Pages/Account/Account';
import { UserData } from './Context/UserContext';


function App() {
  // const {user} = UserData();
  // console.log(user);
  return (
    <>
      <BrowserRouter>
        <Header/>
        <Routes> 
          <Route path='/' element= {<Home/>} />
          <Route path='/about' element= {<About/>} />
          <Route path='/account' element= {<Account/>} />
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