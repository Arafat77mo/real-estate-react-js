import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties, deleteProperty } from '../../features/propertySlice';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    TextField,
    CircularProgress,
    InputAdornment,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Typography,
    Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

const PropertyList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { properties, status, currentPage, totalPages } = useSelector((state) => state.properties);

    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        dispatch(fetchProperties({ page, query: searchQuery, filters }));
    }, [dispatch, page, searchQuery, filters]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(1);
    };

    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleFilterChange = (column, value) => {
        setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
        setPage(1);
        handleFilterClose();
    };

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العقار؟')) {
            dispatch(deleteProperty(id)).then(() => {
                dispatch(fetchProperties({ page, query: searchQuery, filters }));
            });
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-property/${id}`);
    };

    const handleDetails = (id) => {
        navigate(`/property/${id}`);
    };

    // دالة زر الإنشاء
    const handleCreate = () => {
        navigate('/create-property'); // توجه لصفحة إنشاء العقار
    };

    return (
        <Container sx={{ mt: 4 }}>
            {/* شريط البحث وزر الإنشاء */}
            <Box display="flex" alignItems="center" mb={2}>
                <TextField
                    label="ابحث عن عقار..."
                    variant="outlined"
                    fullWidth
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mr: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleCreate}>
                    إنشاء عقار
                </Button>
            </Box>

            {/* زر الفلترة */}
            <Box display="flex" justifyContent="flex-end" mb={2}>
                <IconButton onClick={handleFilterClick}>
                    <FilterListIcon />
                </IconButton>
                <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleFilterClose}>
                    <MenuItem onClick={() => handleFilterChange('location', 'الرياض')}>الرياض</MenuItem>
                    <MenuItem onClick={() => handleFilterChange('location', 'جدة')}>جدة</MenuItem>
                    <MenuItem onClick={() => handleFilterChange('location', 'الدمام')}>الدمام</MenuItem>
                </Menu>
            </Box>

            {/* حالة التحميل */}
            {status === 'loading' && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}

            {/* جدول العقارات */}
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>الصورة</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>العنوان</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>السعر</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>الموقع</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>الإجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {properties.map((property) => (
                            <TableRow key={property.id} hover>
                                <TableCell>
                                    <img
                                        src={property.cover_image_url}
                                        alt={property.title}
                                        style={{
                                            width: '80px',
                                            height: '50px',
                                            objectFit: 'cover',
                                            borderRadius: '4px',
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                        {property.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>{property.price} ريال</TableCell>
                                <TableCell>{property.location}</TableCell>
                                <TableCell align="center">
                                    <IconButton onClick={() => handleDetails(property.id)} size="small">
                                        <VisibilityIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => handleEdit(property.id)} size="small">
                                        <EditIcon color="secondary" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(property.id)} size="small">
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* ترقيم الصفحات */}
            <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(e, value) => setPage(value)}
                    sx={{ mb: 2 }}
                />
            </Box>
        </Container>
    );
};

export default PropertyList;
