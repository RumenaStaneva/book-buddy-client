import NavBar from "../components/NavBar";
import Countdown from "../components/Countdown";
import { useState } from "react";

const TimeSwap = () => {
    // Set the total seconds for the countdown
    const [seconds, setSeconds] = useState(0);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const handleChange = (e) => {
        setSeconds(e.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setTotalSeconds(seconds);
        setSeconds(0);
    }

    return (
        <>
            <NavBar />
            <form onSubmit={handleSubmit}>
                <input type="number" value={seconds} onChange={handleChange} />
                <button type="submit" onClick={handleSubmit}>Submit</button>

            </form>
            <Countdown seconds={totalSeconds} />
        </>
    );
};

export default TimeSwap;