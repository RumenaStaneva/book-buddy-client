import Countdown from "../components/Countdown";
import Button from "../components/Button";
import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const Timer = ({ readingTimeSeconds }) => {


    return (
        <>
            <Countdown seconds={readingTimeSeconds} />
        </>
    )
}

export default Timer;