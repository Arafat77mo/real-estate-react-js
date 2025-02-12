import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';


// Fetch chat threads
export const fetchThreads = createAsyncThunk('chat/fetchThreads', async () => {
    const response = await api.get(`/api/threads`);
    return response.data.data; // Adjust based on Laravel response
});

// Fetch messages for a thread
export const fetchMessages = createAsyncThunk('chat/fetchMessages', async ({chat_thread_id, user_id}) => {
    const response = await api.post(`/api/messages/chatThread`, { chat_thread_id,user_id});
    return response.data.data; // Adjust based on Laravel response
});

// Send a new message
export const sendMessage = createAsyncThunk('chat/sendMessage', async ({ chat_thread_id, message,agent_id }) => {
    const response = await api.post(`/api/messages`, { chat_thread_id, message ,agent_id});
    return response.data.data; // Adjust based on Laravel response
});

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        threads: [],
        messages: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchThreads.fulfilled, (state, action) => {
                state.threads = action.payload;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.messages = action.payload;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.messages.push(action.payload); // Add new message to the list
            });
    },
});

export default chatSlice.reducer;
