import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages, sendMessage, addMessage } from '../features/chatSlice';
import echo from '../features/echo'; // الـ Echo instance
import {
    Box,
    TextField,
    Button,
    CircularProgress,
    Typography
} from '@mui/material';

const ChatMessages = ({ threadId, agent_id, user_id }) => {
    const dispatch = useDispatch();
    const { messages, status } = useSelector((state) => state.chat);
    // استخرج المستخدم الحالي من الـ auth slice
    const { user } = useSelector((state) => state.auth);
    const id   = localStorage.getItem('id');

    const [message, setMessage] = useState('');
    const messagesEndRef = useRef(null);

    // جلب الرسائل عند تغيير معرف المحادثة
    useEffect(() => {
        if (threadId) {
            dispatch(fetchMessages({ chat_thread_id: threadId, user_id }));
        }
    }, [dispatch, threadId, user_id]);

    // الاشتراك في قناة الدردشة وتحديث الحالة عند ورود رسالة جديدة
    useEffect(() => {
        if (echo) {
            const channel = echo.channel('chat');
            channel.listen('.chat', (e) => {
                console.log('New chat message:', e);
                // نفترض أن الرسالة تحتوي على خاصية chat_thread_id
                // وتقوم بمقارنتها مع الثريد الحالي المفتوح (threadId)
                if (e.chat_thread_id === threadId && Number(localStorage.getItem('id')) !== e.sender.id) {
                    dispatch(addMessage(e));
                } else {
                    // يمكنك هنا التعامل مع الرسالة من ثريد آخر مثل إظهار إشعار
                    console.log('Message received for a different thread');
                }
            });
            return () => {
                channel.stopListening('.chat');
            };
        } else {
            console.error('Echo instance is not defined.');
        }
    }, [dispatch, threadId, user_id]);


    // التمرير لأسفل القائمة عند تحديث الرسائل
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = () => {
        if (message.trim() !== '') {
            dispatch(sendMessage({ chat_thread_id: threadId, agent_id, message }));
            setMessage('');
        }
    };

    return (
        <Box display="flex" flexDirection="column" height="100vh" sx={{ backgroundColor: '#ECE5DD' }}>
            {/* قائمة الرسائل */}
            <Box flex={1} overflow="auto" p={2}>
                {status === 'loading' ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <CircularProgress />
                    </Box>
                ) : (
                    messages.map((msg) => {
                        // نحسب isMe عن طريق مقارنة معرف المرسل بمعرف المستخدم الحالي
                        const isMe = msg.sender.id === Number(id);
                        return (
                            <Box
                                key={msg.id}
                                display="flex"
                                justifyContent={isMe ? 'flex-end' : 'flex-start'}
                                mb={1}
                            >
                                <Box
                                    maxWidth="70%"
                                    p={1.5}
                                    borderRadius={2}
                                    sx={{
                                        backgroundColor: isMe ? '#DCF8C6' : '#FFFFFF',
                                        boxShadow: 1
                                    }}
                                >
                                    <>
                                        {/* عرض اسم المرسل */}
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                            {isMe ? 'Me' : msg.sender.name}
                                        </Typography>

                                        {/* عرض نص الرسالة */}
                                        <Typography variant="body1" sx={{ wordWrap: 'break-word', mb: 0.5 }}>
                                            {msg.message}
                                        </Typography>

                                        {/* عرض تاريخ ووقت الإرسال */}
                                        <Typography variant="caption" display="block" color="text.secondary">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Typography>
                                    </>


                                </Box>
                            </Box>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* إدخال الرسالة */}
            <Box p={2} display="flex" alignItems="center" sx={{ backgroundColor: '#F0F0F0' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="اكتب رسالتك..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 2
                    }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    sx={{ ml: 1, borderRadius: 2 }}
                >
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default ChatMessages;
