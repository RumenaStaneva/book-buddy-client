import { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import Spinner from 'react-spinner-material';
import NavBar from '../components/NavBar';
import Header from '../components/Header'
import { useAuthContext } from "../hooks/useAuthContext";
import '../styles/Library.css'
import LibraryBook from '../components/LibraryBook';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import categoryColors from "../constants/categoryColors";
import { GiBookmarklet } from "react-icons/gi";


import 'swiper/css';
import 'swiper/css/pagination';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Error from '../components/Error';

function Library() {

    const [isLoading, setIsLoading] = useState(true);
    const [wantToReadBooks, setWantToReadBooks] = useState([]);
    const [currentlyReadingBooks, setCurrentlyReadingBooks] = useState([]);
    const [readBooks, setReadBooks] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
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
                setWantToReadBooks(data.wantToReadBooks);
                setCurrentlyReadingBooks(data.currntlyReadingBooks);
                setReadBooks(data.readBooks);
                setIsLoading(false);
            } catch (error) {
                setErrorMessage('Error fetching user data: ', error);
                console.error('Error fetching user data: ', error);
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

    useEffect(() => {
        document.title = `User's library`;
    }, []);

    return (
        <>
            <NavBar />
            {isLoading ?
                null :
                <Header title={(wantToReadBooks && wantToReadBooks.length > 0) ||
                    (currentlyReadingBooks && currentlyReadingBooks.length > 0) ||
                    (readBooks && readBooks.length > 0)
                    ? `User's library`
                    : `No books in ${user.username !== '' ? user.username : user.email.split('@')[0]}'s library`} />

            }

            <main className='books__library'>
                {isLoading ? (
                    <div className='spinner__container'>
                        <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                    </div>
                ) : (
                    <>
                        {console.log(currentlyReadingBooks.length, wantToReadBooks.length, readBooks.length)}
                        {errorMessage.length > 0 ? (
                            <Error message={errorMessage} onClose={() => setErrorMessage('')} />
                        ) : null}
                        {!currentlyReadingBooks.length > 0 && !wantToReadBooks.length > 0 && !readBooks.length > 0 ?
                            <div className='shelf-header d-flex' style={{ 'marginBottom': '60px', 'justifyContent': 'center' }}>
                                <p>Currently there are no books in your library. You can search and add one from <NavLink to={'/'}>here.</NavLink></p>
                            </div>
                            : null}
                        {currentlyReadingBooks ?
                            <>
                                <div className='shelf-header'>
                                    <h2 className='shelf-title'>Currently Reading</h2>
                                    <a href='/books/see-all?shelf=1' className='cta-btn'>See all</a>
                                </div>
                                {currentlyReadingBooks.length > 0 ?
                                    <div className='books__container'>

                                        <Swiper
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

                                    </div >
                                    : <p style={{ 'textAlign': 'center' }}>No books to display</p>}
                            </>
                            : null}

                        {wantToReadBooks ?
                            <>
                                <div className='shelf-header'>
                                    <h2 className='shelf-title'>Want to read books</h2>
                                    <a href='/books/see-all?shelf=0' className='cta-btn'>See all</a>
                                </div>
                                <div className='books__container books-colorful__container'>
                                    {wantToReadBooks.length > 0 ?

                                        wantToReadBooks.map(book => {
                                            const categoryColor = categoryColors[book.category] || '#FFFFFF';
                                            const bookStyle = {
                                                background: `linear-gradient(${categoryColor}, rgba(0, 0, 0, 0))`,
                                            }
                                            return (
                                                <div key={book._id} className="book-colorful" style={bookStyle}>
                                                    <CardActionArea
                                                        className='book__button'
                                                        component='a'
                                                        onClick={event => {
                                                            event.stopPropagation();
                                                        }}
                                                        href={`/books/book-details/${book._id}`}
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
                                                            <div className='details__additional-info'>
                                                                <div className='book__all-pages'>
                                                                    <p className='book-font__outline'>Print Length</p>
                                                                    <div className='d-flex fw-600'>
                                                                        <GiBookmarklet />
                                                                        <p>{book.pageCount}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="book__action-area">
                                                                    <p className='book-font__outline'>Category</p>
                                                                    <span className="book__category" style={{ backgroundColor: categoryColor }}>{book.category}</span>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </CardActionArea>
                                                </div>
                                            )

                                        })

                                        : <p>Nothing in want to read shelf</p>}
                                </div >
                            </>
                            : null
                        }
                        {
                            readBooks ?
                                <>
                                    <div className='shelf-header'>
                                        <h2 className='shelf-title'>Already read</h2>
                                        <a href='/books/see-all?shelf=2' className='cta-btn'>See all</a>
                                    </div>
                                    <div className='books__container books-colorful__container'>
                                        {readBooks.length > 0 ?

                                            readBooks.map(book => {
                                                const categoryColor = categoryColors[book.category] || '#FFFFFF';
                                                const bookStyle = {
                                                    background: `linear-gradient(${categoryColor}, rgba(0, 0, 0, 0))`,
                                                }
                                                return (
                                                    <div key={book._id} className="book-colorful" style={bookStyle}>
                                                        <CardActionArea
                                                            className='book__button'
                                                            component='a'
                                                            onClick={event => {
                                                                event.stopPropagation();
                                                            }}
                                                            href={`/books/book-details/${book._id}`}
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
                                                                <div className='details__additional-info'>
                                                                    <div className='book__all-pages'>
                                                                        <p className='book-font__outline'>Print Length</p>
                                                                        <div className='d-flex fw-600'>
                                                                            <GiBookmarklet />
                                                                            <p>{book.pageCount}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="book__action-area">
                                                                        <p className='book-font__outline'>Category</p>
                                                                        <span className="book__category" style={{ backgroundColor: categoryColor }}>{book.category}</span>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </CardActionArea>
                                                    </div>
                                                )
                                            })

                                            : <p>Nothing in read shelf</p>}

                                    </div >
                                </>
                                : null
                        }
                    </>

                )
                }
            </main >
        </>
    )
}

export default Library;