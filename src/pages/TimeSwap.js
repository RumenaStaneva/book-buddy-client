import NavBar from "../components/NavBar";
// import Countdown from "../components/Countdown";
import Button from "../components/Button";
import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Spinner from 'react-spinner-material';
// import Calendar from "../components/Calendar";
// import ReadingTimeTable from "../components/ReadingTimeTable";
import AddScreenTimeModal from "../components/AddScreenTimeModal";
import TimeSwapInformationPage from "./TimeSwapInformationPage";
import WeeklyDashboard from "../components/WeeklyDashboard";
import { setReadingTimeForToday } from "../reducers/readingTimeForTodaySlice";

const TimeSwap = () => {
    const [hasScreenTimeData, setHasScreenTimeData] = useState(false);

    const [isOpenAddScreenTime, setIsOpenAddScreenTime] = useState(false);
    const [hasAlreadyAddedScreenTime, setHasAlreadyAddedScreenTime] = useState(false);
    // const [readingTimeData, setReadingTimeData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const { user } = useAuthContext();



    const checkScreenTimeData = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/time-swap/reading-time`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                }
            });

            if (response.ok) {
                const data = await response.json();
                if (data.readingTimePerDay.length > 0) {
                    // setReadingTimeData(data.readingTimePerDay);
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
        const fetchData = async () => {
            setIsLoading(true);
            await checkScreenTimeData();
            setIsLoading(false);
        };

        fetchData();
    }, [user.token, checkScreenTimeData]);

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
                        <WeeklyDashboard />
                    }
                </>
            )}
        </>

    );
};

export default TimeSwap;