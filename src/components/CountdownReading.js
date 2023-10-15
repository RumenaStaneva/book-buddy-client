// import { useAuthContext } from "../hooks/useAuthContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import LibraryBook from './LibraryBook';
import Spinner from 'react-spinner-material';


import Timer from './Timer';
import '../styles/CountdownReading.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


const CountdownReading = ({ currentlyReadingBooks, screenTimeInSeconds, isLoadingBooks }) => {


    return (
        isLoadingBooks ?
            (<div className='spinner__container'>
                <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
            </div>)
            :
            (

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
            )
    );

}

export default CountdownReading;