import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Grid, Paper, Button } from '@mui/material';

const ReportDashboard = () => {
    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                تقارير المالك
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            المشترين
                        </Typography>
                        <Button variant="contained" component={Link} to="/buyers">
                            عرض التقرير
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            المستأجرين
                        </Typography>
                        <Button variant="contained" component={Link} to="/renters">
                            عرض التقرير
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" gutterBottom>
                            الأقساط
                        </Typography>
                        <Button variant="contained" component={Link} to="/installments">
                            عرض التقرير
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ReportDashboard;