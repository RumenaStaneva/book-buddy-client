import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setError } from './errorSlice';
import { startOfWeek, endOfWeek, format, } from 'date-fns';


//get the reading time
export const fetchReadingTimeForTheWeek = createAsyncThunk(
    'readingTime/fetchReadingTimeForTheWeek',
    async (user, thunkAPI) => {

        const today = new Date().setHours(0, 0, 0, 0);
        const startOfWeekDay = startOfWeek(today, { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
        // console.log('startOfWeekDay', startOfWeekDay);
        // console.log('lastWeekEnd', lastWeekEnd);
        const formattedStartDate = format(startOfWeekDay, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'UTC' });
        const formattedEndDate = format(lastWeekEnd, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'UTC' });
        // console.log('formattedStartDate', formattedStartDate);
        // console.log('formattedEndDate', formattedEndDate);
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/time-swap/reading-time?startDate=${formattedStartDate}&endDate=${formattedEndDate}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching reading time: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            thunkAPI.dispatch(setError({ message: `Error updating time: ${error.message}` }));
            throw new Error(error.message);
        }
    }
);

export const fetchHasReadingTimeAnytime = createAsyncThunk(
    'readingTime/fetchHasReadingTimeAnytime',
    async (user, thunkAPI) => {

        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/time-swap/reading-time-anytime`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching reading time: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
            thunkAPI.dispatch(setError({ message: `Error updating reading time in the database: ${error.message}` }));
            throw new Error(error.message);
        }
    }
);

export const updateReadingDataInDatabase = createAsyncThunk(
    'readingTime/updateReadingDataInDatabase',
    async ({ date, totalReadingGoalForTheDay, timeInSecondsForTheDayReading, user, currentlyReadingBook }, thunkAPI) => {
        // console.log('in slice ', date, timeInSecondsForTheDayReading, user, currentlyReadingBook);
        try {
            const response = await fetch(`${process.env.REACT_APP_LOCAL_HOST}/time-swap/update-reading-time`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    date,
                    totalReadingGoalForTheDay,
                    timeInSecondsForTheDayReading,
                    currentlyReadingBookId: currentlyReadingBook ? currentlyReadingBook._id : null
                }),
            });
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            thunkAPI.dispatch(setError({ message: `Error fetching reading time in the database: ${error.message}` }));
            throw new Error(error.message);
        }
    }
);


const initialState = {
    currentWeekData: null,
    currentWeekDates: null,
    hasReadingTimeAnytime: false,
    errorMessage: '',
    isLoading: false,
    dateToday: null,
    screenTimeInSeconds: 0,
    weeklyGoalAveragePerDay: 0,
    timeInSecondsForTheDayReading: 0,
    totalReadingGoalForTheDay: 0,
    timeInSecondsLeftForAchievingReadingGoal: 0,
};

const options = {
    name: 'readingTime',
    initialState: initialState,
    reducers: {
        setWeeklyGoalAveragePerDay: (state, action) => {
            state.weeklyGoalAveragePerDay = action.payload;
        },
        setTimeInSecondsForTheDayReading: (state, action) => {
            state.timeInSecondsForTheDayReading = action.payload;
        },
        setTimeInSecondsLeftForAchievingReadingGoal: (state, action) => {
            state.timeInSecondsLeftForAchievingReadingGoal = action.payload;
        },
        setDateToday: (state, action) => {
            state.dateToday = action.payload;
        },
    },
    extraReducers: {
        [fetchReadingTimeForTheWeek.pending]: (state, action) => {
            state.isLoading = true;
            state.errorMessage = '';
        },
        [fetchReadingTimeForTheWeek.fulfilled]: (state, action) => {
            const readingTimeObject = action.payload;
            if (readingTimeObject.readingTime.length > 0) {

                const currentWeekDates = readingTimeObject.readingTime.map(item => {
                    const dateObject = new Date(item.date);
                    return dateObject.toISOString(); // Convert to ISO string to keep the UTC format
                });


                state.currentWeekData = readingTimeObject.readingTime;
                state.currentWeekDates = currentWeekDates;
                const today = new Date();
                const todayUTC = new Date(today.toISOString().slice(0, 10)); // Get today's date in UTC without time

                const todayIndex = currentWeekDates.findIndex(date => {
                    const dateUTC = new Date(date);
                    return dateUTC.toISOString().slice(0, 10) === todayUTC.toISOString().slice(0, 10);
                });
                // Set today's date properties in the state
                if (todayIndex !== -1) {
                    state.dateToday = currentWeekDates[todayIndex];
                    state.screenTimeInSeconds = readingTimeObject.readingTime[todayIndex].screenTimeInSeconds;
                    state.weeklyGoalAveragePerDay = readingTimeObject.readingTime[todayIndex].weeklyGoalAveragePerDay;
                    state.timeInSecondsForTheDayReading = readingTimeObject.readingTime[todayIndex].timeInSecondsForTheDayReading;
                    state.timeInSecondsLeftForAchievingReadingGoal = readingTimeObject.readingTime[todayIndex].timeInSecondsLeftForAchievingReadingGoal;
                    state.totalReadingGoalForTheDay = readingTimeObject.readingTime[todayIndex].totalReadingGoalForTheDay;
                }

                state.isLoading = false;
                state.errorMessage = '';
            }
            state.isLoading = false;
            state.errorMessage = '';
        },
        [fetchReadingTimeForTheWeek.rejected]: (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload;
        },
        [fetchHasReadingTimeAnytime.pending]: (state, action) => {
            state.isLoading = true;
            state.errorMessage = '';
        },
        [fetchHasReadingTimeAnytime.fulfilled]: (state, action) => {
            state.hasReadingTimeAnytime = action.payload.hasReadingTime
            state.isLoading = false;
            state.errorMessage = '';
        },
        [fetchHasReadingTimeAnytime.rejected]: (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload;
        },
        [updateReadingDataInDatabase.pending]: (state, action) => {
            state.isLoading = true;
            state.errorMessage = '';
        },
        [updateReadingDataInDatabase.fulfilled]: (state, action) => {
            // console.log('action.payload', action.payload);
            const data = action.payload.updatedReadingTimeRecord;
            state.goalAchievedForTheDay = data.goalAchievedForTheDay;
            state.timeInSecondsForTheDayReading = data.timeInSecondsForTheDayReading;
            state.timeInSecondsLeftForAchievingReadingGoal = data.timeInSecondsLeftForAchievingReadingGoal;
            state.totalReadingGoalForTheDay = data.totalReadingGoalForTheDay;
            state.isLoading = false;
            state.errorMessage = '';
        },
        [updateReadingDataInDatabase.rejected]: (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload;
        },
    },
}
export const readingTimeForTodaySlice = createSlice(options);
export const { setWeeklyGoalAveragePerDay, setTimeInSecondsForTheDayReading, setTimeInSecondsLeftForAchievingReadingGoal, setDateToday } = readingTimeForTodaySlice.actions;

export default readingTimeForTodaySlice.reducer;