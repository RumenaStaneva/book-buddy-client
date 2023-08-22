import { useState, useEffect, useCallback } from 'react';
import Spinner from 'react-spinner-material';
import NavBar from '../components/NavBar';
import Header from '../components/Header'
import { useAuthContext } from "../hooks/useAuthContext";
import '../styles/Library.css'
import LibraryBook from '../components/LibraryBook';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import categoryColors from "../constants/categoryColors";


import 'swiper/css';
import 'swiper/css/pagination';

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

    useEffect(() => {
        document.title = `${user.username !== '' ? user.username : user.email.split('@')[0]}'s library`;
    }, []);

    const fetchBooks = useCallback(
        async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/books/library`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                const data = await response.json();
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
            <Header title={`${!wantToReadBooks.length > 0 && !currentlyReadingBooks.length && !readBooks.length ?
                `No books in library`
                : `${user.username !== '' ? user.username : user.email.split('@')[0]}'s library`}`} />

            <main className='books__library'>
                {isLoading ? (
                    <div className='spinner__container'>
                        <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                    </div>
                ) : (
                    <>
                        {currentlyReadingBooks.length > 0 ?
                            <>
                                < p > Currently reading</p >
                                <a href='/books/see-all?shelf=1'>See all</a>
                                <div className='books__container'>
                                    {<Swiper
                                        pagination={{
                                            dynamicBullets: true,
                                            clickable: true
                                        }}
                                        className="book__carousel"
                                        spaceBetween={30}
                                        centeredSlides={true}
                                        autoplay={{
                                            delay: 5000,
                                            disableOnInteraction: true,
                                            pauseOnMouseEnter: true
                                        }}
                                        slidesPerView={1}
                                        modules={[Pagination, Autoplay]}

                                    >
                                        {

                                            currentlyReadingBooks.map(book => (
                                                <SwiperSlide
                                                    key={book._id}
                                                >
                                                    <LibraryBook
                                                        book={book}
                                                        fetchBooks={fetchBooks}
                                                    />
                                                </SwiperSlide>
                                            ))
                                        }
                                    </Swiper>
                                    }
                                </div >
                            </>
                            : <p>No books to display</p>}

                        {wantToReadBooks.length > 0 ?
                            <>
                                < p > Want to read books</p >
                                <a href='/books/see-all?shelf=0'>See all</a>
                                <div className='books__container books-colorful__container'>
                                    {
                                        wantToReadBooks.map(book => {
                                            const categoryColor = categoryColors[book.category] || '#FFFFFF';
                                            const bookStyle = {
                                                background: `linear-gradient(${categoryColor}, rgba(0, 0, 0, 0))`,
                                            }
                                            return (
                                                <div key={book._id} className="book-colorful" style={bookStyle}>
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
                                                            className='book-colorful__image'
                                                        />
                                                        <CardContent className='book-colorful__info'>
                                                            <h5 className='book__title book__title-outline'>
                                                                {book.title}
                                                            </h5>
                                                            <Typography gutterBottom variant="subtitle1" component="div" className='book__authors'>
                                                                {book.authors.map((author, index) => index === book.authors.length - 1 ? author : `${author}, `)}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" className='book__description'>
                                                                {book.description}
                                                            </Typography>
                                                            <p>{book.pageCount}</p>
                                                            <div className="book__action-area">
                                                                <button className="book__category" style={{ backgroundColor: categoryColor }}>{book.category}</button>
                                                            </div>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </div>
                                            )

                                        })}
                                </div >
                            </>
                            : <p>Nothing in want to read shelf</p>
                        }
                        {readBooks.length > 0 ?
                            <>
                                < p > Already read</p >
                                <a href='/books/see-all?shelf=2'>See all</a>
                                <div className='books__container books-colorful__container'>
                                    {
                                        readBooks.map(book => {
                                            const categoryColor = categoryColors[book.category] || '#FFFFFF';
                                            const bookStyle = {
                                                background: `linear-gradient(${categoryColor}, rgba(0, 0, 0, 0))`,
                                            }
                                            return (
                                                <div key={book._id} className="book-colorful" style={bookStyle}>
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
                                                            className='book-colorful__image'
                                                        />
                                                        <CardContent className='book-colorful__info'>
                                                            <h5 component="div" className='book__title book__title-outline'>
                                                                {book.title}
                                                            </h5>
                                                            <Typography gutterBottom variant="subtitle1" component="div" className='book__authors'>
                                                                {book.authors}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" className='book__description'>
                                                                {book.description}
                                                            </Typography>
                                                            <p>{book.pageCount}</p>
                                                            <div className="book__action-area">
                                                                <button className="book__category" style={{ backgroundColor: categoryColor }}>{book.category}</button>
                                                            </div>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </div>
                                            )
                                        })}
                                </div >
                            </>
                            : <p>No books to display</p>}
                    </>

                )
                }
            </main>
        </>
    )
}

export default Library;