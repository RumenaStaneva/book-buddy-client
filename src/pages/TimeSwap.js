import NavBar from "../components/NavBar";
import Countdown from "../components/Countdown";
import Button from "../components/Button";
import { useState } from "react";
import Calendar from "../components/Calendar";
import ReadingTimeTable from "../components/ReadingTimeTable";

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
            {/* <form onSubmit={handleSubmit}>
                <input type="number" value={seconds} onChange={handleChange} />
                <Button type="submit" onClick={handleSubmit}>Submit</Button>
            </form> */}

            {/* <Countdown seconds={totalSeconds} /> */}

            <Calendar />

            <ReadingTimeTable />
        </>
    );
};

export default TimeSwap;