import NavBar from "../components/NavBar";
import Countdown from "../components/Countdown";
import Button from "../components/Button";
import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import Calendar from "../components/Calendar";
import ReadingTimeTable from "../components/ReadingTimeTable";
import AddScreenTimeModal from "../components/AddScreenTimeModal";
import TimeSwapInformationPage from "./TimeSwapInformationPage";

const TimeSwap = () => {
    const [hasScreenTimeData, setHasScreenTimeData] = useState(false);

    const [isOpenAddScreenTime, setIsOpenAddScreenTime] = useState(false);
    const [hasAlreadyAddedScreenTime, setHasAlreadyAddedScreenTime] = useState(false);
    const [readingTimeData, setReadingTimeData] = useState();
    // Set the total seconds for the countdown
    const [seconds, setSeconds] = useState(0);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const { user } = useAuthContext();
    const handleChange = (e) => {
        setSeconds(e.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setTotalSeconds(seconds);
        setSeconds(0);
    }

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
                    setReadingTimeData(data.readingTimePerDay);
                    setHasScreenTimeData(true);
                    setHasAlreadyAddedScreenTime(true);
                }
            } else {
                setHasAlreadyAddedScreenTime(false);
                throw new Error('Error checking screen time data existence');
            }
        } catch (error) {
            setHasAlreadyAddedScreenTime(false);
            console.error('Error:', error);
        }
    }, [user.token]);
    useEffect(() => {
        checkScreenTimeData();
    }, [user.token, checkScreenTimeData]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/time-swap/user-screen-time-data`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setHasScreenTimeData(data.hasScreenTimeData);
                } else {
                    throw new Error('Error checking screen time data existence');
                }
            } catch (error) {
                console.error('Error fetching user screen time data: ', error);
            }
        };

        fetchData();
    }, [user.token]);


    return (
        <>
            <NavBar />
            {isOpenAddScreenTime && <AddScreenTimeModal setIsOpen={setIsOpenAddScreenTime} checkScreenTimeData={checkScreenTimeData} />}
            {/* <form onSubmit={handleSubmit}>
                <input type="number" value={seconds} onChange={handleChange} />a
                <Button type="submit" onClick={handleSubmit}>Submit</Button>
            </form> */}

            {/* <Countdown seconds={totalSeconds} /> */}
            {!hasScreenTimeData ?
                <TimeSwapInformationPage setIsOpenAddScreenTime={setIsOpenAddScreenTime} />
                :
                hasAlreadyAddedScreenTime ?
                    <ReadingTimeTable readingTimeData={readingTimeData} />
                    :
                    <Button onClick={() => setIsOpenAddScreenTime(true)}>Add your screen time for the previous week</Button>

            }
        </>
    );
};

export default TimeSwap;