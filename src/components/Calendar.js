import { useState, useEffect, useRef } from 'react';
import Cleave from 'cleave.js/react';

const Calendar = () => {
    const [screenTimeData, setScreenTimeData] = useState(Array(7).fill({ date: '', time: '00:00' }));
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const cleaveRef = useRef(null);

    const handleInputChange = (index, value, dateOfWeek) => {
        console.log(dateOfWeek);
        const newData = [...screenTimeData];
        newData[index] = value;
        setScreenTimeData(newData);
    };
    // console.log(screenTimeData)

    //get the days for the last week and add them in daysOfWeek
    useEffect(() => {
        const currentDate = new Date();
        const days = Array(7).fill('').map((_, index) => {
            const day = new Date(currentDate);
            day.setDate(day.getDate() - 7 + index);
            return day.toLocaleDateString('en-GB', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
            });
        });
        setDaysOfWeek(days);
    }, []);

    const convertToSeconds = (time) => {
        console.log(time);
        const [hours, minutes] = time.split(':');
        return parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60;
    };

    const saveScreenTime = () => {
        const screenTimeInSeconds = screenTimeData.map(time => {
            return {
                date: daysOfWeek[screenTimeData.indexOf(time)],
                timeInSecond: convertToSeconds(time)
            }
        });
        console.log(screenTimeInSeconds);
    };

    return (
        <div className="calendar-container">
            <div className="input-fields d-flex">
                {screenTimeData.map((item, index) => (
                    <div key={index} className="input-field">
                        <label>{daysOfWeek[index]}</label>
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
