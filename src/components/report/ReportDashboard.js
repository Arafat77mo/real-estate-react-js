// src/components/ReportDashboard.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBuyersReport, fetchRentersReport, fetchInstallmentsReport } from '../../features/reportSlice';
import { Container, Grid, Paper, Typography, Box, CircularProgress } from '@mui/material';

const ReportDashboard = () => {
    const dispatch = useDispatch();
    const { buyers, renters, installments, status, error } = useSelector((state) => state.report);

    useEffect(() => {
        dispatch(fetchBuyersReport());
        dispatch(fetchRentersReport());
        dispatch(fetchInstallmentsReport());
    }, [dispatch]);

    if (status === 'loading') {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (status === 'failed') {
        return <Typography variant="h6" color="error">حدث خطأ: {error}</Typography>;
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                تقارير المالك
            </Typography>
            <Grid container spacing={2}>
                {/* تقرير المشترين */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, minHeight: 200 }}>
                        <Typography variant="h6" gutterBottom>
                            المشترين
                        </Typography>
                        {buyers && buyers.data && buyers.data.length > 0 ? (
                            buyers.data.map((buyer) => (
                                <Box key={buyer.user_id} sx={{ mt: 1, borderBottom: '1px solid #eee', pb: 1 }}>
                                    <Typography variant="body1">
                                        {buyer.user_name} - {buyer.property_name || "غير متوفر"}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {buyer.is_paid ? "مدفوع" : "غير مدفوع"}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2">لا توجد بيانات</Typography>
                        )}
                    </Paper>
                </Grid>

                {/* تقرير المستأجرين */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, minHeight: 200 }}>
                        <Typography variant="h6" gutterBottom>
                            المستأجرين
                        </Typography>
                        {renters && renters.data && renters.data.length > 0 ? (
                            renters.data.map((renter) => (
                                <Box key={`${renter.user_id}_${renter.property_id}`} sx={{ mt: 1, borderBottom: '1px solid #eee', pb: 1 }}>
                                    <Typography variant="body1">
                                        {renter.user_name} - {renter.property_name || "غير متوفر"}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        المدفوع: {renter.paid_amount} - المتبقي: {renter.pending_amount}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2">لا توجد بيانات</Typography>
                        )}
                    </Paper>
                </Grid>

                {/* تقرير الأقساط */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, minHeight: 200 }}>
                        <Typography variant="h6" gutterBottom>
                            الأقساط
                        </Typography>
                        {installments && installments.data && installments.data.length > 0 ? (
                            installments.data.map((installment) => (
                                <Box key={`${installment.user_id}_${installment.property_id}`} sx={{ mt: 1, borderBottom: '1px solid #eee', pb: 1 }}>
                                    <Typography variant="body1">
                                        {installment.user_name} - {installment.property_name || "غير متوفر"}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        المدفوع: {installment.paid_amount} - المتبقي: {installment.pending_amount}
                                        {installment.remaining_months !== null ? ` - باقي: ${installment.remaining_months} شهر` : ""}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        موعد الاستحقاق: {installment.next_due_date}
                                    </Typography>
                                </Box>
                            ))
                        ) : (
                            <Typography variant="body2">لا توجد بيانات</Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ReportDashboard;
