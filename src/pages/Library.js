import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import Spinner from 'react-spinner-material';
import NavBar from '../components/NavBar';
import Header from '../components/Header'
import { useAuthContext } from "../hooks/useAuthContext";
import '../styles/Library.scss'
import LibraryBookSlider from '../components/LibraryBookSlider';
import LibraryBook from '../components/LibraryBook';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import categoryColors from "../constants/categoryColors";
import 'swiper/css';
import 'swiper/css/pagination';
import Error from '../components/Error';
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBooks } from '../reducers/booksSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Library() {
    const { user } = useAuthContext();
    const dispatchRedux = useDispatch();
    const { wantToReadBooks, currentlyReadingBooks, readBooks, isLoading } = useSelector((state) => state.books);

    useEffect(() => {
        dispatchRedux(fetchAllBooks(user));
    }, [dispatchRedux, user]);

    const fetchBooks = () => {
        dispatchRedux(fetchAllBooks(user));
    }

    // useEffect(() => {
    //     document.title = `User's Library`;
    // }, []);
    const handleSuccessMessage = (message) => {
        toast.success(message, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        })
    }

    return (
        <>
            <NavBar />
            <ToastContainer />

            {isLoading ?
                null :
                <Header title={(wantToReadBooks && wantToReadBooks.length > 0) ||
                    (currentlyReadingBooks && currentlyReadingBooks.length > 0) ||
                    (readBooks && readBooks.length > 0)
                    ? `User's Library`
                    : `No books in ${user.username !== '' ? user.username : user.email.split('@')[0]}'s Library`} />
            }

            <main className='books__library'>
                {isLoading ? (
                    <div className='spinner__container'>
                        <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                    </div>
                ) : (
                    <>
                        <Error />
                        {!currentlyReadingBooks.length > 0 && !wantToReadBooks.length > 0 && !readBooks.length > 0 ?
                            <div className='shelf-header d-flex' style={{ 'marginBottom': '60px', 'justifyContent': 'center' }}>
                                <p>Currently there are no books in your library. You can search and add one from <NavLink to={'/'}>here.</NavLink></p>
                            </div>
                            : null}
                        {currentlyReadingBooks ?
                            <>
                                <div className='shelf-header'>
                                    <h2 className='shelf-title'>Currently Reading</h2>
                                    {currentlyReadingBooks.length >= 3 &&

                                        <a href='/books/see-all?shelf=1' className='cta-btn'>See all</a>
                                    }
                                </div>
                                {currentlyReadingBooks.length > 0 ?
                                    <div className='books__container' >

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
                                                        <LibraryBookSlider
                                                            book={book}
                                                            handleSuccessMessage={handleSuccessMessage}
                                                        />
                                                    </SwiperSlide>
                                                ))
                                            }
                                        </Swiper>

                                    </div >
                                    :
                                    <div className='no-books__message-container'><p>No books to display</p>
                                    </div>}
                            </>
                            : null}

                        {wantToReadBooks ?
                            <>
                                <div className='shelf-header'>
                                    <h2 className='shelf-title'>Want to Read</h2>
                                    {wantToReadBooks.length >= 3 &&
                                        <a href='/books/see-all?shelf=0' className='cta-btn'>See all</a>
                                    }
                                </div>
                                <div className='books__container books-colorful__container'>
                                    {wantToReadBooks.length > 0 ?

                                        wantToReadBooks.map(book => {
                                            const categoryColor = categoryColors[book.category] || '#FFFFFF';
                                            const bookStyle = {
                                                background: `linear-gradient(${categoryColor}, rgba(0, 0, 0, 0))`,
                                            }
                                            return (
                                                <LibraryBook key={book._id} book={book} categoryColor={categoryColor} bookStyle={bookStyle} shelf={0} fetchBooks={fetchBooks} />
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
                                        <h2 className='shelf-title'>Already Read</h2>
                                        {readBooks.length >= 3 &&
                                            <a href='/books/see-all?shelf=2' className='cta-btn'>See all</a>
                                        }
                                    </div>
                                    <div className='books__container books-colorful__container'>
                                        {readBooks.length > 0 ?

                                            readBooks.map(book => {
                                                const categoryColor = categoryColors[book.category] || '#FFFFFF';
                                                const bookStyle = {
                                                    background: `linear-gradient(${categoryColor}, rgba(0, 0, 0, 0))`,
                                                }
                                                return (
                                                    // <div key={book._id} className="book-colorful" style={bookStyle}>
                                                    //     <CardActionArea
                                                    //         className='book__button'
                                                    //         component='a'
                                                    //         onClick={event => {
                                                    //             event.stopPropagation();
                                                    //         }}
                                                    //         href={`/books/book-details/${book._id}`}
                                                    //     >
                                                    //         <CardMedia
                                                    //             component="img"
                                                    //             src={
                                                    //                 book.thumbnail === undefined
                                                    //                     ? 'https://storage.googleapis.com/book-buddy/images/image-not-available.png'
                                                    //                     : `${book.thumbnail}`
                                                    //             } alt={`${book.title}`}
                                                    //             className='book-colorful__image'
                                                    //         />
                                                    //         <CardContent className='book-colorful__info'>
                                                    //             <h3 component="div" className='book__title book__title-outline'>
                                                    //                 {book.title}
                                                    //             </h3>
                                                    //             <Typography gutterBottom variant="subtitle1" component="div" className='book__authors'>
                                                    //                 {book.authors}
                                                    //             </Typography>
                                                    //             <Typography variant="body2" color="text.secondary" className='book__description'>
                                                    //                 {book.description}
                                                    //             </Typography>
                                                    //             <div className='details__additional-info'>
                                                    //                 <div className='book__all-pages'>
                                                    //                     <p className='book-font__outline'>Print Length</p>
                                                    //                     <div className='d-flex fw-600'>
                                                    //                         <GiBookmarklet />
                                                    //                         <p>{book.pageCount}</p>
                                                    //                     </div>
                                                    //                 </div>
                                                    //                 <div className="book__action-area">
                                                    //                     <p className='book-font__outline'>Category</p>
                                                    //                     <span className="book__category" style={{ backgroundColor: categoryColor }}>{book.category}</span>
                                                    //                 </div>
                                                    //             </div>
                                                    //         </CardContent>
                                                    //     </CardActionArea>
                                                    // </div>
                                                    <LibraryBook key={book._id} book={book} categoryColor={categoryColor} bookStyle={bookStyle} shelf={2} fetchBooks={fetchBooks} />

                                                )
                                            })

                                            :
                                            <div className='no-books__message-container'><p>Nothing in read shelf</p></div>}

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