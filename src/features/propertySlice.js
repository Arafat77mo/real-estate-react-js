import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api/axios';

export const fetchProperties = createAsyncThunk(
    'properties/fetchAll',
    async ({ page = 1, query = '' }) => {
        const response = await api.get(`/api/properties?page=${page}&query=${query}`);
        return {
            properties: response.data.data.data, // 👈 الوصول إلى قائمة العقارات
            currentPage: response.data.data.current_page,
            totalPages: response.data.data.last_page,
        };
    }
);


export const fetchPropertyById = createAsyncThunk(
    'properties/fetchPropertyById',
    async (id, { rejectWithValue }) => {
        try {
            const response =  await api.get(`/api/properties/${id}`); // Replace with your API endpoint
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const createProperty = createAsyncThunk(
    'properties/createProperty',
    async (propertyData, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/properties`, propertyData);
            return response.data; // Assuming the API returns the created property
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Async Thunk to Update a Property
export const updateProperty = createAsyncThunk(
    'properties/updateProperty',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/api/properties/${id}`, data);
            return response.data; // Assuming the API returns the updated property
        } catch (error) {
            return rejectWithValue(error.response.data.data);
        }
    }
);
export const deleteProperty = createAsyncThunk(
    'properties/deleteProperty',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/api/properties/${id}`); // Replace with your API endpoint
            return id;
        } catch (error) {
            return rejectWithValue(error.response.data.data);
        }
    }
);
// مثال على Redux slice
const propertySlice = createSlice({
    name: 'properties',
    initialState: {
        properties: [],
        status: 'idle',
        error: null,
        totalPages: 1,
        currentPage: 1,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProperties.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProperties.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.properties = action.payload.properties; // ✅ البيانات الصحيحة
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(fetchProperties.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

      .addCase(fetchPropertyById.pending, (state) => {
            state.status = 'loading';
        })
            .addCase(fetchPropertyById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.property = action.payload;
            })
            .addCase(fetchPropertyById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Create Property
            .addCase(createProperty.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createProperty.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.properties.unshift(action.payload); // Add the new property to the list
            })
            .addCase(createProperty.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // Update Property
            .addCase(updateProperty.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateProperty.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedProperty = action.payload;
                state.properties = state.properties.map((property) =>
                    property.id === updatedProperty.id ? updatedProperty : property
                );
                state.property = updatedProperty; // Update the single property in state
            })
            .addCase(updateProperty.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

    .addCase(deleteProperty.fulfilled, (state, action) => {
            state.properties = state.properties.filter((property) => property.id !== action.payload);
        });
    }
});

export default propertySlice.reducer;