import React from 'react';
import Home from './pages/Home';
import About from './pages/About';
import TimeSwap from './pages/TimeSwap';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import ErrorPage from './pages/ErrorPage';
import './styles/App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';
import Library from './pages/Library';
import ListAllBooks from './pages/ListAllBooks';
import VerificationEmailSent from './pages/VerificationEmailSent';
import VerificationSuccess from './pages/VerificationSuccess';
import ResetPassword from './pages/ResetPassword';

function App() {

  const { user } = useAuthContext();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/time-swap" element={!user ? <Login /> : <TimeSwap />} />
        <Route path="/users/login" element={!user ? <Login /> : <Navigate to="/books/library" />} />
        <Route path="/users/sign-up" element={!user ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/users/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/books/library" />} />
        <Route path="/users/reset-password/:token" element={!user ? <ResetPassword /> : <Navigate to="/books/library" />} />
        {user && (
          <>
            <Route path="/users/profile" element={<Profile />} />
            <Route path='/books/library' element={<Library />} />
            <Route path='/books/see-all' element={<ListAllBooks />} />
            <Route path='/books/book-details/:bookId' element={<BookDetails />} />
          </>
        )}
        <Route path='/verificate-email' element={<VerificationEmailSent />} />
        <Route path='/users/verify/:token' element={<VerificationSuccess />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </>

  )
}

export default App;