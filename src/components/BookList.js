import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import '../styles/books-list.css'
import { useAuthContext } from '../hooks/useAuthContext';


function BookList({ books }) {
    const [bookDetails, setBookDetails] = useState({});
    const { user } = useAuthContext();
    const [errorMessage, setErrorMessage] = useState('');

    const handleAddToShelf = async (book) => {
        const bookInfo = book.volumeInfo;
        console.log(bookInfo);
        setBookDetails({
            userEmail: user.email,
            bookApiId: book.id,
            title: bookInfo.title,
            authors: bookInfo.authors,
            description: bookInfo.description,
            publisher: bookInfo.publisher,
            thumbnail: bookInfo.imageLinks.thumbnail,
            categories: bookInfo.categories,
            pageCount: bookInfo.pageCount
        });

    }

    //TODO see why it is maiking so many requests and fix
    useEffect(() => {
        try {
            fetch('http://localhost:5000/add-to-shelf', {
                method: 'POST',
                // We convert the React state to JSON and send it as the POST body
                body: JSON.stringify(bookDetails),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
            }).then(function (response) {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error); // Throw the custom error message
                    });
                }
                setErrorMessage('');
                return response.json();
            })
                .then(function (data) {
                    setErrorMessage('');
                    console.log(data); // The successful response data
                })
                .catch(function (error) {
                    setErrorMessage(error.message); // Set the error state with the error message
                });
        } catch (error) {
            setErrorMessage(error.message);
        }// Catch any errors thrown during fetch setup
    }, [bookDetails, user, errorMessage]);

    return (
        <div className='books__container'>
            {errorMessage.length > 0 ? <p>{errorMessage}</p> : null}
            {
                books.map(book => (
                    <div key={book.id}>

                        <Card sx={{ maxWidth: 345 }} className='book'>
                            <CardActionArea
                                className='book__button'
                                component="a"
                            >
                                <CardMedia
                                    component="img"
                                    src={
                                        book.volumeInfo.imageLinks === undefined
                                            ? require('../images/image-not-available.png')
                                            : `${book.volumeInfo.imageLinks.thumbnail}`
                                    } alt={`${book.volumeInfo.title}`}
                                    className='book__image'
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div" className='book__title'>
                                        {book.volumeInfo.title}
                                    </Typography>
                                    <Typography gutterBottom variant="subtitle1" component="div">
                                        {book.volumeInfo.authors}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" className='book__description'>
                                        {book.volumeInfo.description}
                                    </Typography>
                                    <p>{book.volumeInfo.pageCount}</p>
                                </CardContent>
                                <button
                                    className='btn__add'
                                    onMouseDown={event => event.stopPropagation()}
                                    onClick={event => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        handleAddToShelf(book);
                                    }}
                                >Add to shelf</button>
                            </CardActionArea>
                        </Card>
                    </div>

                ))
            }

        </div >
    )
}

export default BookList;