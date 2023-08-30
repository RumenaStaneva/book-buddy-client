import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import '../styles/books-list.css'
import Modal from '../components/Modal'


function BookList({ books }) {
    const [bookToAdd, setBookToAdd] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
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
        setIsOpen(true);
    }

    const handleBookAdded = (title) => {
        setSuccessMessage(`${title} added successfully`);
    };

    return (
        <>
            {isOpen && <Modal setIsOpen={setIsOpen} bookDetails={bookToAdd} onBookAdded={handleBookAdded} />}
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
                                            {book.volumeInfo.authors.map((author, index) => index === book.volumeInfo.authors.length - 1 ? author : `${author}, `)}
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