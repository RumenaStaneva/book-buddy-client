import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import CountdownBook from './CountdownBook';
import Spinner from 'react-spinner-material';
import Button from './Button';
import { IoIosClose } from 'react-icons/io';
import '../styles/CountdownReading.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Countdown from './Countdown';
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearSuccessMessage } from '../reducers/timerSlice';

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
                        <div className='countdown-timer__container'>
                            <Countdown screenTimeSeconds={screenTimeInSeconds} currentlyReadingBooks={currentlyReadingBooks} activeIndex={activeIndex} />
                        </div>
                        <div className='swiper-books__container'>
                            {currentlyReadingBooks ?
                                <Swiper
                                    ref={swiperRef}
                                    pagination={{
                                        type: 'fraction',
                                    }}
                                    navigation={!timerStarted ? true : false}
                                    modules={[Pagination, Navigation]}
                                    preventClicks={!timerStarted ? true : false}
                                    width={550}
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
                                                <CountdownBook book={book} />
                                            </SwiperSlide>)
                                    })}
                                </Swiper>
                                :
                                <p>No currently reading books, add one</p>}
                        </div>
                    </div>
                </>
            )
    );

}

export default CountdownReading;