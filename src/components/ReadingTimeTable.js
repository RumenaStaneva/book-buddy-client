import { useState, useEffect, useCallback } from "react";
import Spinner from 'react-spinner-material';
import { useAuthContext } from '../hooks/useAuthContext';
import Error from '../components/Error';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';


const ReadingTimeTable = () => {
    const [readingTimeData, setReadingTimeData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuthContext();
    const dispatchError = useDispatch();

    const fetchUserData = useCallback(async () => {
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
            setReadingTimeData(data)
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
    return (
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Reading Time Goal (in seconds)</th>
                </tr>
            </thead>
            <tbody>
                {/* {readingTimeData.map((data, index) => (
                    <tr key={index}>
                        <td>{data.date}</td>
                        <td>{data.screenTimeInSeconds}</td>
                        <td>{data.goalAchievedForTheDay}</td>
                        <td>{data.weeklyGoalAveragePerDay}</td>
                        <td>{data.timeInSecondsForTheDayReading}</td>
                    </tr>
                ))} */}
            </tbody>
        </table>
    );
};

export default ReadingTimeTable;
