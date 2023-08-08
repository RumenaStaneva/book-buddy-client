import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import '../styles/books-list.css'
// import { useAuthContext } from '../hooks/useAuthContext';
import Modal from '../components/Modal'


function BookList({ books }) {
    const [bookToAdd, setBookToAdd] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    // const [bookDetails, setBookDetails] = useState({});
    const [successMessage, setSuccessMessage] = useState('');


    const handleAddToShelf = (book) => {
        let thumbnail = book.volumeInfo.imageLinks;
        if (!thumbnail) {
            thumbnail = null;
        } else {
            thumbnail = thumbnail.thumbnail;
        }
        setBookToAdd({
            bookApiId: book.id,
            title: book.volumeInfo.title,
            authors: book.volumeInfo.authors,
            description: book.volumeInfo.description,
            publisher: book.volumeInfo.publisher,
            thumbnail: thumbnail,
            categories: book.volumeInfo.categories,
            pageCount: book.volumeInfo.pageCount
        })

        setSuccessMessage(`"${book.volumeInfo.title}" added to your shelf successfully.`);
        setIsOpen(true);
    }

    // useEffect(() => {
    //     try {
    //         if (bookToAdd) {
    //             fetch('http://localhost:5000/add-to-shelf', {
    //                 method: 'POST',
    //                 body: JSON.stringify({
    //                     userEmail: user.email,
    //                     bookApiId: bookToAdd.id,
    //                     title: bookToAdd.volumeInfo.title,
    //                     authors: bookToAdd.volumeInfo.authors,
    //                     description: bookToAdd.volumeInfo.description,
    //                     publisher: bookToAdd.volumeInfo.publisher,
    //                     thumbnail: bookToAdd.volumeInfo.imageLinks ? bookToAdd.volumeInfo.imageLinks.thumbnail : null,
    //                     categories: bookToAdd.volumeInfo.categories,
    //                     pageCount: bookToAdd.volumeInfo.pageCount
    //                 }),
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${user.token}`
    //                 },
    //             })
    //                 .then(function (response) {
    //                     if (!response.ok) {
    //                         return response.json().then(data => {
    //                             throw new Error(data.error);
    //                         });
    //                     }
    //                     setErrorMessage('');
    //                     return response.json();
    //                 })
    //                 .then(function (data) {
    //                     setErrorMessage('');
    //                     console.log(data);
    //                 })
    //                 .catch(function (error) {
    //                     setErrorMessage(error.message);
    //                 });
    //         }
    //     } catch (error) {
    //         setErrorMessage(error.message);
    //     }
    //     setBookToAdd(null); // Reset the book to add after the request is made
    // }, [bookToAdd, user]);

    // console.log(bookDetails);
    // console.log(bookToAdd);

    // Update the book details to be displayed when a book is added to the shelf


    // useEffect(() => {
    //     if (bookToAdd) {
    //         const bookInfo = bookToAdd.volumeInfo;
    //         setBookDetails({
    //             bookApiId: bookToAdd.id,
    //             title: bookInfo.title,
    //             authors: bookInfo.authors,
    //             description: bookInfo.description,
    //             publisher: bookInfo.publisher,
    //             thumbnail: bookInfo.imageLinks.thumbnail,
    //             categories: bookInfo.categories,
    //             pageCount: bookInfo.pageCount
    //         });
    //     }
    // }, [bookToAdd]);

    return (
        <>
            {isOpen && <Modal setIsOpen={setIsOpen} bookDetails={bookToAdd} />}
            {successMessage.length > 0 ?
                <div className='success-message__container'>
                    <p>{successMessage}</p>
                </div>
                : null}
            <div className='books__container'>
                {
                    books.map(book => (
                        <div key={book.id}>

                            <Card sx={{ maxWidth: 345 }} className='book'>
                                <CardActionArea
                                    className='book__button'
                                    component='button'
                                    onClick={event => {
                                        event.stopPropagation();
                                        event.preventDefault();
                                        setIsOpen(true)
                                        setSuccessMessage('');
                                        handleAddToShelf(book);
                                    }}
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
                                </CardActionArea>
                            </Card>
                        </div>
                    ))
                }
            </div >
        </>
    )
}

export default BookList;