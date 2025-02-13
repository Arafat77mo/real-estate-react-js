import React, { useState } from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import ChatMessages from "../ChatMessages";
import ChatThreads from "../ChatThreads";

const Chat = () => {
    const [selectedThread, setSelectedThread] = useState([]);
    console.log(selectedThread);

    return (
        <Container maxWidth="lg" sx={{ mt: 4, height: '110vh' }}>
            <Paper
                sx={{
                    height: '100%',
                    overflow: 'hidden',
                    display: 'flex',
                    boxShadow: 3,
                    borderRadius: 2,
                }}
            >
                <Grid container sx={{ height: '60%' }}>
                    {/* قائمة المحادثات */}
                    <Grid
                        item
                        xs={4}
                        sx={{
                            borderRight: '1px solid #f0f0f0',
                            backgroundColor: '#fff',
                        }}
                    >
                        <Box sx={{ height: '100%', overflowY: 'auto', p: 2 }}>
                            <ChatThreads onSelectThread={setSelectedThread} />
                        </Box>
                    </Grid>
                    {/* منطقة الرسائل */}
                    <Grid
                        item
                        xs={8}
                        sx={{
                            backgroundColor: '#ECE5DD',
                            position: 'relative',
                        }}
                    >
                        <Box sx={{ height: '100%', overflowY: 'auto', p: 2 }}>
                            {selectedThread && selectedThread.length > 0 ? (
                                <ChatMessages
                                    threadId={selectedThread[0]}
                                    agent_id={selectedThread[1]}
                                    user_id={selectedThread[1]}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography variant="h6" color="text.secondary">
                                        اختر محادثة
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Chat;
