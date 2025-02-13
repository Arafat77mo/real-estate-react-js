import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import propertyReducer from '../features/propertySlice';
import chatReducer from '../features/chatSlice';
import dashboardReducer from '../features/dashboardslice';
import reportReducer from '../features/reportSlice';


export const store = configureStore({
    reducer: {
        auth: authReducer,
        properties: propertyReducer,
        chat: chatReducer,
        dashboard: dashboardReducer,
        report: reportReducer,



    }
});
