import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRentersReport } from '../../features/reportSlice';
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
import { Link } from 'react-router-dom';

const RentersReport = () => {
    const dispatch = useDispatch();
    const { renters, status, error } = useSelector((state) => state.report);

    useEffect(() => {
        dispatch(fetchRentersReport());
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
                تقرير المستأجرين
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>الاسم</TableCell>
                            <TableCell align="right">العقار</TableCell>
                            <TableCell align="right">المدفوع</TableCell>
                            <TableCell align="right">المتبقي</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {renters && renters.data && renters.data.length > 0 ? (
                            renters.data.map((renter) => (
                                <TableRow key={`${renter.user_id}_${renter.property_id}`}>
                                    <TableCell component="th" scope="row">
                                        {renter.user_name}
                                    </TableCell>
                                    <TableCell align="right">{renter.property_name || "غير متوفر"}</TableCell>
                                    <TableCell align="right">{renter.paid_amount}</TableCell>
                                    <TableCell align="right">{renter.pending_amount}</TableCell>
                                    <TableCell align="right">
                                        <Button
                                            variant="contained"
                                            component={Link}
                                            to={`/renter/${renter.user_id}/${renter.property_id}`} // الانتقال إلى صفحة التفاصيل
                                        >
                                            عرض التفاصيل
                                        </Button>
                                    </TableCell>
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

export default RentersReport;