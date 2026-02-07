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
import Courses from './Pages/Courses/Courses';
import Dashboard from './Pages/Dashboard/Dashboard';


function App() {
  const {isAuth, user } = UserData();
  return (
    <>
      <BrowserRouter>
        <Header isAuth = {isAuth}/>
        <Routes> 
          <Route path='/' element= {<Home/>} />
          <Route path='/about' element= {<About/>} />
          <Route path='/courses' element= {<Courses/>} />
          <Route path='/account' element= { isAuth ? <Account user = {user}/> : <Login/>} />
          <Route path='/login' element= { isAuth ? <Home/> : <Login />} />
          <Route path='/register' element= { isAuth ? <Home/> : <Register />} />
          <Route path='/verify' element= { isAuth ? <Home/> : <Verify />} />
          <Route path='/dashboard' element= { isAuth ? <Dashboard/> : <Verify />} />


        </Routes>
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default App