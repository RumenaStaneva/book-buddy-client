import { useState, useEffect, useCallback } from 'react';
import Spinner from 'react-spinner-material';
import NavBar from '../components/NavBar';
import { useAuthContext } from "../hooks/useAuthContext";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

function Library() {

    const [isLoading, setIsLoading] = useState(true);
    const [wantToReadBooks, setWantToReadBooks] = useState(null);
    const [currentlyReadingBooks, setCurrentlyReadingBooks] = useState(null);
    const [readBooks, setReadBooks] = useState(null);
    const { user } = useAuthContext();


    const fetchBooks = useCallback(
        async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/library`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                const data = await response.json();
                // console.log(data);
                setWantToReadBooks(data.wantToReadBooks);
                setCurrentlyReadingBooks(data.currntlyReadingBooks);
                setReadBooks(data.readBooks);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setIsLoading(false);
            }
        },
        [user],
    )

    useEffect(() => {
        if (user) {
            fetchBooks();
        }
    }, [user, fetchBooks]);

    return (
        <>
            <NavBar />
            {isLoading ? (
                <div className='spinner__container'>
                    <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                </div>
            ) : (
                <>
                    {wantToReadBooks.length > 0 ?
                        <>
                            <p>Want to read</p>
                            <div className='books__container'>
                                {
                                    wantToReadBooks.map(book => (
                                        <div key={book._id}>

                                            <Card sx={{ maxWidth: 345 }} className='book'>
                                                <CardActionArea
                                                    className='book__button'
                                                    component='button'
                                                    onClick={event => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                    }}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        src={
                                                            book.thumbnail === undefined
                                                                ? require('../images/image-not-available.png')
                                                                : `${book.thumbnail}`
                                                        } alt={`${book.title}`}
                                                        className='book__image'
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h5" component="div" className='book__title'>
                                                            {book.title}
                                                        </Typography>
                                                        <Typography gutterBottom variant="subtitle1" component="div">
                                                            {book.authors}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" className='book__description'>
                                                            {book.description}
                                                        </Typography>
                                                        <p>{book.pageCount}</p>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </div>
                                    ))
                                }
                            </div >
                        </>
                        : <p>No books to display</p>}
                    {currentlyReadingBooks.length > 0 ?
                        <>
                            < p > Currently reading</p >
                            <div className='books__container'>
                                {
                                    currentlyReadingBooks.map(book => (
                                        <div key={book._id}>

                                            <Card sx={{ maxWidth: 345 }} className='book'>
                                                <CardActionArea
                                                    className='book__button'
                                                    component='button'
                                                    onClick={event => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                    }}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        src={
                                                            book.thumbnail === undefined
                                                                ? require('../images/image-not-available.png')
                                                                : `${book.thumbnail}`
                                                        } alt={`${book.title}`}
                                                        className='book__image'
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h5" component="div" className='book__title'>
                                                            {book.title}
                                                        </Typography>
                                                        <Typography gutterBottom variant="subtitle1" component="div">
                                                            {book.authors}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" className='book__description'>
                                                            {book.description}
                                                        </Typography>
                                                        <p>{book.pageCount}</p>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </div>
                                    ))
                                }
                            </div >
                        </>
                        : <p>No books to display</p>}
                    {readBooks.length > 0 ?
                        <>
                            < p > Already read</p >
                            <div className='books__container'>
                                {
                                    readBooks.map(book => (
                                        <div key={book._id}>

                                            <Card sx={{ maxWidth: 345 }} className='book'>
                                                <CardActionArea
                                                    className='book__button'
                                                    component='button'
                                                    onClick={event => {
                                                        event.stopPropagation();
                                                        event.preventDefault();
                                                    }}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        src={
                                                            book.thumbnail === undefined
                                                                ? require('../images/image-not-available.png')
                                                                : `${book.thumbnail}`
                                                        } alt={`${book.title}`}
                                                        className='book__image'
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h5" component="div" className='book__title'>
                                                            {book.title}
                                                        </Typography>
                                                        <Typography gutterBottom variant="subtitle1" component="div">
                                                            {book.authors}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" className='book__description'>
                                                            {book.description}
                                                        </Typography>
                                                        <p>{book.pageCount}</p>
                                                    </CardContent>
                                                </CardActionArea>
                                            </Card>
                                        </div>
                                    ))
                                }
                            </div >
                        </>
                        : <p>No books to display</p>}
                </>

            )
            }
        </>
    )
}

export default Library;