import React from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar'
import SearchBar from '../components/SearchBar';
import '../styles/ErrorPage.scss'

const ErrorPage = () => {
  return (
    <>
      <NavBar />
      <main className='error-page'>
        <h1 className='error-page__title'>Page Not Found</h1>
        <p className='error-page__subtitle'>Oops! The page you are looking for does not exist.</p>

        <img src='https://storage.googleapis.com/book-buddy/images/404-page-image.png' alt="Page not found" width={300} />

        <p className='error-page__subtitle error-page__subtitle--second'>
          Don't worry, let's get you back on track. You can go back to the{' '}
          <Link to="/" className='error-page__link'>
            homepage
          </Link>{' '}
          or use the search bar below to find what you were looking for.
        </p>

        <SearchBar />
      </main>
    </>
  );
};

export default ErrorPage;
