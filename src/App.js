import React from 'react';
import Home from './pages/Home';
import About from './pages/About';
import TimeSwap from './pages/TimeSwap';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import PasswordReset from './pages/PasswordReset';
import ErrorPage from './pages/ErrorPage';
import './styles/App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import BookDetailsPage from './pages/BookDetailsPage';

function App() {

  const { user } = useAuthContext();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/time-swap" element={user ? <TimeSwap /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/sign-up" element={!user ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/forgotten-password" element={<PasswordReset />} />
        <Route path="/books/:id" element={<BookDetailsPage />} />

        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </>

  )
}

export default App;