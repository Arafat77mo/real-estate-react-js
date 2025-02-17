import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Paper, Box } from '@mui/material';

const BuyerDetails = () => {
    const { id } = useParams(); // الحصول على الـ ID من الرابط

    // هنا يمكنك جلب تفاصيل المشتري من الـ API باستخدام الـ ID
    const buyerDetails = {
        user_id: id,
        user_name: "محمد أحمد",
        property_name: "فيلا ١",
        is_paid: true,
        payment_date: "2023-10-01",
    };

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                تفاصيل المشتري
            </Typography>
            <Paper sx={{ p: 2 }}>
                <Box>
                    <Typography variant="body1">
                        <strong>الاسم:</strong> {buyerDetails.user_name}
                    </Typography>
                    <Typography variant="body1">
                        <strong>العقار:</strong> {buyerDetails.property_name}
                    </Typography>
                    <Typography variant="body1">
                        <strong>الحالة:</strong> {buyerDetails.is_paid ? "مدفوع" : "غير مدفوع"}
                    </Typography>
                    <Typography variant="body1">
                        <strong>تاريخ الدفع:</strong> {buyerDetails.payment_date}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default BuyerDetails;