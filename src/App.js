import React from 'react';
import Home from './pages/Home';
import About from './pages/About';
import TimeSwap from './pages/TimeSwap';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import PasswordReset from './pages/PasswordReset';
import ErrorPage from './pages/ErrorPage';
import './styles/App.css'
import { Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/time-swap" element={<TimeSwap />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgotten-password" element={<PasswordReset />} />

        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </>

  )
}

export default App;