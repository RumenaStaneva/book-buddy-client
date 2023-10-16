import { combineReducers } from 'redux';
import { filtersSlice } from './filtersSlice';
import { booksSlice } from './booksSlice';
import errorSlice from './errorSlice';
import { readingTimeForTodaySlice } from './readingTimeForTodaySlice';
import { timerSlice } from './timerSlice';

const rootReducer = combineReducers({
    search: filtersSlice.actions.setSearchQuery,
    category: filtersSlice.actions.setCategory,
    limit: filtersSlice.actions.setLimit,
    books: booksSlice.reducer,
    setError: errorSlice.actions.setError,
    clearError: errorSlice.actions.clearError,

    setReadingTimeForToday: readingTimeForTodaySlice.reducer,
    setScreenTimeInSeconds: readingTimeForTodaySlice.actions.setScreenTimeInSeconds,
    setWeeklyGoalAveragePerDay: readingTimeForTodaySlice.actions.setWeeklyGoalAveragePerDay,
    setTimeInSecondsForTheDayReading: readingTimeForTodaySlice.actions.setTimeInSecondsForTheDayReading,
    currentBookReading: timerSlice.actions.setCurrentlyReadingBook,
    timerStarted: timerSlice.actions.setTimerStarted

});

export default rootReducer;
