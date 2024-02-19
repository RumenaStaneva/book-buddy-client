import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import { setError } from "./errorSlice";
import { startOfWeek, endOfWeek, format, subWeeks } from "date-fns";
import { Book } from "../components/BookList";

type User = {
  token: string;
};

type CurrentlyReadingBookType = {
  _id: string;
  bookApiId: string;
  title: string;
  authors: Array<string>;
  description: string;
  publisher: string;
  thumbnail: string | null;
  categories: Array<string>;
  pageCount: number;
};

type FetchReadingTimeForTheWeekProps = {
  user: User;
  dataRange: string;
  startDate?: Date;
  endDate?: Date;
};

type UpdateReadingDataInDatabaseProps = {
  date: Date;
  totalReadingGoalForTheDay: number;
  timeInSecondsForTheDayReading: number;
  user: User;
  currentlyReadingBook: CurrentlyReadingBookType;
};

//get the reading time
export const fetchReadingTimeForTheWeek = createAsyncThunk(
  "readingTime/fetchReadingTimeForTheWeek",
  async (
    { user, dataRange, startDate, endDate }: FetchReadingTimeForTheWeekProps,
    thunkAPI
  ) => {
    let formattedStartDate, formattedEndDate;

    switch (dataRange) {
      case "Current week": {
        const today = new Date().setHours(0, 0, 0, 0);
        const startOfWeekDay = startOfWeek(today, { weekStartsOn: 1 });
        const endOfWeekDay = endOfWeek(today, { weekStartsOn: 1 });
        formattedStartDate = format(
          startOfWeekDay,
          "yyyy-MM-dd HH:mm:ss"
          // , {
          //   timeZone: "UTC",
          // }
        );
        formattedEndDate = format(
          endOfWeekDay,
          "yyyy-MM-dd HH:mm:ss"
          // , {
          //   timeZone: "UTC",
          // }
        );
        break;
      }
      case "Last week": {
        const today = new Date().setHours(0, 0, 0, 0);
        const startOfWeekDay = startOfWeek(subWeeks(today, 1), {
          weekStartsOn: 1,
        });
        const endOfWeekDay = endOfWeek(subWeeks(today, 1), { weekStartsOn: 1 });
        formattedStartDate = format(
          startOfWeekDay,
          "yyyy-MM-dd HH:mm:ss"
          // , {
          //   timeZone: "UTC",
          // }
        );
        formattedEndDate = format(
          endOfWeekDay,
          "yyyy-MM-dd HH:mm:ss"
          // , {
          //   timeZone: "UTC",
          // }
        );
        break;
      }
      case "Last 3 weeks": {
        const today = new Date().setHours(0, 0, 0, 0);
        const endOfWeekDay = endOfWeek(today, { weekStartsOn: 1 });
        const startOfWeekDay = endOfWeek(subWeeks(today, 3), {
          weekStartsOn: 1,
        });
        formattedStartDate = format(
          startOfWeekDay,
          "yyyy-MM-dd HH:mm:ss"
          // , {
          //   timeZone: "UTC",
          // }
        );
        formattedEndDate = format(
          endOfWeekDay,
          "yyyy-MM-dd HH:mm:ss"
          // , {
          //   timeZone: "UTC",
          // }
        );
        break;
      }
      case "Custom range":
        const start = startDate;
        const end = endDate;
        formattedStartDate = format(
          start!,
          "yyyy-MM-dd HH:mm:ss"
          // , {
          //   timeZone: "UTC",
          // }
        );
        formattedEndDate = format(
          end!,
          "yyyy-MM-dd HH:mm:ss"
          // , {
          //   timeZone: "UTC",
          // }
        );
        break;
      default:
        throw new Error("Invalid data range");
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_LOCAL_HOST}/time-swap/reading-time?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching reading time: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error(error);
      thunkAPI.dispatch(setError({ message: `Error : ${error.message}` }));
      throw new Error(error.message);
    }
  }
);

