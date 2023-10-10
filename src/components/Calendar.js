import { useState, useEffect } from 'react';
import Cleave from 'cleave.js/react';
import Spinner from 'react-spinner-material';
import { useAuthContext } from '../hooks/useAuthContext';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import Error from './Error';
const { startOfWeek, endOfWeek, eachDayOfInterval, format, subWeeks } = require('date-fns');

const Calendar = () => {
    const [screenTimeData, setScreenTimeData] = useState(Array(7).fill({ date: '', time: '00:00' }));
    const [datesFromLastWeek, setDatesFromLastWeek] = useState([]);
    const [invalidInputs, setInvalidInputs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthContext();
    const dispatchError = useDispatch();

    //get the days for the last week and add them in daysOfWeek
    useEffect(() => {
        const currentDate = new Date();

        //the start and end of the last week (Monday to Sunday)
        const lastWeekStart = startOfWeek(subWeeks(currentDate, 1), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subWeeks(currentDate, 1), { weekStartsOn: 1 });
        const datesFromLastWeek = eachDayOfInterval({ start: lastWeekStart, end: lastWeekEnd });
        setDatesFromLastWeek(datesFromLastWeek);
        const formattedDates = datesFromLastWeek.map(date => format(date, 'MMMM dd, yyyy'));

        setScreenTimeData(prevState => {
            return prevState.map((item, index) => {
                console.log(item.time);
                return {
                    date: formattedDates[index],
                    time: item.time
                };
            });
        });
    }, []);
    const handleInputChange = (index, value) => {
        console.log(index, value);
        const newData = [...screenTimeData];
        newData[index] = {
            ...newData[index],
            time: value
        };
        setScreenTimeData(newData);
    };

    const convertToSeconds = (time, index) => {
        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!timePattern.test(time)) {
            setInvalidInputs((prevInvalidInputs) => [...prevInvalidInputs, index]);
            throw new window.Error('Invalid time format. Please use HH:MM format.');
        } else {
            dispatchError(clearError());
            setInvalidInputs((prevInvalidInputs) =>
                prevInvalidInputs.filter((item) => item !== index)
            );
            const [hours, minutes] = time.split(':');
            return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60;
        }

    };

    const saveScreenTime = async () => {
        setIsLoading(true);
        try {
            const formattedDates = datesFromLastWeek.map(date => format(date, 'yyyy/MM/dd'));
            const screenTimeInSeconds = screenTimeData.map((item, index) => {
                return {
                    date: formattedDates[index],
                    timeInSecond: convertToSeconds(item.time, index)
                }
            });
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/time-swap/save-time`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(screenTimeInSeconds),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            console.log('hurray' + data.savedScreenTimeData);
            setIsLoading(false);
            dispatchError(clearError());
        } catch (error) {
            setIsLoading(false);
            dispatchError(setError({ message: error.message }));
        }
    };




    return (
        <div className="calendar-container">
            {isLoading ?
                (<div className='spinner__container'>
                    <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                </div>) :
                <>
                    <Error />

                    <div className="input-fields d-flex">
                        {screenTimeData.map((item, index) => (
                            <div key={index} className={`input-field ${invalidInputs.includes(index) ? 'error' : ''}`}>
                                <label>{item.date}</label>
                                <Cleave
                                    options={{ time: true, timePattern: ['h', 'm'] }}
                                    placeholder="Enter time in HH:MM format"
                                    value={item.time}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                />
                            </div>
                        ))}
                    </div>
                    <button onClick={saveScreenTime}>Save Screen Time</button>
                </>

            }
        </div>
    );
};

export default Calendar;
