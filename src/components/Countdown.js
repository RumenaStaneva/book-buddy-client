import { useState, useEffect, useRef, useCallback } from 'react';
import Cleave from 'cleave.js/react';
import Button from './Button';
import UpdateBookProgressModal from './UpdateBookProgressModal';
import { useDispatch, useSelector } from 'react-redux';
import { setTimerStarted, setCurrentlyReadingBook } from '../reducers/timerSlice';
import { setTimeInSecondsLeftForAchievingReadingGoal, updateReadingDataInDatabase } from '../reducers/readingTimeForTodaySlice'
import '../styles/Countdown.css'
import { useAuthContext } from '../hooks/useAuthContext';

const Countdown = ({ screenTimeSeconds, currentlyReadingBooks, activeIndex }) => {
    const dispatch = useDispatch();
    const { timerStarted } = useSelector((state) => state.timer);
    const { dateToday, timeInSecondsLeftForAchievingReadingGoal, timeInSecondsForTheDayReading, weeklyGoalAveragePerDay, totalReadingGoalForTheDay } = useSelector((state) => state.readingTimeForToday);
    const { user } = useAuthContext();
    const [timeLeft, setTimeLeft] = useState(timeInSecondsLeftForAchievingReadingGoal);
    const [updateProgressModalIsOpen, setUpdateProgressModalIsOpen] = useState(false);
    const [timerActive, setTimerActive] = useState(false);
    const [timerFinished, setTimerFinished] = useState(false);
    const [isChangeGoalVisible, setIsChangeGoalVisible] = useState(false);
    const [timePassed, setTimePassed] = useState(timeInSecondsForTheDayReading);
    const [formattedTime, setFormattedTime] = useState('');
    const cleaveInputRef = useRef(null);

    const updateTimer = useCallback(() => {
        setTimeLeft((prevTime) => {
            if (prevTime > 0) {
                setTimePassed((prevTimePassed) => prevTimePassed + 0.5); // Update time passed every second, why it is 0.5 no idea if it is one it doubles || this is possible to break 
                return prevTime - 1;
            } else {
                dispatch(setTimerStarted(false));
                setTimerActive(false);
                setTimerFinished(true);
                setUpdateProgressModalIsOpen(true);
                setTimeLeft(0);
                return 0;
            }
        })
    }, [setTimePassed, dispatch, setTimerActive, setTimerFinished, setUpdateProgressModalIsOpen]);

    useEffect(() => {
        setTimeLeft(timeInSecondsLeftForAchievingReadingGoal);
    }, [timeInSecondsLeftForAchievingReadingGoal]);

    useEffect(() => {
        // Update timePassed whenever timeInSecondsForTheDayReading changes
        setTimePassed(timeInSecondsForTheDayReading);
    }, [timeInSecondsForTheDayReading]);

    useEffect(() => {
        let interval;
        if (timerActive) {
            interval = setInterval(updateTimer, 1000);
        } else {
            clearInterval(interval); // Clear interval if the timer is stopped
        }
        return () => clearInterval(interval);
    }, [timerActive, updateTimer]);

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        setIsChangeGoalVisible(false);
        dispatch(setCurrentlyReadingBook(currentlyReadingBooks[activeIndex]));
        dispatch(setTimerStarted(true));
        setTimerActive(true);
    };

    const stopTimer = () => {
        dispatch(setTimeInSecondsLeftForAchievingReadingGoal(timeLeft));
        const currentTimePassed = timePassed;
        dispatch(updateReadingDataInDatabase({ date: dateToday, totalReadingGoalForTheDay, timeInSecondsForTheDayReading: currentTimePassed, user }))
        dispatch(setTimerStarted(false));
        setUpdateProgressModalIsOpen(true);
        setTimerActive(false);
    };

    const changeTime = (newTime) => {
        dispatch(updateReadingDataInDatabase({ date: dateToday, totalReadingGoalForTheDay: newTime, timeInSecondsForTheDayReading: timePassed, user }));
        setIsChangeGoalVisible(false);
    }

    return (
        <div className="countdown-container">
            {updateProgressModalIsOpen && <UpdateBookProgressModal setIsOpen={setUpdateProgressModalIsOpen} timerFinished={timerFinished} />}

            {timerFinished ? (
                <h2 className="countdown-message">Countdown Timer has finished!</h2>
            ) : (
                <h2 className="countdown-message">Countdown: {formatTime(timeLeft)}</h2>
            )}

            {timerFinished ? (
                <Button onClick={() => setTimerFinished(false)} className="cta-btn">
                    Reset Timer
                </Button>
            ) : (
                <>
                    {!timerStarted &&
                        <div className="goal-section">
                            <p>Is your goal for today too high?</p>
                            <Button className="cta-btn" onClick={() => setIsChangeGoalVisible(!isChangeGoalVisible)}>Adjust Goal</Button>
                        </div>
                    }

                    {isChangeGoalVisible &&
                        <div className="goal-section">
                            <p>Choose an achievable goal:</p>
                            <div className='d-flex'>
                                <div className='goal__subsection'>
                                    <p>Screen time spent last week:</p>
                                    <Button className="goal-button" onClick={() => changeTime(screenTimeSeconds)}>{formatTime(screenTimeSeconds)}</Button>
                                </div>
                                <div className='goal__subsection'>
                                    <p>Your weekly average:</p>
                                    <Button className="goal-button" onClick={() => changeTime(weeklyGoalAveragePerDay)}>{formatTime(weeklyGoalAveragePerDay)}</Button>
                                </div>
                                <div className='goal__subsection'>
                                    <p>Add custom reading time:</p>
                                    <Cleave
                                        ref={cleaveInputRef}
                                        className="goal-input"
                                        options={{ time: true, timePattern: ['h', 'm'] }}
                                        placeholder="Enter time in HH:MM format"
                                        value={formattedTime}
                                        onChange={(e) => setFormattedTime(e.target.value)}

                                    />
                                    <Button onClick={() => {
                                        const timeArray = formattedTime.split(':');
                                        const hours = parseInt(timeArray[0]) || 0;
                                        const minutes = parseInt(timeArray[1]) || 0;
                                        const seconds = (hours * 3600) + (minutes * 60);
                                        changeTime(seconds);
                                    }}>Set</Button>
                                </div>
                            </div>
                        </div>
                    }
                    {!isChangeGoalVisible &&
                        <div className="countdown__action-buttons d-flex">
                            <Button disabled={timerStarted} onClick={startTimer} className="cta-btn">
                                Start Timer
                            </Button>
                            <Button disabled={!timerStarted} onClick={stopTimer} className="cta-btn">
                                Stop Timer
                            </Button>
                        </div>
                    }

                    {!timerStarted &&
                        <p className="time-info">Reading time achieved: {formatTime(timeInSecondsForTheDayReading)}</p>
                    }
                </>
            )}
        </div>

    )
}

export default Countdown;
