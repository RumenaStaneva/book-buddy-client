import { useState, useEffect } from 'react';
import Button from './Button';
import UpdateBookProgressModal from './UpdateBookProgressModal';
import { useDispatch, useSelector } from 'react-redux';
import { setTimerStarted, setCurrentlyReadingBook } from '../reducers/timerSlice';
import { setTimeInSecondsLeftForAchievingReadingGoal, setTimeInSecondsForTheDayReading, updateReadingDataInDatabase } from '../reducers/readingTimeForTodaySlice'
import '../styles/Countdown.css'
import { startOfDay, format, formatISO } from 'date-fns';
import { useAuthContext } from '../hooks/useAuthContext';

const Countdown = ({ readingTimeSeconds, currentlyReadingBooks, activeIndex }) => {
    const dispatch = useDispatch();
    const { timerStarted } = useSelector((state) => state.timer);
    const { dateToday, timeInSecondsLeftForAchievingReadingGoal, timeInSecondsForTheDayReading } = useSelector((state) => state.readingTimeForToday);
    const { user } = useAuthContext();

    const [timeLeft, setTimeLeft] = useState(timeInSecondsLeftForAchievingReadingGoal);
    const [updateProgressModalIsOpen, setUpdateProgressModalIsOpen] = useState(false);
    const [timerActive, setTimerActive] = useState(false);
    const [timerFinished, setTimerFinished] = useState(false);

    const updateTimer = () => {
        setTimeLeft((prevTime) => {
            if (prevTime > 0) {
                return prevTime - 1;
            } else {
                dispatch(setTimerStarted(false));
                setTimerActive(false);
                setTimerFinished(true);
                setUpdateProgressModalIsOpen(true);
                setTimeLeft(0);
            }
        })
    };

    useEffect(() => {
        setTimeLeft(timeInSecondsLeftForAchievingReadingGoal);
    }, [timeInSecondsLeftForAchievingReadingGoal]);

    useEffect(() => {
        let interval;
        if (timerActive) {
            interval = setInterval(updateTimer, 1000);
        } else {
            clearInterval(interval); // Clear interval if the timer is stopped
        }
        return () => clearInterval(interval);
    }, [timerActive]);

    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const startTimer = () => {
        dispatch(setCurrentlyReadingBook(currentlyReadingBooks[activeIndex]));
        dispatch(setTimerStarted(true));
        setTimerActive(true);
    };

    const stopTimer = () => {
        dispatch(setTimeInSecondsLeftForAchievingReadingGoal(timeLeft));
        const readingTime = readingTimeSeconds - timeLeft;
        dispatch(setTimeInSecondsForTheDayReading(readingTime));

        dispatch(updateReadingDataInDatabase({ date: dateToday, timeInSecondsLeftForAchievingReadingGoal: timeLeft, timeInSecondsForTheDayReading: readingTime, user }))
        dispatch(setTimerStarted(false));
        setUpdateProgressModalIsOpen(true);
        setTimerActive(false);
    };

    return (
        <div>
            {updateProgressModalIsOpen && <UpdateBookProgressModal setIsOpen={setUpdateProgressModalIsOpen} timerFinished={timerFinished} />}

            {timerFinished ? (
                <h2>Countdown Timer has finished!</h2>
            ) : (
                <h2>Countdown: {formatTime(timeLeft)}</h2>
            )}
            {timerFinished ? (
                <Button onClick={() => setTimerFinished(false)}>Reset</Button>
            ) : (
                <>
                    <Button disabled={timerStarted} onClick={startTimer}>Start</Button>
                    <Button disabled={!timerStarted} onClick={stopTimer}>Stop</Button>
                    <p>Time Remaining: {formatTime(timeLeft)}</p>
                    <p>Reading time achieved: {formatTime(timeInSecondsForTheDayReading)}</p>
                </>
            )}
        </div>
    );
};

export default Countdown;
