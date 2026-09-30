import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dashboardApi, apiErrorMessage } from "../../utils/api";
import { logoutUser } from "./auth.slice";

export const getDashboardData = createAsyncThunk(
  "api/dashboard/get",
  async (period = "today", { rejectWithValue }) => {
    try {
      const data = await dashboardApi.get(period);
      return { period, data };
    } catch (error) {
      return rejectWithValue(
        apiErrorMessage(error, "Unable to load dashboard data")
      );
    }
  },
  {
    condition: (period = "today", { getState }) => {
      const { dashboard } = getState();
      // If we already have the data for this period in redux, skip the API call
      if (dashboard.dataByPeriod && dashboard.dataByPeriod[period]) {
        return false;
      }
      return true;
    },
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    dataByPeriod: {},
    currentPeriod: "today",
    loading: false,
    error: null,
  },
  reducers: {
    setCurrentPeriod: (state, action) => {
      state.currentPeriod = action.payload;
    },
    invalidateDashboard: (state) => {
      state.dataByPeriod = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.dataByPeriod[action.payload.period] = action.payload.data;
      })
      .addCase(getDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.dataByPeriod = {};
        state.currentPeriod = "today";
        state.loading = false;
        state.error = null;
      });
  },
});

export const { setCurrentPeriod, invalidateDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
