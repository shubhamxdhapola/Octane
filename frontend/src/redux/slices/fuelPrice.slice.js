import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { logoutUser } from "./auth.slice";

export const getFuelPriceHistory = createAsyncThunk(
    'api/fuelPrice/getHistory',
    async (fuelType = "", { rejectWithValue }) => {
        try {
            const url = fuelType ? `${API_PATHS.FUEL_PRICE.HISTORY}?fuelType=${fuelType}` : API_PATHS.FUEL_PRICE.HISTORY;
            const response = await axiosInstance.get(url);
            return { fuelType: fuelType || "all", data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.response?.data || "Unable to fetch fuel price history");
        }
    },
    {
        condition: (fuelType = "", { getState }) => {
            const key = fuelType || "all";
            const { fuelPrice } = getState();
            if (fuelPrice.historyByFuelType && fuelPrice.historyByFuelType[key]) {
                return false;
            }
            return true;
        }
    }
);

export const getCurrentFuelPrices = createAsyncThunk(
    'api/fuelPrice/getCurrent',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API_PATHS.FUEL_PRICE.CURRENT);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.response?.data || "Unable to fetch current fuel prices");
        }
    },
    {
        condition: (force, { getState }) => {
            if (force) return true;
            const { fuelPrice } = getState();
            if (fuelPrice.current !== null) {
                return false;
            }
            return true;
        }
    }
);

export const addFuelPrice = createAsyncThunk(
    'api/fuelPrice/add',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(API_PATHS.FUEL_PRICE.ADD, data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.response?.data || "Unable to add fuel price");
        }
    }
);

const fuelPriceSlice = createSlice({
    name: 'fuelPrice',
    initialState: {
        history: null,
        current: null,
        historyByFuelType: {},
        fetchingHistory: false,
        fetchingCurrent: false,
        savingPrice: false,
        error: null,
    },
    reducers: {
        invalidateFuelPrices: (state) => {
            state.history = null;
            state.current = null;
            state.historyByFuelType = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getFuelPriceHistory.pending, (state) => {
                state.fetchingHistory = true;
                state.error = null;
            })
            .addCase(getFuelPriceHistory.fulfilled, (state, action) => {
                state.fetchingHistory = false;
                const records = action.payload.data.priceHistory || action.payload.data;
                state.historyByFuelType[action.payload.fuelType] = records;
                state.history = records;
            })
            .addCase(getFuelPriceHistory.rejected, (state, action) => {
                state.fetchingHistory = false;
                state.error = action.payload;
            })
            .addCase(getCurrentFuelPrices.pending, (state) => {
                state.fetchingCurrent = true;
                state.error = null;
            })
            .addCase(getCurrentFuelPrices.fulfilled, (state, action) => {
                state.fetchingCurrent = false;
                state.current = action.payload;
            })
            .addCase(getCurrentFuelPrices.rejected, (state, action) => {
                state.fetchingCurrent = false;
                state.error = action.payload;
            })
            .addCase(addFuelPrice.pending, (state) => {
                state.savingPrice = true;
                state.error = null;
            })
            .addCase(addFuelPrice.fulfilled, (state, action) => {
                state.savingPrice = false;
                const newPrice = action.payload.fuelPrice || action.payload.price || action.payload;
                state.history = state.history ? [newPrice, ...state.history] : [newPrice];
                state.historyByFuelType = {}; // Invalidate history cache so filtered queries reflect addition
                if (state.current) {
                    state.current[newPrice.fuelType] = newPrice;
                }
            })
            .addCase(addFuelPrice.rejected, (state, action) => {
                state.savingPrice = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.history = null;
                state.current = null;
                state.historyByFuelType = {};
                state.fetchingHistory = false;
                state.fetchingCurrent = false;
            });
    }
});

export const { invalidateFuelPrices } = fuelPriceSlice.actions;
export default fuelPriceSlice.reducer;
