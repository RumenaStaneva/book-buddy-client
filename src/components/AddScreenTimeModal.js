import '../styles/Modal.scss'
import { useState, useEffect, useRef } from 'react';
import Cleave from 'cleave.js/react';
import Spinner from 'react-spinner-material';
import { useAuthContext } from '../hooks/useAuthContext';
import { useDispatch } from "react-redux";
import { setError, clearError } from '../reducers/errorSlice';
import '../styles/Calendar.scss'
import Modal from './Dialog'
import Error from './Error'
import ConfirmationDialog from './ConfirmationDialog';
import { fetchReadingTimeForTheWeek } from "../reducers/readingTimeForTodaySlice";
import { startOfWeek, endOfWeek, eachDayOfInterval, format, subWeeks, parse } from 'date-fns';

const AddScreenTimeModal = ({ setIsOpenAddScreenTime, handleCloseModal, previousElement }) => {
    const [screenTimeData, setScreenTimeData] = useState(Array(7).fill({ date: '', time: '00:00' }));

    const [datesFromLastWeek, setDatesFromLastWeek] = useState([]);
    const [invalidInputs, setInvalidInputs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formattedStartDate, setFormattedStartDate] = useState('');
    const [formattedEndDate, setFormattedEndDate] = useState('');
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const { user } = useAuthContext();
    const dispatchError = useDispatch();
    const dispatchReadingTime = useDispatch();
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const confirmationDialogRef = useRef();

    //get the days for the last week and add them in daysOfWeek
    useEffect(() => {
        const getWeekDates = async () => {
            setIsLoading(true);
            try {
                const currentDate = new Date();
                const lastWeekStart = startOfWeek(subWeeks(currentDate, 1), { weekStartsOn: 1 });
                const lastWeekEnd = endOfWeek(subWeeks(currentDate, 1), { weekStartsOn: 1 });
                const datesFromLastWeek = eachDayOfInterval({ start: lastWeekStart, end: lastWeekEnd });
                setDatesFromLastWeek(datesFromLastWeek);

                const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/time-swap/week-dates`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${user.token}`,
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    // console.log(data);
                    setScreenTimeData(prevState => {
                        return prevState.map((item, index) => {
                            return {
                                date: data.weekDates[index],
                                time: item.time
                            };
                        });
                    });
                    const start = parse(data.weekDates[0], 'MMMM dd, yyyy', new Date());
                    const end = parse(data.weekDates[6], 'MMMM dd, yyyy', new Date());
                    setFormattedStartDate(format(start, 'dd.MM.yyyy'));
                    setFormattedEndDate(format(end, 'dd.MM.yyyy'));
                    setIsLoading(false);
                } else {
                    setIsLoading(false);
                    throw new Error('Error fetching week dates' + response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
                setIsLoading(false);
                dispatchError(setError({ message: error.message }));
            }
        };

        getWeekDates();
    }, [user.token, dispatchError]);

    const handleInputChange = (index, value) => {
        const newData = [...screenTimeData];
        newData[index] = {
            ...newData[index],
            time: value
        };
        setScreenTimeData(newData);
        // Check if the input value is '00:00' and mark it as invalid
        if (value === '00:00') {
            setInvalidInputs((prevInvalidInputs) => {
                if (!prevInvalidInputs.includes(index)) {
                    return [...prevInvalidInputs, index];
                }
                return prevInvalidInputs;
            });
        } else {
            // Remove the index from invalidInputs if the value is not '00:00'
            setInvalidInputs((prevInvalidInputs) =>
                prevInvalidInputs.filter((item) => item !== index)
            );
        }
    };

    const convertToSeconds = (time, index) => {
        if (time === '00:00') {
            setShowConfirmationDialog(true);
        }
        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!timePattern.test(time)) {
            throw new window.Error('Invalid time format. Please use HH:MM format.');
        } else {
            dispatchError(clearError());
            // setInvalidInputs((prevInvalidInputs) =>
            //     prevInvalidInputs.filter((item) => item !== index)
            // );
            const [hours, minutes] = time.split(':');
            const totalSeconds = parseInt(hours, 10) * 3600 + parseInt(minutes, 10) * 60;

            if (totalSeconds > 24 * 3600) {
                throw new window.Error('Time cannot exceed 24:00.');
            }
            return totalSeconds;
        }

    };
    const handleConfirmDialogCancel = () => {
        setShowConfirmationDialog(false);
    };

    const handleConfirmDialogConfirm = () => {
        setShowConfirmationDialog(false);
        saveScreenTime();
    };
    const validateInputs = () => {
        // Validate inputs and mark invalid ones
        const invalidInputs = screenTimeData.reduce((invalidInputs, item, index) => {
            if (item.time === '00:00') {
                invalidInputs.push(index);
            }
            return invalidInputs;
        }, []);
        setInvalidInputs(invalidInputs);
        return invalidInputs.length === 0;
    };

    const checkScreenTime = async (e) => {
        // Check for invalid inputs
        const isValid = validateInputs();

        // Check for invalid inputs
        if (!isValid) {
            e.preventDefault();
            setShowConfirmationDialog(true);
            confirmationDialogRef.current.focus();
            return;
        }

        // Check if any time is '00:00' and show confirmation dialog
        if (screenTimeData.some(item => item.time === '00:00')) {
            e.preventDefault();
            setShowConfirmationDialog(true);
            confirmationDialogRef.current.focus();
        } else {
            // Save the data directly if there are no '00:00' times
            saveScreenTime();
        }
    };
    const saveScreenTime = async () => {
        setIsLoading(true);
        try {
            const formattedDates = datesFromLastWeek.map(date => format(date, 'yyyy/MM/dd'));
            const screenTimeInSeconds = screenTimeData.map((item, index) => {
                return {
                    date: formattedDates[index],
                    timeInSeconds: convertToSeconds(item.time, index)
                }
            });
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/time-swap/save-time`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(screenTimeInSeconds),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new window.Error(data.error);
            }
            setShowConfirmationDialog(false);
            setIsLoading(false);
            dispatchError(clearError());
            setIsOpenAddScreenTime(false);
            document.body.style.overflow = 'visible';

            dispatchReadingTime(fetchReadingTimeForTheWeek({ user, dataRange: 'Current week' }));
            handleCloseModal();
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            dispatchError(setError({ message: error.message }));
        }
    };


    return (
        <Modal
            title={`Screen time for week: ${formattedStartDate} - ${formattedEndDate}`}
            onClose={() => setIsOpenAddScreenTime(false)}
            subtitle={``}
            setIsOpen={setIsOpenAddScreenTime}
            small={true}
            previousElement={previousElement}
            content={
                <>
                    <Error />
                    {/* {showConfirmationDialog && ( */}
                    <ConfirmationDialog
                        message="Setting time to 00:00 will be considered as not using the device on that day. Are you sure?"
                        onCancel={handleConfirmDialogCancel}
                        onConfirm={handleConfirmDialogConfirm}
                        confirmationDialogRef={confirmationDialogRef}
                        showConfirmationDialog={showConfirmationDialog}
                    />
                    {/* )} */}
                    <div className="calendar-container">
                        {isLoading ?
                            (<div className='spinner__container'>
                                <Spinner radius={120} color={"#E02D67"} stroke={5} visible={true} />
                            </div>) :
                            <>
                                <div className="input-fields d-flex">
                                    {screenTimeData.map((item, index) => (
                                        <div key={index} className='input-field__container'>
                                            <span className='weekday'>{daysOfWeek[index]}</span>
                                            <label>{item.date}</label>
                                            <div className={`input-field ${showConfirmationDialog && 'confirmation-dialog-shown'} ${invalidInputs.includes(index) ? 'error' : ''}`}>
                                                <Cleave
                                                    options={{ time: true, timePattern: ['h', 'm'], rawValueTrimPrefix: true, }}
                                                    placeholder="Enter time in HH:MM format"
                                                    value={item.time}
                                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                                    onFocus={(e) => e.target.select()}
                                                    onMouseUp={(e) => e.preventDefault()}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button className='cta-btn cta-sm' onClick={(e) => checkScreenTime(e)}>Save Screen Time</button>
                            </>

                        }
                    </div>
                </>
            }
        />
    );
};
export default AddScreenTimeModal;