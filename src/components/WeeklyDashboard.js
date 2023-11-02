import { useState, useEffect, useRef } from "react";
import Spinner from 'react-spinner-material';
import CountdownReading from "./CountdownReading";
import { useSelector } from "react-redux";
import Button from "./Button";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';


const WeeklyDashboard = ({ readingTimeData, setIsOpenAddScreenTime }) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const { currentlyReadingBooks } = useSelector((state) => state.books);
    const isLoadingBooks = useSelector((state) => state.books.isLoading);
    const { screenTimeInSeconds } = useSelector((state) => state.readingTimeForToday);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const swiperRef = useRef(null);

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(selectedTab);
        }
    }, [selectedTab]);

    const handleSwiperInit = (swiper) => {
        swiperRef.current = swiper;
        swiper.on('slideChange', () => {
            const activeIndex = swiper.activeIndex;
            setSelectedTab(activeIndex);
        });
    };

    function convertSecondsToHoursMinutesSeconds(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
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

    useEffect(() => {
        if (readingTimeData) {
            const currentIndex = readingTimeData.findIndex(data => formatDateDDMM(data.date) === formatDateDDMM(new Date()));
            setSelectedTab(currentIndex !== -1 ? currentIndex : 0);
        }
    }, [readingTimeData]);

    const handleTabClick = (index) => {
        setSelectedTab(index);
    };

    useEffect(() => {
        const handleResize = () => {
            console.log('window.innerWidth <= 768', window.innerWidth <= 768);
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);


    return (
        isLoadingBooks ? (
            <div className='spinner__container'>
                <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
            </div>
        ) : (
            <main className="weekly-dashboard">
                <h1 className="heading">Time Swap</h1>
                {!readingTimeData || !readingTimeData.length > 0 ? (
                    <>
                        <h1 className="heading">No reading time data for this week</h1>
                        <Button className="cta-btn" onClick={() => { setIsOpenAddScreenTime(true); document.body.style.overflow = 'visible'; }}>Add from here</Button>
                    </>
                ) : (
                    <div className="table-container">
                        <div className="tabs-container">
                            <div className="tab-headers header-row d-flex">
                                {isMobile ? (
                                    <Swiper
                                        spaceBetween={50}
                                        slidesPerView={1}
                                        onSwiper={handleSwiperInit}
                                        initialSlide={selectedTab}
                                        navigation={true}
                                        modules={[Navigation]}
                                    >
                                        {readingTimeData.map((data, index) => {
                                            const cellClassName = `header-cell ${getCellClassName(data.date)}`;
                                            const tabContent = formatDateDDMMWithDayOfWeek(data.date);
                                            return (
                                                <SwiperSlide
                                                    key={index}
                                                    className={`tab-header ${cellClassName} ${selectedTab === index ? 'active' : ''}`}
                                                    onClick={() => handleTabClick(index)}
                                                    navigation={true}
                                                >
                                                    {tabContent}
                                                </SwiperSlide>
                                            );
                                        })}
                                    </Swiper>) : (

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
                                    })


                                )}
                            </div>
                            <div className="tab-content">
                                {selectedTab !== null && (
                                    <div className="tab-panel-content">
                                        {formatDateDDMM(readingTimeData[selectedTab].date) === formatDateDDMM(new Date()) ? (
                                            <CountdownReading currentlyReadingBooks={currentlyReadingBooks} screenTimeInSeconds={screenTimeInSeconds} isLoadingBooks={isLoadingBooks} />
                                        ) : (
                                            <div>
                                                <p>Your screen time  for the day {convertSecondsToHoursMinutesSeconds(readingTimeData[selectedTab].screenTimeInSeconds)}</p>
                                                <p>Reading goal for the day {convertSecondsToHoursMinutesSeconds(readingTimeData[selectedTab].totalReadingGoalForTheDay)}</p>
                                                <p>Time you have spent reading {convertSecondsToHoursMinutesSeconds(readingTimeData[selectedTab].timeInSecondsForTheDayReading)}</p>

                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        )
    );

};


export default WeeklyDashboard;
