import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Spinner from 'react-spinner-material';
import AddScreenTimeModal from "../components/AddScreenTimeModal";
import TimeSwapInformationPage from "./TimeSwapInformationPage";
import WeeklyDashboard from "../components/WeeklyDashboard";
import { fetchHasReadingTimeAnytime, fetchReadingTimeForTheWeek } from "../reducers/readingTimeForTodaySlice";
import { fetchAllBooks } from "../reducers/booksSlice";
import { useDispatch, useSelector } from "react-redux";
import '../styles/TimeSwap.css'


const TimeSwap = () => {
    const [isOpenAddScreenTime, setIsOpenAddScreenTime] = useState(false);
    const { user } = useAuthContext();
    const dispatchBooks = useDispatch();
    const dispatchReadingTime = useDispatch();
    const { currentWeekData, hasReadingTimeAnytime } = useSelector((state) => state.readingTimeForToday);
    const isLoadingBooks = useSelector((state) => state.books.isLoading);

    useEffect(() => {
        document.title = 'TimeSwap';
    }, []);

    useEffect(() => {
        dispatchReadingTime(fetchHasReadingTimeAnytime(user));
        dispatchBooks(fetchAllBooks(user));
        dispatchReadingTime(fetchReadingTimeForTheWeek(user));
    }, [dispatchBooks, dispatchReadingTime, user]);
    return (
        <>
            <NavBar />
            {isLoadingBooks ? (
                <div className='spinner__container'>
                    <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                </div>
            ) : (
                <>
                    {isOpenAddScreenTime && <AddScreenTimeModal setIsOpen={setIsOpenAddScreenTime} />}


                    {!hasReadingTimeAnytime ? (
                        <TimeSwapInformationPage setIsOpenAddScreenTime={setIsOpenAddScreenTime} />
                    ) :
                        <WeeklyDashboard readingTimeData={currentWeekData} setIsOpenAddScreenTime={setIsOpenAddScreenTime} />
                    }
                </>
            )}
        </>

    );
};

export default TimeSwap;