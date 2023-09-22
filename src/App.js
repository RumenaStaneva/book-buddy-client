import React from 'react';
import Home from './pages/Home';
import About from './pages/About';
import TimeSwap from './pages/TimeSwap';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PasswordReset from './pages/PasswordReset';
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

function App() {

  const { user } = useAuthContext();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/time-swap" element={user ? <TimeSwap /> : <Navigate to="users/login" />} />
        <Route path="/users/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/users/sign-up" element={!user ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/users/forgotten-password" element={<PasswordReset />} />
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