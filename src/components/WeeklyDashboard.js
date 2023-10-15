import { useState, useEffect } from "react";
import Spinner from 'react-spinner-material';
import Error from '../components/Error';
import '../styles/ReadingTimeTable.css'
import CountdownReading from "./CountdownReading";
import { useSelector } from "react-redux";


// import { startOfWeek, endOfWeek, eachDayOfInterval, format, subWeeks, parse, addWeeks } from 'date-fns';



const WeeklyDashboard = ({ readingTimeData }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    // const [isLoading, setIsLoading] = useState(false);

    const { currentlyReadingBooks } = useSelector((state) => state.books);
    const isLoadingBooks = useSelector((state) => state.books.isLoading);
    const { screenTimeInSeconds } = useSelector((state) => state.readingTimeForToday)

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

    function formatDateDDMMWithDayOfWeek(dateString) {
        const inputDate = new Date(dateString);
        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const weekDay = getDayOfWeek(dateString)
        return (
            <>
                <p>{`${day}.${month}`}</p>
                <p>{weekDay}</p>
            </>
        );
    }

    const formatDateDDMM = (date) => {
        const inputDate = new Date(date);
        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        const formattedDate = `${day}.${month}`;
        return formattedDate;
    }

    //TODO add logic and design when user has not added data for this week

    useEffect(() => {
        const currentIndex = readingTimeData.findIndex(data => formatDateDDMM(data.date) === formatDateDDMM(new Date()));
        setSelectedTab(currentIndex !== -1 ? currentIndex : 0);
    }, [readingTimeData]);

    const handleTabClick = (index) => {
        setSelectedTab(index);
    };

    return (
        isLoadingBooks ?
            (<div className='spinner__container'>
                <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
            </div>)
            : <>
                <Error />
                <div className="table-container">

                    <div className="tabs-container">
                        <div className="tab-headers header-row d-flex">
                            {readingTimeData.length > 0 &&
                                readingTimeData.map((data, index) => {
                                    const cellClassName = `header-cell ${getCellClassName(data.date)}`;
                                    const tabContent = formatDateDDMMWithDayOfWeek(data.date);
                                    return (
                                        <div
                                            key={index}
                                            className={`tab-header ${cellClassName} ${selectedTab === index ? 'active' : ''}`}
                                            onClick={() => handleTabClick(index)}
                                        >
                                            {tabContent}
                                        </div>
                                    );
                                })}
                        </div>
                        <div className="tab-content">
                            {selectedTab !== null && (
                                <div className="tab-panel-content">
                                    {formatDateDDMM(readingTimeData[selectedTab].date) === formatDateDDMM(new Date()) ? (
                                        <CountdownReading currentlyReadingBooks={currentlyReadingBooks} screenTimeInSeconds={screenTimeInSeconds} isLoadingBooks={isLoadingBooks} />
                                    ) : (
                                        <div>
                                            <p>Today you need to read {convertSecondsToHoursMinutes(readingTimeData[selectedTab].screenTimeInSeconds)}</p>
                                            <p>Time you have spend reading {convertSecondsToHoursMinutes(readingTimeData[selectedTab].timeInSecondsForTheDayReading)}</p>
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>
                </div >


            </>

    );
};


export default WeeklyDashboard;
