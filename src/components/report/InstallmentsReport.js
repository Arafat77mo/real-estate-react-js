import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstallmentsReport } from '../../features/reportSlice';
import {
    Container,
    Paper,
    Typography,
    Box,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button
} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const InstallmentsReport = () => {
    const dispatch = useDispatch();
    const { installments, status, error } = useSelector((state) => state.report);
    const navigate = useNavigate();

    useEffect(() => {
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
    const handleDetails = (user_id,property_id) => {
        navigate(`/installment/${user_id}/${property_id}`);
    };
    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                تقرير الأقساط
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>الاسم</TableCell>
                            <TableCell align="right">العقار</TableCell>
                            <TableCell align="right">المدفوع</TableCell>
                            <TableCell align="right">المتبقي</TableCell>
                            <TableCell align="right">باقي الأشهر</TableCell>
                            <TableCell align="right">موعد الاستحقاق</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {installments && installments.data && installments.data.length > 0 ? (
                            installments.data.map((installment) => (
                                <TableRow key={`${installment.user_id}_${installment.property_id}`}>
                                    <TableCell component="th" scope="row">
                                        {installment.user_name}
                                    </TableCell>
                                    <TableCell align="right">{installment.property_name || "غير متوفر"}</TableCell>
                                    <TableCell align="right">{installment.paid_amount}</TableCell>
                                    <TableCell align="right">{installment.pending_amount}</TableCell>
                                    <TableCell align="right">{installment.remaining_months}</TableCell>
                                    <TableCell align="right">{installment.next_due_date}</TableCell>
                                    <Button
                                        variant="contained"
                                        onClick={() => handleDetails(installment.user_id,installment.property_id)} // الانتقال إلى صفحة التفاصيل
                                    >
                                        عرض التفاصيل
                                    </Button>
                                </TableRow>


                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">لا توجد بيانات</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default InstallmentsReport;