import { useState, useEffect } from 'react';
import Button from './Button';
import UpdateBookProgressModal from './UpdateBookProgressModal';
import { setTimerStarted } from '../reducers/timerSlice';
import { useDispatch } from 'react-redux';

const Countdown = ({ readingTimeSeconds }) => {
    const [timeLeft, setTimeLeft] = useState(readingTimeSeconds);
    const [timerActive, setTimerActive] = useState(false);
    const [timerFinished, setTimerFinished] = useState(false);
    const dispatch = useDispatch();

    const updateTimer = () => {
        setTimeLeft((prevTime) => {
            if (prevTime > 0) {
                return prevTime - 1;
            } else {
                dispatch(setTimerStarted(false));
                setTimerActive(false);
                setTimerFinished(true);
                setTimeLeft(0);
            }
        })
    };

    useEffect(() => {
        setTimeLeft(readingTimeSeconds);
    }, [readingTimeSeconds])

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
        dispatch(setTimerStarted(true));
        setTimerActive(true);
    };

    const stopTimer = () => {
        dispatch(setTimerStarted(false));
        setTimerActive(false);
    };

    return (
        <div>
            {timerFinished ? (
                <h2>Countdown Timer has finished!</h2>
            ) : (
                <h2>Countdown: {formatTime(timeLeft)}</h2>
            )}
            {timerFinished ? (
                <Button onClick={() => setTimerFinished(false)}>Reset</Button>
            ) : (
                <>
                    <Button onClick={startTimer}>Start</Button>
                    <Button onClick={stopTimer}>Stop</Button>
                    <p>Time Remaining: {formatTime(timeLeft)}</p>
                </>
            )}
        </div>
    );
};

export default Countdown;
