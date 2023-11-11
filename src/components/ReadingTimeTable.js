import { useState, useEffect, useCallback } from "react";
import Spinner from 'react-spinner-material';
import { useAuthContext } from '../hooks/useAuthContext';
import Error from '../components/Error';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import { REACT_APP_LOCAL_HOST } from "../functions";

const ReadingTimeTable = () => {
    const [readingTimeData, setReadingTimeData] = useState([]);
    const [month, setMonth] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [startWeek, setStartWeek] = useState('');
    const [endWeek, setEndWeek] = useState('');
    const { user } = useAuthContext();
    const dispatchError = useDispatch();

    const fetchReadingTime = useCallback(async () => {
        setIsLoading(true);
        try {
            //todo fix not correct path
            const response = await fetch(`${REACT_APP_LOCAL_HOST}/time-swap/reading-time`, {
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
            setReadingTimeData(data.readingTimePerDay);
            setMonth(new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(data.readingTimePerDay[0].date)));
            setStartWeek(formatDateDDMM(data.readingTimePerDay[0].date));
            setEndWeek(formatDateDDMM(data.readingTimePerDay[6].date));
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

    const formatDateDDMMYYYY = (date) => {
        const inputDate = new Date(date);
        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = inputDate.getUTCFullYear().toString();

        const formattedDate = `${day}.${month}.${year}`;
        return formattedDate;
    }

    const formatDateDDMM = (date) => {
        const inputDate = new Date(date);
        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based

        const formattedDate = `${day}.${month}`;
        return formattedDate;
    }

    function convertSecondsToHoursMinutes(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}`;
    }

    return (
        isLoading ?
            (<div className='spinner__container'>
                <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
            </div>)
            : <>
                <h1>{month} {startWeek} - {endWeek}</h1>
                <h2>Reading Time Summary</h2>
                <table className="table-container">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Screen Time for the Day</th>
                            <th>Goal Achieved</th>
                            <th>Weekly Goal Average</th>
                            <th>Reading Time for the Day</th>
                        </tr>
                    </thead>
                    <tbody>
                        {readingTimeData.length > 0 ?
                            readingTimeData.map((data, index) => (
                                <tr key={index}>
                                    <td>{formatDateDDMMYYYY(data.date)}</td>
                                    <td>{convertSecondsToHoursMinutes(data.screenTimeInSeconds)}</td>
                                    <td>{data.goalAchievedForTheDay ? 'yes' : 'no'}</td>
                                    <td>{convertSecondsToHoursMinutes(data.weeklyGoalAveragePerDay)}</td>
                                    <td>{convertSecondsToHoursMinutes(data.timeInSecondsForTheDayReading)}</td>
                                </tr>
                            )) : null}
                    </tbody>
                </table>
            </>
    );
};

export default ReadingTimeTable;
