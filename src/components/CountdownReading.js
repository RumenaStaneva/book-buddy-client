import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import CountdownBook from './CountdownBook';
import Spinner from 'react-spinner-material';


import Timer from './Timer';
import '../styles/CountdownReading.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Countdown from './Countdown';
import { useState } from 'react';
import { setTimerStarted } from '../reducers/timerSlice';
import { useSelector, useDispatch } from 'react-redux';

const CountdownReading = ({ currentlyReadingBooks, screenTimeInSeconds, isLoadingBooks }) => {
    const [chosenBookForReading, setChosenBookForReading] = useState();
    const [activeIndex, setActiveIndex] = useState(0);
    const { timerStarted } = useSelector((state) => state.timer);

    return (
        isLoadingBooks ?
            (<div className='spinner__container'>
                <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
            </div>)
            :
            (

                <div className='d-flex reading-countdown__container'>
                    <div className='countdown-timer__container'>
                        <Countdown readingTimeSeconds={screenTimeInSeconds} currentlyReadingBooks={currentlyReadingBooks} activeIndex={activeIndex} />
                    </div>
                    <div className='swiper-books__container'>
                        {currentlyReadingBooks ?
                            <Swiper
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
                            >
                                {currentlyReadingBooks.map(book => {
                                    return (
                                        <SwiperSlide
                                            key={book._id}
                                            className='countdown__container'
                                        >
                                            <CountdownBook book={book} />
                                        </SwiperSlide>)
                                })}
                            </Swiper>
                            :
                            <p>No currently reading books, add one</p>}
                    </div>
                </div>
            )
    );

}

export default CountdownReading;