import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import CountdownBook from './CountdownBook';
import Spinner from 'react-spinner-material';
import Button from './Button';
import { IoIosClose } from 'react-icons/io';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Countdown from './Countdown';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSuccessMessage } from '../reducers/timerSlice';
import LinearProgressWithLabel from './Progress'
import { calculateProgress } from '../reducers/booksSlice';
import { NavLink } from 'react-router-dom';


const CountdownReading = ({ currentlyReadingBooks, screenTimeInSeconds, isLoadingBooks }) => {
    const [activeIndex, setActiveIndex] = useState(() => {
        return parseInt(localStorage.getItem('activeIndex')) || 0;
    });
    const { timerStarted, successMessage } = useSelector((state) => state.timer);
    const [swiperReady, setSwiperReady] = useState(false);
    const swiperRef = useRef(null);
    const dispatch = useDispatch();
    //set index for swipe to last read book
    useEffect(() => {
        localStorage.setItem('activeIndex', activeIndex);
    }, [activeIndex]);

    useEffect(() => {
        if (swiperRef.current && !swiperReady) {
            setSwiperReady(true);
        }
    }, [swiperReady]);

    //slide to last read book
    useEffect(() => {
        if (swiperReady && swiperRef.current) {
            swiperRef.current.swiper.slideTo(activeIndex);
        }
    }, [swiperReady, activeIndex]);

    return (
        isLoadingBooks ?
            (<div className='spinner__container'>
                <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
            </div>)
            :
            (
                <>
                    {successMessage.length > 0 ?
                        <div className='success-message__container'>
                            <p>{successMessage}</p>

                            <Button className="close-btn" onClick={() => dispatch(clearSuccessMessage())}>
                                <IoIosClose />
                            </Button>
                        </div>
                        : null}
                    <div className='d-flex reading-countdown__container'>
                        <>
                            <Countdown screenTimeSeconds={screenTimeInSeconds} currentlyReadingBooks={currentlyReadingBooks} activeIndex={activeIndex} />
                        </>
                        <div className='swiper-books__container'>
                            {currentlyReadingBooks && currentlyReadingBooks.length > 0 ?
                                <Swiper
                                    spaceBetween={60}
                                    ref={swiperRef}
                                    pagination={{
                                        type: 'fraction',
                                    }}
                                    navigation={!timerStarted ? true : false}
                                    modules={[Pagination, Navigation]}
                                    preventClicks={!timerStarted ? true : false}
                                    // width={550}
                                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                                    allowTouchMove={!timerStarted ? true : false}
                                    allowSlideNext={!timerStarted ? true : false}
                                    allowSlidePrev={!timerStarted ? true : false}
                                    onSwiper={(swiper) => {
                                        swiper.on('slideChange', () => {
                                            setActiveIndex(swiper.activeIndex);
                                        });
                                    }}
                                >
                                    {currentlyReadingBooks.map((book, index) => {
                                        return (
                                            <SwiperSlide
                                                key={book._id}
                                                className={`countdown__container ${index === activeIndex ? 'swiper-slide-active' : ''}`}

                                            >

                                                <div className='book__progress' >
                                                    <LinearProgressWithLabel value={calculateProgress(book.progress, book.pageCount)} />
                                                </div>

                                                <CountdownBook book={book} />
                                            </SwiperSlide>
                                        )
                                    })}
                                </Swiper>
                                :
                                <div className="empty-books-message">
                                    <p className="empty-books-text">No currently reading books in your library</p>
                                    <p className="empty-books-text">Add book from your <NavLink className="empty-books-link" to="/books/library">Want To Read</NavLink></p>
                                    <p className="empty-books-text">or</p>
                                    <p className="empty-books-text">Search for a book <NavLink className="empty-books-link" to="/">here</NavLink></p>
                                </div>
                            }
                        </div>
                    </div>
                </>
            )
    );

}

export default CountdownReading;