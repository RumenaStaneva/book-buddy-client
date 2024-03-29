import { useState, useEffect, useRef, useCallback } from 'react';
import useSound from 'use-sound';
import startSfx from '../sounds/start.mp3'
import stopSfx from '../sounds/stop.mp3'
import endSfx from '../sounds/end.mp3'
import Cleave from 'cleave.js/react';
import Button from './Button';
import UpdateBookProgressModal from './UpdateBookProgressModal';
import { useDispatch, useSelector } from 'react-redux';
import { setTimerStarted, setCurrentlyReadingBook, setTimerMode } from '../reducers/timerSlice';
import { setTimeInSecondsLeftForAchievingReadingGoal, updateReadingDataInDatabase, setGoalAchievedForTheDay } from '../reducers/readingTimeForTodaySlice'
import '../styles/Countdown.scss'
import { useAuthContext } from '../hooks/useAuthContext';
import { clearError, setError } from '../reducers/errorSlice';
import Error from './Error';
import PlaylistReading from "./PlaylistReading";



const Countdown = ({ screenTimeSeconds, currentlyReadingBooks, activeIndex }) => {
    const dispatch = useDispatch();
    const { timerStarted, currentlyReadingBook, timerMode } = useSelector((state) => state.timer);
    const { dateToday, timeInSecondsLeftForAchievingReadingGoal, timeInSecondsForTheDayReading, weeklyGoalAveragePerDay, totalReadingGoalForTheDay, goalAchievedForTheDay } = useSelector((state) => state.readingTimeForToday);
    const { user } = useAuthContext();
    const [timeLeft, setTimeLeft] = useState(timeInSecondsLeftForAchievingReadingGoal);
    const [updateProgressModalIsOpen, setUpdateProgressModalIsOpen] = useState(false);
    const [timerActive, setTimerActive] = useState(false);
    const [timerFinished, setTimerFinished] = useState(false);
    const [isChangeGoalVisible, setIsChangeGoalVisible] = useState(false);
    const [timePassed, setTimePassed] = useState(timeInSecondsForTheDayReading);
    const [formattedTime, setFormattedTime] = useState('');
    const cleaveInputRef = useRef(null);
    const [timerReset, setTimerReset] = useState(false);
    const [playStartSound] = useSound(startSfx);
    const [playStopSound] = useSound(stopSfx);
    const [playEndSound] = useSound(endSfx);

    useEffect(() => {
        if (screenTimeSeconds === 0 && timeInSecondsForTheDayReading === 0) {
            dispatch(setTimerMode('increment'));
        } else {
            dispatch(setTimerMode('decrement'));

        }
    }, [dispatch, screenTimeSeconds, timeInSecondsForTheDayReading])

    const updateTimer = useCallback(() => {
        if (timerActive && timeLeft > 0) {
            setTimeLeft(prevTime => {
                if (timerMode === "decrement") {
                    return prevTime - 1;
                }
                else {
                    return prevTime + 1;
                }
            });
            setTimePassed(prevTimePassed => prevTimePassed + 1);
        } else if (timeLeft <= 0 && timerActive && timerMode === "decrement") {
            setTimerActive(false);
            dispatch(setTimerStarted(false));
            setTimerFinished(true);
            playEndSound();
        } else if (timeLeft <= 0 && timerActive && timerMode === "increment") {
            setTimePassed(prevTimePassed => prevTimePassed + 1);
        }
    }, [timeLeft, timerActive, dispatch, playEndSound, timerMode]);

    useEffect(() => {
        const timerInterval = setInterval(updateTimer, 1000);

        // Cleanup interval on component unmount or timer reset
        return () => clearInterval(timerInterval);
    }, [updateTimer]);

    useEffect(() => {
        setTimeLeft(timeInSecondsLeftForAchievingReadingGoal);
    }, [timeInSecondsLeftForAchievingReadingGoal]);

    useEffect(() => {
        // Update timePassed whenever timeInSecondsForTheDayReading changes
        setTimePassed(timeInSecondsForTheDayReading);
    }, [timeInSecondsForTheDayReading]);

    useEffect(() => {
        if (timerFinished) {
            dispatch(setTimeInSecondsLeftForAchievingReadingGoal(0));
            dispatch(updateReadingDataInDatabase({ date: dateToday, totalReadingGoalForTheDay, timeInSecondsForTheDayReading: timePassed, user, currentlyReadingBook }));
            setTimeLeft(0);
            setTimerActive(false);
        }
    }, [timerFinished, timePassed, dispatch, dateToday, totalReadingGoalForTheDay, user, currentlyReadingBook]);

    useEffect(() => {
        if (goalAchievedForTheDay) {
            dispatch(setTimerMode("increment"));
            dispatch(setGoalAchievedForTheDay(true))
        }
    }, [dispatch, goalAchievedForTheDay])

    const formatTimeWithSeconds = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        return (
            <span>
                <span className="countdown-part">{hours.toString().padStart(2, '0')}</span>:
                <span className="countdown-part">{minutes.toString().padStart(2, '0')}</span>:
                <span className="countdown-part countdown-seconds">{seconds.toString().padStart(2, '0')}</span>
            </span>
        );
    };
    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        playStartSound();
        setIsChangeGoalVisible(false);
        dispatch(setCurrentlyReadingBook(currentlyReadingBooks[activeIndex]));
        dispatch(setTimerStarted(true));
        setTimerActive(true);
        dispatch(clearError());
    };

    const stopTimer = () => {
        playStopSound();
        if (timerMode === "decrement") {

            dispatch(setTimeInSecondsLeftForAchievingReadingGoal(timeLeft));
            const currentTimePassed = timePassed;
            dispatch(updateReadingDataInDatabase({ date: dateToday, totalReadingGoalForTheDay, timeInSecondsForTheDayReading: currentTimePassed, user, currentlyReadingBook }))
        } else {
            dispatch(updateReadingDataInDatabase({
                date: dateToday, totalReadingGoalForTheDay,
                timeInSecondsForTheDayReading: timeInSecondsLeftForAchievingReadingGoal + timePassed, // hadded the new time to the previous time read
                user, currentlyReadingBook
            }))
        }
        dispatch(setTimerStarted(false));
        if (currentlyReadingBook) {
            setUpdateProgressModalIsOpen(true);
            document.body.style.overflow = 'hidden';
        }
        setTimerActive(false);
    };

    const changeTime = (newTime) => {
        if (newTime <= timeInSecondsForTheDayReading) {
            dispatch(setError({ message: 'You can not set lower goal than your current spend time reading' }))
            return;
        }
        dispatch(updateReadingDataInDatabase({ date: dateToday, totalReadingGoalForTheDay: newTime, timeInSecondsForTheDayReading: timePassed, user, currentlyReadingBook }));
        setIsChangeGoalVisible(false);
    }

    const handleResetTimerIncrement = () => {
        setTimerActive(true);
        dispatch(setTimerMode("increment"));
        setTimerReset(true);
        dispatch(setGoalAchievedForTheDay(true));
        playStartSound();
    };

    useEffect(() => {
        if (timerReset) {
            setTimeLeft(0);
            setTimerFinished(false);
            dispatch(setTimerStarted(true));
        }
    }, [timerReset, dispatch]);

    return (
        <>
            <Error />
            <div className="countdown-container">
                {updateProgressModalIsOpen && <UpdateBookProgressModal setIsOpen={setUpdateProgressModalIsOpen} timerFinished={timerFinished} />}

                {timerFinished && timeInSecondsForTheDayReading > 0 ? (
                    <h2 className="countdown-message">Countdown Timer has finished!</h2>
                ) : (

                    timerMode === "decrement" ?
                        timerStarted ?
                            <h2 className="countdown-message countdown-part">{formatTimeWithSeconds(timeLeft)}</h2>
                            :
                            <h2 className="countdown-message countdown-part">{formatTimeWithSeconds(timeLeft)}</h2>

                        :
                        timerStarted ?
                            <h2 className="countdown-message countdown-part">{formatTimeWithSeconds(timePassed - totalReadingGoalForTheDay)}</h2>
                            :
                            <h2 className="countdown-message">Time passed: {formatTimeWithSeconds(timePassed - totalReadingGoalForTheDay)}</h2>

                )}

                {timerFinished ? (
                    <Button onClick={handleResetTimerIncrement} className="cta-btn">
                        Reset Timer
                    </Button>
                ) : (
                    <>
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
                            <div className="d-flex goal-reading-time__container">
                                <p>Reading goal for the day: {formatTimeWithSeconds(totalReadingGoalForTheDay)}</p>

                                <p className="time-info">Reading time achieved: {formatTimeWithSeconds(timeInSecondsForTheDayReading)}</p>
                            </div>
                        }

                        {!timerStarted && !goalAchievedForTheDay &&
                            <div className="goal-section">
                                <p>Is your goal for today too high?</p>
                                <Button className="cta-btn btn-sm" onClick={() => {
                                    setIsChangeGoalVisible(!isChangeGoalVisible);
                                    dispatch(clearError());
                                }}>Adjust Goal</Button>
                            </div>
                        }

                        {isChangeGoalVisible && !goalAchievedForTheDay &&
                            <div className="goal-section adjust-goal">
                                <p className='adjust-goal-label'>Choose an achievable goal:</p>
                                <div className='d-flex'>
                                    <div className='goal__subsection'>
                                        <p>Screen time spent last week:</p>
                                        <Button className="goal-button countdown-part" onClick={() => changeTime(screenTimeSeconds)}>{formatTime(screenTimeSeconds)}</Button>
                                    </div>
                                    <div className='goal__subsection'>
                                        <p>Your weekly average:</p>
                                        <Button className="goal-button countdown-part" onClick={() => changeTime(weeklyGoalAveragePerDay)}>{formatTime(weeklyGoalAveragePerDay)}</Button>
                                    </div>
                                    <div className='goal__subsection'>
                                        <p>Add custom reading time:</p>
                                        <Cleave
                                            ref={cleaveInputRef}
                                            className="goal-input countdown-part"
                                            options={{ time: true, timePattern: ['h', 'm'] }}
                                            placeholder="HH:MM"
                                            value={formattedTime}
                                            onChange={(e) => setFormattedTime(e.target.value)}

                                        />
                                        <Button
                                            className="cta-btn btn-sm"
                                            onClick={() => {
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

                        <PlaylistReading />

                    </>
                )}
            </div>
        </>

    )
}

export default Countdown;
