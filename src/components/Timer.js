import Countdown from "../components/Countdown";
import Button from "../components/Button";
import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const Timer = ({ readingTimeSeconds }) => {
    const [seconds, setSeconds] = useState(0);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const { user } = useAuthContext();
    // const handleChange = (e) => {
    //     setSeconds(e.target.value);
    // }
    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     setTotalSeconds(seconds);
    //     setSeconds(0);
    // }
    return (
        <>
            <h1>I am the timer</h1>
            {/* <form onSubmit={handleSubmit}>
                <input type="number" value={seconds} onChange={handleChange} />
                <Button type="submit" onClick={handleSubmit}>Submit</Button>
            </form> */}

            <Countdown seconds={readingTimeSeconds} />
        </>
    )
}

export default Timer;