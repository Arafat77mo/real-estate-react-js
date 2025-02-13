import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../api/axios";

// إنشاء async thunk لجلب بيانات لوحة التحكم
export const fetchDashboardAnalytics = createAsyncThunk(
    'dashboard/fetchDashboardAnalytics',
    async () => {
        const response = await api.get('/api/dashboard/analytics'); // عدل نقطة النهاية حسب الحاجة
        return response.data.data; // تأكد من أن البيانات تُعاد بالشكل المناسب
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        analytics: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        // يمكنك إضافة reducers إضافية هنا إن احتجت
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardAnalytics.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.analytics = action.payload;
            })
            .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default dashboardSlice.reducer;
