import { useState, useEffect, useCallback } from "react";
import Spinner from 'react-spinner-material';
import { useAuthContext } from '../hooks/useAuthContext';
import Error from '../components/Error';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import { startOfWeek, endOfWeek, eachDayOfInterval, format, subWeeks, parseISO } from 'date-fns';
import '../styles/ReadingTimeTable.css'

const ReadingTimeTable = () => {
    const [readingTimeData, setReadingTimeData] = useState([]);
    const [month, setMonth] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useAuthContext();
    const dispatchError = useDispatch();

    const fetchUserData = useCallback(async () => {
        const currentDate = new Date();
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
            console.log(data);
            setReadingTimeData(data.readingTimePerDay);
            setMonth(new Intl.DateTimeFormat('en-US', { month: 'long' }).format(new Date(data.readingTimePerDay[0].date)));
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
            fetchUserData();
        }
    }, [user, fetchUserData]);

    const formatDate = (date) => {
        const inputDate = new Date(date);
        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const year = inputDate.getUTCFullYear().toString();

        const formattedDate = `${day}.${month}.${year}`;
        return formattedDate;
    }
    return (
        isLoading ?
            (<div className='spinner__container'>
                <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
            </div>)
            : <>
                <h1>{month}</h1>
                <h2>Reading Time Summary</h2>
                <table className="table-container">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Reading Time (in seconds)</th>
                            <th>Goal Achieved</th>
                            <th>Weekly Goal Average</th>
                            <th>Reading Time for the Day</th>
                        </tr>
                    </thead>
                    <tbody>
                        {readingTimeData.length > 0 ?
                            readingTimeData.map((data, index) => (
                                <tr key={index}>
                                    <td>{formatDate(data.date)}</td>
                                    <td>{data.screenTimeInSeconds}</td>
                                    <td>{data.goalAchievedForTheDay ? 'yes' : 'no'}</td>
                                    <td>{data.weeklyGoalAveragePerDay}</td>
                                    <td>{data.timeInSecondsForTheDayReading}</td>
                                </tr>
                            )) : null}
                    </tbody>
                </table>
            </>
    );
};

export default ReadingTimeTable;
