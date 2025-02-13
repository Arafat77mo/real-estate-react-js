import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchThreads } from '../features/chatSlice';
import echo from '../features/echo'; // الـ Echo instance
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    CircularProgress,
    Typography,
    Paper,
    Badge,
    Box,
} from '@mui/material';

const ChatThreads = ({ onSelectThread }) => {
    const dispatch = useDispatch();
    const { threads, status } = useSelector((state) => state.chat);

    // دالة لتنسيق الوقت
    const formatTime = (time) => {
        const date = new Date(time);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // جلب الثريدات عند تحميل المكون
    useEffect(() => {
        dispatch(fetchThreads());
    }, [dispatch]);

    // الاشتراك في قناة "chatThreads" لتحديث القائمة في الوقت الحقيقي
    useEffect(() => {
        if (echo) {
            const channel = echo.channel('chatThreads');
            channel.listen('.thread.updated', (e) => {
                console.log('Real-time thread update:', e.thread);
                // عند استقبال حدث التحديث، نعيد جلب جميع الثريدات
                dispatch(fetchThreads());
                // يمكنك أيضًا تحديث الثريد المحدد فقط باستخدام أكشن مخصص إن توفر لديك ذلك
            });
            return () => {
                channel.stopListening('.thread.updated');
            };
        } else {
            console.error('Echo instance is not defined.');
        }
    }, [dispatch]);

    return (
        <Paper
            elevation={1}
            sx={{
                p: 1,
                borderRadius: 2,
                maxHeight: '80vh',
                overflow: 'auto',
                backgroundColor: '#fff',
            }}
        >
            <Typography
                variant="h6"
                gutterBottom
                sx={{ px: 2, py: 1, borderBottom: '1px solid #f0f0f0' }}
            >
                المحادثات
            </Typography>
            {status === 'loading' ? (
                <Box display="flex" justifyContent="center" alignItems="center" sx={{ mt: 2 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <List disablePadding>
                    {threads.map((thread) => (
                        <ListItem
                            key={thread.id}
                            button
                            onClick={() => onSelectThread([thread.id, thread.participant.id])}
                            sx={{ borderBottom: '1px solid #f0f0f0', py: 1, px: 2 }}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: '#1976d2' }}>
                                    {thread.participant.name
                                        ? thread.participant.name.charAt(0).toUpperCase()
                                        : 'U'}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        {thread.participant.name}
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body2" color="text.secondary">
                                            {thread.is_me ? 'أنا' : thread.participant.name}
:
                                        {thread.last_message}
                                    </Typography>
                                }
                            />
                            <Box display="flex" flexDirection="column" alignItems="flex-end">
                                <Typography variant="caption" color="text.secondary">
                                    {formatTime(thread.updated_at)}
                                </Typography>
                                {thread.unread_count > 0 && (
                                    <Badge color="primary" badgeContent={thread.unread_count} sx={{ mt: 1 }} />
                                )}
                            </Box>
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default ChatThreads;
