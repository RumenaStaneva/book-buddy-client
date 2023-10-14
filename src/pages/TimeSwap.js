import NavBar from "../components/NavBar";
// import Countdown from "../components/Countdown";
import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Spinner from 'react-spinner-material';
// import Calendar from "../components/Calendar";
// import ReadingTimeTable from "../components/ReadingTimeTable";
import AddScreenTimeModal from "../components/AddScreenTimeModal";
import TimeSwapInformationPage from "./TimeSwapInformationPage";
import WeeklyDashboard from "../components/WeeklyDashboard";
import { setReadingTimeForToday } from "../reducers/readingTimeForTodaySlice";
import { startOfWeek, endOfWeek, format } from 'date-fns';



const TimeSwap = () => {
    const [hasScreenTimeData, setHasScreenTimeData] = useState(false);

    const [isOpenAddScreenTime, setIsOpenAddScreenTime] = useState(false);
    const [hasAlreadyAddedScreenTime, setHasAlreadyAddedScreenTime] = useState(false);
    // const [readingTimeData, setReadingTimeData] = useState();
    const [daysInWeek, setDaysInWeek] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useAuthContext();



    const checkScreenTimeData = useCallback(async () => {
        try {
            const today = new Date().setHours(0, 0, 0, 0);
            const startOfWeekDay = startOfWeek(today, { weekStartsOn: 1 });
            const lastWeekEnd = endOfWeek(today, { weekStartsOn: 2 }); // it is 2 cuz it returns to saturday without sunday

            const formattedStartDate = format(startOfWeekDay, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'auto' });
            const formattedEndDate = format(lastWeekEnd, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'auto' });

            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/time-swap/reading-time?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.readingTime.length > 0) {
                    // setReadingTimeData(data.readingTimePerDay);
                    setDaysInWeek(data.readingTime);
                    // console.log('dayssssssssss', data.readingTime);
                    setHasScreenTimeData(true);
                    setHasAlreadyAddedScreenTime(true);
                }
            } else {
                setHasAlreadyAddedScreenTime(false);
                throw new Error('Error checking screen time data existence');
            }
            setIsLoading(false);

        } catch (error) {
            setHasAlreadyAddedScreenTime(false);
            console.error('Error:', error);
            setIsLoading(false);

        }
    }, [user.token]);

    useEffect(() => {
        // console.log('rerender from timeswap component');
        checkScreenTimeData();
    }, [checkScreenTimeData]);

    return (
        <>
            <NavBar />
            {isLoading ? (
                <div className='spinner__container'>
                    <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                </div>
            ) : (
                <>
                    {isOpenAddScreenTime && <AddScreenTimeModal setIsOpen={setIsOpenAddScreenTime} checkScreenTimeData={checkScreenTimeData} />}

                    {!hasScreenTimeData ? (
                        <TimeSwapInformationPage setIsOpenAddScreenTime={setIsOpenAddScreenTime} />
                    ) :
                        <WeeklyDashboard days={daysInWeek} />
                        // null
                    }
                </>
            )}
        </>

    );
};

export default TimeSwap;