export const fetchHasReadingTimeAnytime = createAsyncThunk(
  "readingTime/fetchHasReadingTimeAnytime",
  async (user: User, thunkAPI) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_LOCAL_HOST}/time-swap/reading-time-anytime`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error fetching reading time: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error(error);
      thunkAPI.dispatch(
        setError({
          message: `Error updating reading time in the database: ${error.message}`,
        })
      );
      throw new Error(error.message);
    }
  }
);

export const updateReadingDataInDatabase = createAsyncThunk(
  "readingTime/updateReadingDataInDatabase",
  async (
    {
      date,
      totalReadingGoalForTheDay,
      timeInSecondsForTheDayReading,
      user,
      currentlyReadingBook,
    }: UpdateReadingDataInDatabaseProps,
    thunkAPI
  ) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_LOCAL_HOST}/time-swap/update-reading-time`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date,
            totalReadingGoalForTheDay,
            timeInSecondsForTheDayReading,
            currentlyReadingBookId: currentlyReadingBook
              ? currentlyReadingBook._id
              : null,
          }),
        }
      );
      const data = await response.json();
      return data;
    } catch (error: any) {
      thunkAPI.dispatch(
        setError({
          message: `Error fetching reading time in the database: ${error.message}`,
        })
      );
      throw new Error(error.message);
    }
  }
);

type ReadingTimePerDay = {
  _id: string;
  userId: string;
  screenTimeDate: Date;
  date: Date;
  screenTimeInSeconds: number;
  goalAchievedForTheDay: boolean;
  weeklyGoalAveragePerDay: number;
  timeInSecondsLeftForAchievingReadingGoal: number;
  totalReadingGoalForTheDay: number;
  timeInSecondsForTheDayReading: number;
  // "__v": 0
};

type ReadingTimeState = {
  currentWeekData: ReadingTimePerDay | null;
  currentWeekDates: Date | null;
  hasReadingTimeAnytime: false;
  //TODO fix that object
  errorMessage: string | object;
  isLoading: boolean;
  dateToday: Date | null;
  screenTimeInSeconds: number;
  weeklyGoalAveragePerDay: number;
  goalAchievedForTheDay: boolean;
  timeInSecondsForTheDayReading: number;
  totalReadingGoalForTheDay: number;
  timeInSecondsLeftForAchievingReadingGoal: number;
  dataRange: string;
};

const initialState: ReadingTimeState = {
  currentWeekData: null,
  currentWeekDates: null,
  hasReadingTimeAnytime: false,
  errorMessage: "",
  isLoading: false,
  dateToday: null,
  screenTimeInSeconds: 0,
  weeklyGoalAveragePerDay: 0,
  goalAchievedForTheDay: false,
  timeInSecondsForTheDayReading: 0,
  totalReadingGoalForTheDay: 0,
  timeInSecondsLeftForAchievingReadingGoal: 0,
  dataRange: "Current week",
};

