import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { fetchReadingTime } from '../reducers/readingTimeForTodaySlice';
import { fetchAllBooks } from '../reducers/booksSlice';
import { useAuthContext } from "../hooks/useAuthContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import LibraryBook from './LibraryBook';


import Timer from './Timer';
import '../styles/CountdownReading.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


const CountdownReading = () => {
    const { user } = useAuthContext();
    const dispatchBooks = useDispatch();
    const dispatchReadingTime = useDispatch();
    // const dispatchReadingTime = useDispatch();
    const { currentlyReadingBooks, isLoading } = useSelector((state) => state.books);
    const { data, screenTimeInSeconds } = useSelector((state) => state.readingTimeForToday)
    //todo understand why it is fetched 2 times to BE

    useEffect(() => {
        console.log('Fetching data...');
        dispatchBooks(fetchAllBooks(user));
        dispatchReadingTime(fetchReadingTime(user));
    }, [dispatchBooks, dispatchReadingTime, user]);






    return (
        <div className='d-flex reading-countdown__container'>
            <div className='countdown-timer__container'>
                <Timer readingTimeSeconds={screenTimeInSeconds} />
            </div>
            <div className='swiper-books__container'>
                {currentlyReadingBooks ?
                    <Swiper
                        pagination={{
                            type: 'fraction',
                        }}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        preventClicks={false}
                        width={400}

                    >
                        {currentlyReadingBooks.map(book => {
                            return (
                                <SwiperSlide
                                    key={book._id}
                                >
                                    <LibraryBook book={book} />
                                </SwiperSlide>)
                        })}
                    </Swiper>
                    :
                    <p>No currently reading books, add one</p>}
            </div>
        </div>
    );

}

export default CountdownReading;