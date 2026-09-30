import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_PATHS } from "../../utils/apiPaths";
import axiosInstance from "../../utils/axiosInstance";
import { logoutUser } from "./auth.slice";

export const getRefills = createAsyncThunk(
    'api/refill/get',
    async (tankId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API_PATHS.TANK.REFILLS(tankId));
            return { tankId, data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.response?.data || "Unable to fetch refills");
        }
    },
    {
        condition: (tankId, { getState }) => {
            const { refill } = getState();
            if (refill.refillsByTank && refill.refillsByTank[tankId]) {
                return false;
            }
            return true;
        }
    }
);

export const addRefill = createAsyncThunk(
    'api/refill/add',
    async ({ tankId, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(API_PATHS.TANK.REFILLS(tankId), data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.response?.data || "Unable to add refill");
        }
    }
);

export const deleteRefill = createAsyncThunk(
    'api/refill/delete',
    async ({ tankId, refillId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(API_PATHS.TANK.REFILL_ONE(tankId, refillId));
            return { id: refillId, message: response.data?.message };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.response?.data || "Unable to delete refill");
        }
    }
);

export const updateRefill = createAsyncThunk(
    'api/refill/update',
    async ({ tankId, refillId, data }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(API_PATHS.TANK.REFILL_ONE(tankId, refillId), data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.response?.data || "Unable to update refill");
        }
    }
);

const refillSlice = createSlice({
    name: 'refill',
    initialState: {
        allRefills: null,
        refillsByTank: {},
        fetchingRefills: false,
        savingRefill: false,
        deletingRefill: false,
        error: null,
    },
    reducers: {
        invalidateRefills: (state) => {
            state.allRefills = null;
            state.refillsByTank = {};
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getRefills.pending, (state) => {
                state.fetchingRefills = true;
                state.error = null;
            })
            .addCase(getRefills.fulfilled, (state, action) => {
                state.fetchingRefills = false;
                const list = action.payload.data.refills || action.payload.data;
                state.refillsByTank[action.payload.tankId] = list;
                state.allRefills = list;
            })
            .addCase(getRefills.rejected, (state, action) => {
                state.fetchingRefills = false;
                state.error = action.payload;
            })
            .addCase(addRefill.pending, (state) => {
                state.savingRefill = true;
                state.error = null;
            })
            .addCase(addRefill.fulfilled, (state, action) => {
                state.savingRefill = false;
                const newRefill = action.payload.refill || action.payload;
                state.allRefills = state.allRefills ? [newRefill, ...state.allRefills] : [newRefill];
                const tankId = action.meta.arg?.tankId;
                if (tankId && state.refillsByTank[tankId]) {
                    state.refillsByTank[tankId] = [newRefill, ...state.refillsByTank[tankId]];
                }
            })
            .addCase(addRefill.rejected, (state, action) => {
                state.savingRefill = false;
            })
            .addCase(deleteRefill.pending, (state) => {
                state.deletingRefill = true;
            })
            .addCase(deleteRefill.fulfilled, (state, action) => {
                state.deletingRefill = false;
                const { tankId, refillId } = action.meta.arg;
                if (state.allRefills) {
                    state.allRefills = state.allRefills.filter((refill) => refill._id !== refillId);
                }
                if (tankId && state.refillsByTank[tankId]) {
                    state.refillsByTank[tankId] = state.refillsByTank[tankId].filter((refill) => refill._id !== refillId);
                }
            })
            .addCase(deleteRefill.rejected, (state, action) => {
                state.deletingRefill = false;
            })
            .addCase(updateRefill.pending, (state) => {
                state.savingRefill = true;
            })
            .addCase(updateRefill.fulfilled, (state, action) => {
                state.savingRefill = false;
                const updatedRefill = action.payload.refill || action.payload;
                const tankId = action.meta.arg?.tankId;
                if (state.allRefills) {
                    const index = state.allRefills.findIndex((refill) => refill._id === updatedRefill._id);
                    if (index !== -1) {
                        state.allRefills[index] = updatedRefill;
                    }
                }
                if (tankId && state.refillsByTank[tankId]) {
                    const index = state.refillsByTank[tankId].findIndex((refill) => refill._id === updatedRefill._id);
                    if (index !== -1) {
                        state.refillsByTank[tankId][index] = updatedRefill;
                    }
                }
            })
            .addCase(updateRefill.rejected, (state, action) => {
                state.savingRefill = false;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.allRefills = null;
                state.refillsByTank = {};
                state.fetchingRefills = false;
            });
    }
});

export const { invalidateRefills } = refillSlice.actions;
export default refillSlice.reducer;
