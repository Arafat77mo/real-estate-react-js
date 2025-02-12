import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThreads } from '../features/chatSlice';
import { List, ListItem, ListItemText, CircularProgress } from '@mui/material';

const ChatThreads = ({ onSelectThread }) => {
    const dispatch = useDispatch();
    const { threads, status } = useSelector((state) => state.chat);

    useEffect(() => {
        dispatch(fetchThreads());
    }, [dispatch]);

    return (
        <div>
            <h3>المحادثات</h3>
            {status === 'loading' && <CircularProgress />}
            <List>
                {threads.map((thread) => (
                    <ListItem key={thread.id} button onClick={() => onSelectThread([thread.id,thread.participant.id])}>
                        <ListItemText
                            primary={thread.participant.name}
                            secondary={thread.last_message}
                        />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default ChatThreads;
