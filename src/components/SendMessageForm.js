import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

const SendMessageForm = ({ chatId }) => {
    const [message, setMessage] = useState('');
    const { token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`/api/chats/${chatId}/messages`, {
                message
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('');
            dispatch(fetchMessages(chatId)); // Refresh messages
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit">Send</button>
        </form>
    );
};

export default SendMessageForm;