// src/features/reportSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../api/axios";

// جلب تقرير المشترين
export const fetchBuyersReport = createAsyncThunk(
    'report/fetchBuyersReport',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/reports/buyers');
            return response.data.data; // تأكد من أن البيانات تُعاد بالشكل المطلوب
        } catch (err) {
            return rejectWithValue(err.response.data.data);
        }
    }
);

// جلب تقرير المستأجرين
export const fetchRentersReport = createAsyncThunk(
    'report/fetchRentersReport',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/reports/renters');
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data.data);
        }
    }
);

// جلب تقرير الأقساط
export const fetchInstallmentsReport = createAsyncThunk(
    'report/fetchInstallmentsReport',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/api/reports/installments');
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data.data);
        }
    }
);

export const fetchRenterDetails = createAsyncThunk(
    'report/fetchRenterDetails',
    async ({ userId, propertyId }, { rejectWithValue }) => { // استخدم كائنًا
        try {
            const response = await api.get(`/api/reports/renter/${userId}/${propertyId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchInstallmentDetails = createAsyncThunk(
    'report/fetchInstallmentDetails',
    async ({ userId, propertyId }, { rejectWithValue }) => { // استخدم كائنًا
        try {
            const response = await api.get(`/api/reports/installment/${userId}/${propertyId}`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data.data);
        }
    }
);

const reportSlice = createSlice({
    name: 'report',
    initialState: {
        buyers: null,
        renters: null,
        installments: null,
        renter: null,
        installment: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        clearReports: (state) => {
            state.buyers = null;
            state.renters = null;
            state.renter = null;
            state.installments = null;
            state.installment = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Buyers report
            .addCase(fetchBuyersReport.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchBuyersReport.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.buyers = action.payload;
            })
            .addCase(fetchBuyersReport.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            // Renters report
            .addCase(fetchRentersReport.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRentersReport.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.renters = action.payload;
            })
            .addCase(fetchRentersReport.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            // Installments report
            .addCase(fetchInstallmentsReport.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchInstallmentsReport.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.installments = action.payload;
            })
            .addCase(fetchInstallmentsReport.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error.message;
            })
            .addCase(fetchInstallmentDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.installment = action.payload;
            })
            .addCase(fetchRenterDetails.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.renter = action.payload;
            })
    },
});

export const { clearReports } = reportSlice.actions;
export default reportSlice.reducer;
