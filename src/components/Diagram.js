import { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import Spinner from 'react-spinner-material';
import { useDispatch, useSelector } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import '../styles/Profile.scss'
import { fetchHasReadingTimeAnytime, fetchReadingTimeForTheWeek, setDataRange } from "../reducers/readingTimeForTodaySlice";
import Chart from '../components/Chart';
import Dropdown from '../components/Dropdown';
import { format, startOfWeek, endOfWeek, differenceInDays, } from 'date-fns';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function Diagram() {
    const { currentWeekData, hasReadingTimeAnytime, dataRange, isLoading } = useSelector((state) => state.readingTimeForToday);
    const { user } = useAuthContext();
    const dispatchRedux = useDispatch();
    const [screenData, setScreenData] = useState([]);
    const [readingData, setReadingData] = useState([]);
    const [readingGoal, setReadingGoal] = useState([]);
    const [dates, setDates] = useState([]);
    const [selectedDateRange, setSelectedDateRange] = useState([startOfWeek(new Date(), { weekStartsOn: 1 }), endOfWeek(new Date(), { weekStartsOn: 1 })]);
    const dropdownOptions = ['Current week', 'Last week', 'Last 3 weeks', 'Custom range'];
    const labelsWeekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const [isCalendarVisible, setCalendarVisible] = useState(true);
    const calendarRef = useRef(null);

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
                const dates = currentWeekData.map(day => format(new Date(day.date), 'dd.MM.yyyy'));
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

    const handleCalendarChange = (dates, event) => {
        dispatchRedux(clearError());
        if (dates.length === 2) {
            const start = startOfWeek(dates[0], { weekStartsOn: 1 });
            const end = endOfWeek(dates[1], { weekStartsOn: 1 });
            const durationInDays = differenceInDays(end, start);

            if (durationInDays === 6) {
                setSelectedDateRange([start, end]);
            } else {
                dispatchRedux(setError({ message: 'Please select a 7-day range within the same week.' }))
            }
        }
    };

    useEffect(() => {
        const startDate = selectedDateRange[0];
        const endDate = selectedDateRange[1];

        dispatchRedux(fetchReadingTimeForTheWeek({ user, dataRange: 'Custom range', startDate, endDate }));
        dispatchRedux(fetchHasReadingTimeAnytime(user));
    }, [dispatchRedux, user, selectedDateRange]);

    const handleClickOutside = (event) => {
        const calendarContainer = calendarRef.current;
        if (
            calendarContainer &&
            !calendarContainer.contains(event.target) &&
            event.target.getAttribute('data-calendar-container') !== 'true' &&
            event.target.getAttribute('react-calendar__navigation') !== 'true'
        ) {
            setCalendarVisible(false);
        }
    };

    const handleCalendarClick = (e) => {
        if (e.target.className === 'react-calendar') {
            setCalendarVisible(!isCalendarVisible);
        }
    };

    useEffect(() => {
        if (isCalendarVisible) {
            document.addEventListener('click', handleClickOutside);
        } else {
            document.removeEventListener('click', handleClickOutside);
        }
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isCalendarVisible]);
    return (
        <>
            {hasReadingTimeAnytime ? (
                isLoading ? (
                    <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                ) : (
                    <div className='diagram__container'>
                        <div className='d-flex range-calendar__container'>

                            <Dropdown
                                options={dropdownOptions}
                                onSelect={handleCategorySelect}
                                selectedOption={dataRange !== null ? dataRange : 'Pick a Time Frame'}
                            />
                            {dataRange === 'Custom range' ?
                                <div className={`calendar-container ${!isCalendarVisible ? 'calendar-hidden' : ''}`}
                                    onClick={(e) => handleCalendarClick(e)}
                                >
                                    <Calendar
                                        inputRef={calendarRef}
                                        onClickDay={(value, event) => {
                                            event.stopPropagation();
                                            handleCalendarChange(value);
                                        }}

                                        onActiveStartDateChange={({ action, activeStartDate, value, view }) => {
                                            if (action === 'next' || action === 'drillDown' || action === 'drillUp' || action === 'prev') {
                                                setCalendarVisible(true);
                                            }
                                        }}
                                        onClickMonth={(value, event) => {
                                            event.stopPropagation();
                                            setCalendarVisible(true);
                                        }}
                                        onChange={handleCalendarChange}
                                        value={selectedDateRange}
                                        selectRange={true}
                                        maxDate={endOfWeek(new Date(), { weekStartsOn: 1 })}
                                    />
                                </div>
                                : null}
                        </div>

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
                <p>No reading data available.</p>
            )}
        </>
    )
}

export default Diagram;