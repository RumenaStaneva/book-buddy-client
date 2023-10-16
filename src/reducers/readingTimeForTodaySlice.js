import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setError } from './errorSlice';
import { startOfWeek, endOfWeek, format } from 'date-fns';


//get the reading time
export const fetchReadingTimeForTheWeek = createAsyncThunk(
    'readingTime/fetchReadingTimeForTheWeek',
    async (user, thunkAPI) => {

        const today = new Date().setHours(0, 0, 0, 0);
        const startOfWeekDay = startOfWeek(today, { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(today, { weekStartsOn: 1 });
        // console.log('startOfWeekDay', startOfWeekDay);
        // console.log('lastWeekEnd', lastWeekEnd);
        const formattedStartDate = format(startOfWeekDay, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'auto' });
        const formattedEndDate = format(lastWeekEnd, 'yyyy-MM-dd HH:mm:ss', { timeZone: 'auto' });

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
            throw error;
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
            throw error;
        }
    }
);

//send to BE how much time the user has spend reading when using the timer
// export const updateReadingTime = createAsyncThunk(
//     'readingTime/updateReadingTime',
//     async ({ user, newTimeInSeconds }, thunkAPI) => {
//         try {
//             const response = await fetch('/time-swap/update-reading-time', {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     Authorization: `Bearer ${user.token}`,
//                 },
//                 body: JSON.stringify({ timeInSeconds: newTimeInSeconds }),
//             });

//             if (!response.ok) {
//                 throw new Error(`Error updating reading time: ${response.statusText}`);
//             }

//             const data = await response.json();
//             return data;
//         } catch (error) {
//             console.error(error);
//             thunkAPI.dispatch(setError({ message: error.message }));
//             throw error;
//         }
//     }
// );


const initialState = {
    currentWeekData: null,
    currentWeekDates: null,
    hasReadingTimeAnytime: false,
    errorMessage: '',
    isLoading: false,
    screenTimeInSeconds: 0,
    weeklyGoalAveragePerDay: 0,
    timeInSecondsForTheDayReading: 0,
};

const options = {
    name: 'readingTime',
    initialState: initialState,
    reducers: {
        setScreenTimeInSeconds: (state, action) => {
            state.screenTimeInSeconds = action.payload;
        },
        setWeeklyGoalAveragePerDay: (state, action) => {
            state.weeklyGoalAveragePerDay = action.payload;
        },
        setTimeInSecondsForTheDayReading: (state, action) => {
            state.timeInSecondsForTheDayReading = action.payload;
        },
    },
    extraReducers: {
        [fetchReadingTimeForTheWeek.pending]: (state, action) => {
            state.isLoading = true;
            state.errorMessage = '';
        },
        [fetchReadingTimeForTheWeek.fulfilled]: (state, action) => {
            const readingTimeObject = action.payload;
            console.log('readingTimeObject', readingTimeObject);
            if (readingTimeObject.readingTime.length > 0) {
                const { screenTimeInSeconds, weeklyGoalAveragePerDay, timeInSecondsForTheDayReading } = readingTimeObject.readingTime[0];
                const currentWeekDates = readingTimeObject.readingTime.map(item => item.date);
                state.currentWeekData = readingTimeObject.readingTime;
                state.currentWeekDates = currentWeekDates;
                state.isLoading = false;
                state.errorMessage = '';
                state.screenTimeInSeconds = screenTimeInSeconds;
                state.weeklyGoalAveragePerDay = weeklyGoalAveragePerDay;
                state.timeInSecondsForTheDayReading = timeInSecondsForTheDayReading;
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
        // [updateReadingTime.pending]: (state, action) => {
        //     state.isLoading = true;
        //     state.errorMessage = '';
        // },
        // [updateReadingTime.fulfilled]: (state, action) => {
        //     state.data = action.payload;
        //     state.isLoading = false;
        //     state.errorMessage = '';
        // },
        // [updateReadingTime.rejected]: (state, action) => {
        //     state.isLoading = false;
        //     state.errorMessage = action.payload;
        // }
    },
}
export const readingTimeForTodaySlice = createSlice(options);
export const { setScreenTimeInSeconds, setWeeklyGoalAveragePerDay, setTimeInSecondsForTheDayReading } = readingTimeForTodaySlice.actions;

export default readingTimeForTodaySlice.reducer;