import React, { useState } from 'react';
import { Container, Grid, Paper } from '@mui/material';
import ChatMessages from "../ChatMessages";
import ChatThreads from "../ChatThreads";



const Chat = () => {
    const [selectedThread, setSelectedThread] = useState([]);
console.log(selectedThread);
    return (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={2}>
                {/* المحادثات */}
                <Grid item xs={4}>
                    <Paper sx={{ padding: 2 }}>
                        <ChatThreads onSelectThread={setSelectedThread} />
                    </Paper>
                </Grid>

                {/* الرسائل */}
                <Grid item xs={8}>
                    <Paper sx={{ padding: 2 }}>
                        {selectedThread ? <ChatMessages threadId={selectedThread[0]}  agent_id={selectedThread[1]} user_id={selectedThread[1]}/> : <p>اختر محادثة</p>}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Chat;
