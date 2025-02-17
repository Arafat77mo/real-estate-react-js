import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Paper,
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Card, CardContent, Divider, Grid, Stack
} from '@mui/material';
import {useDispatch, useSelector} from "react-redux";
import { fetchRenterDetails} from "../../features/reportSlice";

const RenterDetails = () => {
    const dispatch = useDispatch();
    const { userId, propertyId } = useParams();
    const {renter, status, error } = useSelector((state) => state.report);

    useEffect(() => {
        dispatch(fetchRenterDetails({ userId, propertyId }));
    }, [dispatch, userId, propertyId]);

    if (status === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (status === 'failed') {
        return (
            <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
                {error}
            </Typography>
        );
    }


    return (
        <Container sx={{ mt: 4 }}>
            {/* عنوان الصفحة */}
            <Typography variant="h4" gutterBottom align="center">
                تفاصيل الأقساط
            </Typography>

            {/* بطاقة تفاصيل الأقساط */}
            <Card variant="outlined" sx={{ maxWidth: 800, margin: '0 auto', mb: 4, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ mb: 1, textAlign: 'center', fontWeight: 'bold' }}>
                        معلومات الأقساط
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Stack spacing={0.5}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    الاسم
                                </Typography>
                                <Typography variant="body1">
                                    {renter?.user_name || 'غير متوفر'}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Stack spacing={0.5}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    العقار
                                </Typography>
                                <Typography variant="body1">
                                    {renter?.property_name || 'غير متوفر'}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Stack spacing={0.5}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    المبلغ المدفوع
                                </Typography>
                                <Typography variant="body1">
                                    {renter?.paid_amount || '0'}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Stack spacing={0.5}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    المبلغ المتبقي
                                </Typography>
                                <Typography variant="body1">
                                    {renter?.pending_amount || '0'}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Stack spacing={0.5}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    الأشهر المتبقية
                                </Typography>
                                <Typography variant="body1">
                                    {renter?.remaining_months !== null ? renter?.remaining_months : 'غير متوفر'}
                                </Typography>
                            </Stack>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Stack spacing={0.5}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    عدد الاشهر
                                </Typography>
                                <Typography variant="body1">
                                    {renter?.duration_months !== null ? renter?.duration_months : 'غير متوفر'}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Stack spacing={0.5}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    تاريخ الاستحقاق التالي
                                </Typography>
                                <Typography variant="body1">
                                    {renter?.next_due_date || 'غير متوفر'}
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* جدول المدفوعات */}
            <Typography variant="h5" gutterBottom align="center">
                المدفوعات
            </Typography>
            <TableContainer component={Paper} sx={{ maxWidth: 800, margin: '0 auto', boxShadow: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="payments table">
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell align="center">
                                <Typography variant="subtitle2">المبلغ</Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography variant="subtitle2">الحالة</Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography variant="subtitle2">تاريخ الاستحقاق</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renter?.payments && renter.payments.length > 0 ? (
                            renter.payments.map((payment) => (
                                <TableRow key={payment.id}>
                                    <TableCell align="center">{payment.amount}</TableCell>
                                    <TableCell align="center">{payment.payment_status}</TableCell>
                                    <TableCell align="center">{payment.due_date}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    <Typography variant="body2">لا توجد بيانات</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default RenterDetails;