import { useState, useEffect, useCallback } from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Spinner from 'react-spinner-material';
import { useAuthContext } from '../hooks/useAuthContext';
import Error from '../components/Error';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import '../styles/ReadingTimeTable.css'
import CountdownReading from "./CountdownReading";
import Timer from "./Timer";

const formatDateDDMM = (date) => {
    const inputDate = new Date(date);
    const day = inputDate.getUTCDate().toString().padStart(2, '0');
    const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const formattedDate = `${day}.${month}`;
    return formattedDate;
}

const WeeklyDashboard = () => {
    const [readingTimeData, setReadingTimeData] = useState([]);
    // const [month, setMonth] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // const [startWeek, setStartWeek] = useState('');
    // const [endWeek, setEndWeek] = useState('');
    const { user } = useAuthContext();
    const dispatchError = useDispatch();
    const [selectedDate, setSelectedDate] = useState(formatDateDDMM(new Date()));

    const fetchReadingTime = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/time-swap/reading-time`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (response.status === 401) {
                dispatchError(setError({ message: 'Unauthorized access' }));
                console.error('Unauthorized access');
                return;
            }

            const data = await response.json();
            // console.log('readingTimePerDay', data);
            setReadingTimeData(data.readingTimePerDay);
            // setMonth(new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(data.readingTimePerDay[0].date)));
            // setStartWeek(formatDateDDMM(data.readingTimePerDay[0].date));
            // setEndWeek(formatDateDDMM(data.readingTimePerDay[6].date));
            setIsLoading(false);
            dispatchError(clearError());
        } catch (error) {
            dispatchError(setError({ message: `Error fetching user data: ${error}` }));
            console.error('Error fetching user data: ', error);
            setIsLoading(false);
        }
    }, [user, dispatchError]);

    useEffect(() => {
        if (user && user.token) {
            fetchReadingTime();
        }
    }, [user, fetchReadingTime]);

    // const formatDateDDMMYYYY = (date) => {
    //     const inputDate = new Date(date);
    //     const day = inputDate.getUTCDate().toString().padStart(2, '0');
    //     const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    //     const year = inputDate.getUTCFullYear().toString();

    //     const formattedDate = `${day}.${month}.${year}`;
    //     return formattedDate;
    // }

    // const formatDateDDMM = (date) => {
    //     const inputDate = new Date(date);
    //     const day = inputDate.getUTCDate().toString().padStart(2, '0');
    //     const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based

    //     const formattedDate = `${day}.${month}`;
    //     return formattedDate;
    // }

    function convertSecondsToHoursMinutes(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}`;
    }

    function getDayOfWeek(dateString) {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dateParts = dateString.split('-');
        const year = parseInt(dateParts[0]);
        const month = parseInt(dateParts[1]) - 1;
        const day = parseInt(dateParts[2]);
        const date = new Date(year, month, day);
        const dayOfWeek = daysOfWeek[date.getDay()];
        return dayOfWeek;
    }

    function getCellClassName(dateString) {
        const currentDate = new Date();
        const cellDate = new Date(dateString);

        // set time to midnight for both dates
        cellDate.setUTCHours(0, 0, 0, 0);
        currentDate.setUTCHours(0, 0, 0, 0);

        if (cellDate < currentDate) {
            return 'disabled';
        } else if (cellDate.toISOString().split('T')[0] === currentDate.toISOString().split('T')[0]) {
            return 'today';
        } else {
            return 'future';
        }
    }

    const handleDateChange = (event, newDate) => {
        setSelectedDate(newDate);
    };


    function formatDateDDMMWithDayOfWeek(dateString) {
        const inputDate = new Date(dateString);
        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const weekDay = getDayOfWeek(dateString)
        return (
            <div>
                <p>{`${day}.${month}`}</p>
                <p>{weekDay}</p>
            </div>
        );
    }

    //TODO add logic and design when user has not added data for this week

    return (
        isLoading ?
            (<div className='spinner__container'>
                <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
            </div>)
            : <>
                <Error />
                <div className="table-container">
                    <Tabs value={selectedDate}
                        onChange={handleDateChange}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="scrollable"
                        scrollButtons="auto"
                        className="header-row d-flex">
                        {readingTimeData.length > 0 &&
                            readingTimeData.map((data, index) => {
                                const cellClassName = `header-cell ${getCellClassName(data.date)}`;
                                const tabContent = formatDateDDMMWithDayOfWeek(data.date);
                                return (
                                    <Tab className={cellClassName} key={index} label={tabContent} value={formatDateDDMM(data.date)}>
                                    </Tab >
                                )
                            })}
                        {/* <div className="header-cell total-cell">
                            <Tab label="Total Time" value="total" />
                        </div> */}
                    </Tabs>
                    {selectedDate === formatDateDDMM(new Date()) ?
                        <CountdownReading />
                        :
                        readingTimeData.length > 0 &&
                        readingTimeData.map((data, index) => {
                            const formattedDate = formatDateDDMM(data.date);
                            if (formattedDate === selectedDate) {
                                return (
                                    <div key={index}>
                                        <p>Today you need to read {convertSecondsToHoursMinutes(data.screenTimeInSeconds)}</p>
                                        <p>Time you have spend reading {convertSecondsToHoursMinutes(data.timeInSecondsForTheDayReading)}</p>
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })

                    }

                </div >


            </>

    );
};


export default WeeklyDashboard;
