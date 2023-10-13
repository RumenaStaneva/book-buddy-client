import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBooks } from '../reducers/booksSlice';
import { useAuthContext } from "../hooks/useAuthContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import Timer from './Timer';
import '../styles/CountdownReading.css'
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


const CountdownReading = () => {
    const { user } = useAuthContext();
    const dispatchRedux = useDispatch();
    const { currentlyReadingBooks, isLoading } = useSelector((state) => state.books);
    useEffect(() => {
        dispatchRedux(fetchAllBooks(user));
    }, [dispatchRedux, user]);


    return (
        <div className='d-flex'>
            <div>
                <Timer />
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
                        width={250}
                    // preventClicksPropagation={false}

                    >
                        {currentlyReadingBooks.map(book => {
                            return (
                                <SwiperSlide key={book._id}>
                                    <p>{book.title}</p>
                                    <img src={book.thumbnail} alt={`${book.title} Thumbnail`} />
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