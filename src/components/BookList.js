import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import '../styles/books-list.css'


function BookList({ books }) {
    return (
        <div className='books__container'>
            {

                books.map(book => (
                    <Card sx={{ maxWidth: 345 }} key={book.id} className='book'>
                        <CardActionArea>
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
                            </CardContent>
                        </CardActionArea>
                    </Card>

                ))
            }

        </div>
    )
}

export default BookList;