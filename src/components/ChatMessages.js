import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage } from '../features/chatSlice';
import echo from '../features/echo'; // Import the Echo instance configured for Reverb
import { List, ListItem, ListItemText, TextField, Button, CircularProgress } from '@mui/material';

const ChatMessages = ({ threadId, agent_id, user_id }) => {
    const dispatch = useDispatch();
    const { messages, status } = useSelector((state) => state.chat);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (threadId) {
            dispatch(fetchMessages({ chat_thread_id: threadId, user_id }));
        }
    }, [dispatch, threadId, user_id]);

    useEffect(() => {
        // Subscribe to the 'chat' channel using your Reverb-based Echo instance
        if (echo) {
            const channel = echo.channel('chat');
            channel.listen('.chat', (e) => {
                console.log('New chat message:', e);
                // Update messages after receiving a new message; you might dispatch a Redux action here
                dispatch(fetchMessages({ chat_thread_id: threadId, user_id }));

                const ws = new WebSocket("ws://localhost:8080/app/bvtmxl6bfbbiwmwin5xf?protocol=7&client=js&version=8.4.0&flash=false");
                ws.onopen = () => console.log("Connection open");
                ws.onerror = (error) => console.error("WebSocket error:", error);

            });
            return () => {
                channel.stopListening('.chat');
            };
        } else {
            console.error('Echo instance is not defined.');
        }
    }, [dispatch, threadId, user_id]);

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            dispatch(sendMessage({ chat_thread_id: threadId, agent_id, message }));
            setMessage('');
        }
    };

    return (
        <div>
            <h3>Messages</h3>
            {status === 'loading' && <CircularProgress />}
            <List>
                {messages.map((msg) => (
                    <ListItem key={msg.id} style={{ textAlign: msg.is_me ? 'right' : 'left' }}>
                        <ListItemText primary={msg.message} secondary={msg.is_me ? 'Me' : msg.sender.name} />
                    </ListItem>
                ))}
            </List>
            <div style={{ display: 'flex', marginTop: '10px' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <Button onClick={handleSendMessage} variant="contained" style={{ marginLeft: '10px' }}>
                    Send
                </Button>
            </div>
        </div>
    );
};

export default ChatMessages;