const options = {
  name: "readingTime",
  initialState: initialState,
  reducers: {
    // setWeeklyGoalAveragePerDay: (state, action) => {
    //   state.weeklyGoalAveragePerDay = action.payload;
    // },
    // setTimeInSecondsForTheDayReading: (state, action) => {
    //   state.timeInSecondsForTheDayReading = action.payload;
    // },
    // setDateToday: (state, action) => {
    //   state.dateToday = action.payload;
    // },
    setTimeInSecondsLeftForAchievingReadingGoal: (
      state: ReadingTimeState,
      action: PayloadAction<number>
    ) => {
      state.timeInSecondsLeftForAchievingReadingGoal = action.payload;
    },
    setGoalAchievedForTheDay: (
      state: ReadingTimeState,
      action: PayloadAction<boolean>
    ) => {
      state.goalAchievedForTheDay = action.payload;
    },
    setDataRange: (state: ReadingTimeState, action: PayloadAction<string>) => {
      state.dataRange = action.payload;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<ReadingTimeState>) => {
    builder.addCase(
      fetchReadingTimeForTheWeek.pending,
      (state: ReadingTimeState) => {
        state.isLoading = true;
        state.errorMessage = "";
      }
    );
    builder.addCase(
      fetchReadingTimeForTheWeek.fulfilled,
      (state: ReadingTimeState, action) => {
        const readingTimeObject = action.payload;
        if (readingTimeObject.readingTime.length > 0) {
          const currentWeekDates = readingTimeObject.readingTime.map(
            (item: ReadingTimePerDay) => {
              const dateObject = new Date(item.date);
              return dateObject.toISOString(); // Convert to ISO string to keep the UTC format
            }
          );

          state.currentWeekData = readingTimeObject.readingTime;
          state.currentWeekDates = currentWeekDates;
          const today = new Date();
          const todayUTC = new Date(today.toISOString().slice(0, 10)); // Get today's date in UTC without time

          const todayIndex = currentWeekDates.findIndex((date: string) => {
            const dateUTC = new Date(date);
            return (
              dateUTC.toISOString().slice(0, 10) ===
              todayUTC.toISOString().slice(0, 10)
            );
          });
          // Set today's date properties in the state
          if (todayIndex !== -1) {
            state.dateToday = currentWeekDates[todayIndex];
            state.screenTimeInSeconds =
              readingTimeObject.readingTime[todayIndex].screenTimeInSeconds;
            state.weeklyGoalAveragePerDay =
              readingTimeObject.readingTime[todayIndex].weeklyGoalAveragePerDay;
            state.timeInSecondsForTheDayReading =
              readingTimeObject.readingTime[
                todayIndex
              ].timeInSecondsForTheDayReading;
            state.timeInSecondsLeftForAchievingReadingGoal =
              readingTimeObject.readingTime[
                todayIndex
              ].timeInSecondsLeftForAchievingReadingGoal;
            state.totalReadingGoalForTheDay =
              readingTimeObject.readingTime[
                todayIndex
              ].totalReadingGoalForTheDay;
            state.goalAchievedForTheDay =
              readingTimeObject.readingTime[todayIndex].goalAchievedForTheDay;
          }

          state.isLoading = false;
          state.errorMessage = "";
        } else {
          state.currentWeekData = null;
          state.currentWeekDates = null;
        }
        state.isLoading = false;
        state.errorMessage = "";
      }
    );
    builder.addCase(
      fetchReadingTimeForTheWeek.rejected,
      (state: ReadingTimeState, action) => {
        if (action.payload && action.payload) {
          state.errorMessage = action.payload;
        }
        //   state.errorMessage = action.payload;
        state.isLoading = false;
      }
    );
    builder.addCase(
      fetchHasReadingTimeAnytime.pending,
      (state: ReadingTimeState) => {
        state.isLoading = true;
        state.errorMessage = "";
      }
    );
    builder.addCase(
      fetchHasReadingTimeAnytime.fulfilled,
      (state: ReadingTimeState, action) => {
        state.hasReadingTimeAnytime = action.payload.hasReadingTime;
        state.isLoading = false;
        state.errorMessage = "";
      }
    );
    builder.addCase(
      fetchHasReadingTimeAnytime.rejected,
      (state: ReadingTimeState, action) => {
        if (action.payload && action.payload) {
          state.errorMessage = action.payload;
        }
        //   state.errorMessage = action.payload;
        state.isLoading = false;
      }
    );
    builder.addCase(
      updateReadingDataInDatabase.pending,
      (state: ReadingTimeState) => {
        state.isLoading = true;
        state.errorMessage = "";
      }
    );
    builder.addCase(
      updateReadingDataInDatabase.fulfilled,
      (state: ReadingTimeState, action) => {
        if (state.dataRange === "Current week") {
          const data = action.payload.updatedReadingTimeRecord;
          state.goalAchievedForTheDay = data.goalAchievedForTheDay;
          state.timeInSecondsForTheDayReading =
            data.timeInSecondsForTheDayReading;
          state.timeInSecondsLeftForAchievingReadingGoal =
            data.timeInSecondsLeftForAchievingReadingGoal;
          state.totalReadingGoalForTheDay = data.totalReadingGoalForTheDay;
        }
        state.isLoading = false;
        state.errorMessage = "";
      }
    );
    builder.addCase(
      updateReadingDataInDatabase.rejected,
      (state: ReadingTimeState, action) => {
        if (action.payload && action.payload) {
          state.errorMessage = action.payload;
        }
        //   state.errorMessage = action.payload;
        state.isLoading = false;
      }
    );
  },
};

export const readingTimeForTodaySlice = createSlice(options);
export const {
  // setWeeklyGoalAveragePerDay,
  // setTimeInSecondsForTheDayReading,
  // setDateToday,
  setTimeInSecondsLeftForAchievingReadingGoal,
  setGoalAchievedForTheDay,
  setDataRange,
} = readingTimeForTodaySlice.actions;

export default readingTimeForTodaySlice.reducer;
