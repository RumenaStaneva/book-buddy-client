import { useState } from 'react';
import '../styles/Library.css'
import { useAuthContext } from "../hooks/useAuthContext";
import '../styles/LibraryBook.css'
import Error from './Error';
import { useDispatch } from "react-redux";
import { clearError, setError } from '../reducers/errorSlice';


function CountdownBook({ book }) {
    const { user } = useAuthContext();


    return (
        <>
            <div className='books__container currently-reading__container'>
                {
                    <div className='book'>
                        <div
                            className='book__details'
                            onClick={event => {
                                event.stopPropagation();
                                event.preventDefault();
                            }}
                        >
                            <div className='title-author__container'>
                                <h5 className='book__title book-font__outline'>
                                    {book.title}
                                </h5>

                                {book.authors.length > 0 ?

                                    <p className='book__authors'> By: {' '}
                                        {book.authors?.join(', ')}
                                    </p> : null}
                            </div>
                            <img
                                src={
                                    book.thumbnail === undefined
                                        ? require('../images/image-not-available.png')
                                        : `${book.thumbnail}`
                                } alt={`${book.title}`}
                                className='book__image'
                            />
                        </div>
                    </div>
                }
            </div >
        </>
    )

}

export default CountdownBook;