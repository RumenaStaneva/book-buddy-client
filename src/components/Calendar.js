import { useState, useEffect, useRef } from 'react';
import Cleave from 'cleave.js/react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import Error from './Error';


const { startOfWeek, endOfWeek, eachDayOfInterval, format, subWeeks } = require('date-fns');

const Calendar = () => {
    const [screenTimeData, setScreenTimeData] = useState(Array(7).fill({ date: '', time: '00:00' }));
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [datesFromLastWeek, setDatesFromLastWeek] = useState([]);
    const { user } = useAuthContext();
    const dispatchError = useDispatch();

    const handleInputChange = (index, value, dateOfWeek) => {
        console.log(dateOfWeek);
        const newData = [...screenTimeData];
        newData[index] = value;
        setScreenTimeData(newData);
    };
    //get the days for the last week and add them in daysOfWeek
    useEffect(() => {
        // Get the current date (replace this with actual current date)
        const currentDate = new Date();

        // Get the start and end of the last week (Monday to Sunday)
        const lastWeekStart = startOfWeek(subWeeks(currentDate, 1), { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(subWeeks(currentDate, 1), { weekStartsOn: 1 });

        // Get all the dates from Monday to Sunday of the last week
        const datesFromLastWeek = eachDayOfInterval({ start: lastWeekStart, end: lastWeekEnd });

        console.log(datesFromLastWeek);
        const formattedDates = datesFromLastWeek.map(date => format(date, 'MMMM dd, yyyy'));

        setDatesFromLastWeek(formattedDates);

        setScreenTimeData(prevState => {
            return prevState.map((item, index) => {
                return {
                    date: formattedDates[index]
                };
            });
        });
    }, []);


    const convertToSeconds = (time) => {
        console.log(time);
        const [hours, minutes] = time.split(':');
        return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60;
    };

    const saveScreenTime = async () => {
        const screenTimeInSeconds = screenTimeData.map((time, index) => {
            const selectedDate = new Date();
            console.log(selectedDate);
            selectedDate.setDate(selectedDate.getDate() - 7 + index);
            const timestamp = selectedDate.getTime();
            console.log(timestamp);
            return {
                date: daysOfWeek[screenTimeData.indexOf(time)],
                timeInSecond: convertToSeconds(time)
            }
        });

        // console.log(screenTimeInSeconds);
        try {
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
        } catch (error) {
            dispatchError(setError({ message: error.message }));
        }

    };




    return (
        <div className="calendar-container">
            <Error />
            <div className="input-fields d-flex">
                {screenTimeData.map((item, index) => (
                    <div key={index} className="input-field">
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
        </div>
    );
};

export default Calendar;
