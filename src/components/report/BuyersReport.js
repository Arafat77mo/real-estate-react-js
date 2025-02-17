import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBuyersReport } from '../../features/reportSlice';
import { Container, Paper, Typography, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const BuyersReport = () => {
    const dispatch = useDispatch();
    const { buyers, status, error } = useSelector((state) => state.report);

    useEffect(() => {
        dispatch(fetchBuyersReport());
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
                تقرير المشترين
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>اسم المشتري</TableCell>
                            <TableCell align="right">العقار</TableCell>
                            <TableCell align="right">الحالة</TableCell>
                            <TableCell align="right">تم الدفع</TableCell>
                            <TableCell align="right">تاريخ الدفع </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {buyers && buyers.data && buyers.data.length > 0 ? (
                            buyers.data.map((buyer) => (
                                <TableRow key={buyer.user_id}>
                                    <TableCell component="th" scope="row">
                                        {buyer.user_name}
                                    </TableCell>
                                    <TableCell align="right">{buyer.property_name || "غير متوفر"}</TableCell>
                                    <TableCell align="right">{buyer.is_paid ? "مدفوع" : "غير مدفوع"}</TableCell>
                                    <TableCell align="right">{buyer?.paid}</TableCell>
                                    <TableCell align="right">{buyer.date}</TableCell>

                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">لا توجد بيانات</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default BuyersReport;