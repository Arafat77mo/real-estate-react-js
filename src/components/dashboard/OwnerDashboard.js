import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardAnalytics } from '../../features/dashboardslice';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    CircularProgress,
    useTheme,
} from '@mui/material';
import {
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend,
} from 'recharts';

const OwnerDashboard = () => {
    const dispatch = useDispatch();
    const { analytics, status, error } = useSelector((state) => state.dashboard);
    const theme = useTheme();

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchDashboardAnalytics());
        }
    }, [status, dispatch]);

    if (status === 'loading') {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (status === 'failed') {
        return <Typography variant="h6" color="error">{error}</Typography>;
    }

    if (!analytics) {
        return <Typography variant="h6">لا توجد بيانات متاحة.</Typography>;
    }

    // استخراج البيانات من الـ analytics
    const {
        total_properties,
        active_properties,
        sold_properties,
        rented_properties,
        total_buyers,
        total_renters,
        monthly_revenue,
        analytics_trend,
    } = analytics;

    // تحويل بيانات الإيرادات الشهرية من كائن إلى مصفوفة لتناسب Recharts
    const monthlyRevenueData = Object.keys(monthly_revenue).map((month) => ({
        month,
        revenue: monthly_revenue[month],
    }));

    // بيانات المخطط الدائري لتوزيع العقارات
    const propertyDistributionData = [
        { name: 'نشطة', value: active_properties },
        { name: 'مباعة', value: sold_properties },
        { name: 'مؤجرة', value: rented_properties },
    ];

    // ألوان المخطط الدائري
    const COLORS = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.success.main];

    // بيانات المخطط الخطي لتحليل الاتجاهات
    const trendData = [
        { name: 'المبيعات', value: analytics_trend.sale_increase },
        { name: 'الإيجار', value: analytics_trend.rent_increase },
    ];

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                لوحة تحكم المالك
            </Typography>
            <Grid container spacing={3}>
                {/* بطاقات الإحصائيات */}
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: theme.palette.primary.main, color: 'white' }}>
                        <Typography variant="h6">إجمالي العقارات</Typography>
                        <Typography variant="h3">{total_properties}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: theme.palette.secondary.main, color: 'white' }}>
                        <Typography variant="h6">العقارات النشطة</Typography>
                        <Typography variant="h3">{active_properties}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: theme.palette.success.main, color: 'white' }}>
                        <Typography variant="h6">العقارات المباعة</Typography>
                        <Typography variant="h3">{sold_properties}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: theme.palette.warning.main, color: 'white' }}>
                        <Typography variant="h6">العقارات المؤجرة</Typography>
                        <Typography variant="h3">{rented_properties}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: theme.palette.info.main, color: 'white' }}>
                        <Typography variant="h6">إجمالي المشترين</Typography>
                        <Typography variant="h3">{total_buyers}</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: theme.palette.error.main, color: 'white' }}>
                        <Typography variant="h6">إجمالي المستأجرين</Typography>
                        <Typography variant="h3">{total_renters}</Typography>
                    </Paper>
                </Grid>

                {/* رسم بياني للإيرادات الشهرية */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, height: '400px' }}>
                        <Typography variant="h6" gutterBottom>
                            الإيرادات الشهرية
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={monthlyRevenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="revenue" fill={theme.palette.primary.main} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* مخطط دائري لتوزيع العقارات */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: '400px' }}>
                        <Typography variant="h6" gutterBottom>
                            توزيع العقارات
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie
                                    data={propertyDistributionData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {propertyDistributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* مخطط خطي لتحليل الاتجاهات */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, height: '400px' }}>
                        <Typography variant="h6" gutterBottom>
                            تحليل الاتجاهات
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default OwnerDashboard;