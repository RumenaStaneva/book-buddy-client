import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import Spinner from 'react-spinner-material';

import { useDispatch, useSelector } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import '../styles/Profile.css'
import { fetchHasReadingTimeAnytime, fetchReadingTimeForTheWeek, setDataRange } from "../reducers/readingTimeForTodaySlice";
import Chart from '../components/Chart';
import Dropdown from '../components/Dropdown';
import { format } from 'date-fns';

function Diagram() {
    const { currentWeekData, hasReadingTimeAnytime, dataRange, isLoading } = useSelector((state) => state.readingTimeForToday);
    const { user } = useAuthContext();
    const dispatchRedux = useDispatch();
    const [screenData, setScreenData] = useState([]);
    const [readingData, setReadingData] = useState([]);
    const [readingGoal, setReadingGoal] = useState([]);
    const [dates, setDates] = useState([]);


    useEffect(() => {
        dispatchRedux(fetchReadingTimeForTheWeek({ user, dataRange }));
        dispatchRedux(fetchHasReadingTimeAnytime(user));

    }, [dispatchRedux, user, dataRange])

    useEffect(() => {
        if (currentWeekData) {
            if (currentWeekData) {
                const newScreenData = currentWeekData.map(day => day.screenTimeInSeconds);
                const newReadingData = currentWeekData.map(day => day.timeInSecondsForTheDayReading);
                const totalReadingGoalForTheDay = currentWeekData.map(day => day.totalReadingGoalForTheDay);
                // const dates = currentWeekData.map(day => day.date);
                const dates = currentWeekData.map(day => format(new Date(day.date), 'dd.MM.yyyy'));
                console.log(dates);
                setScreenData(newScreenData);
                setReadingData(newReadingData);
                setReadingGoal(totalReadingGoalForTheDay);
                setDates(dates);
            }
        }
    }, [dispatchRedux, user, currentWeekData]);

    const handleCategorySelect = (selectedRange) => {
        dispatchRedux(setDataRange(selectedRange));
    };
    const dropdownOptions = ['Current week', 'Last week', 'Last 3 weeks', 'Anytime'];
    const labelsWeekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <>
            {hasReadingTimeAnytime ? (
                isLoading ? (
                    <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                ) : (
                    <div>
                        {/* todo fix logic for anytime */}
                        <Dropdown
                            options={dropdownOptions}
                            onSelect={handleCategorySelect}
                            selectedOption={dataRange !== null ? dataRange : 'Pick a Time Frame'}
                        />

                        {currentWeekData && currentWeekData.length > 0 ? (
                            <Chart
                                screenData={screenData}
                                readingData={readingData}
                                readingGoal={readingGoal}
                                labels={
                                    dataRange === 'Last 3 weeks' || dataRange === 'Anytime'
                                        ? dates
                                        : labelsWeekDays
                                }
                            />
                        ) : (
                            <p>No data available for the chart.</p>
                        )}
                    </div>
                )
            ) : (
                <p>No data available for the chart.</p>
            )}
        </>
    )
}

export default Diagram;