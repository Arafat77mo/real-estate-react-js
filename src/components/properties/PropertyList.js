import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProperties, deleteProperty } from '../../features/propertySlice';
import {
    Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    Pagination, TextField, CircularProgress, InputAdornment, IconButton, Menu, MenuItem, Box, Typography
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
    const [filterAnchorEl, setFilterAnchorEl] = useState(null); // State for filter menu
    const [filters, setFilters] = useState({}); // State for column filters

    useEffect(() => {
        dispatch(fetchProperties({ page, query: searchQuery, filters }));
    }, [dispatch, page, searchQuery, filters]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget); // Open filter menu
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null); // Close filter menu
    };

    const handleFilterChange = (column, value) => {
        setFilters((prevFilters) => ({ ...prevFilters, [column]: value }));
        setPage(1); // Reset to first page on filter change
        handleFilterClose(); // Close filter menu
    };

    const handleDelete = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا العقار؟')) {
            dispatch(deleteProperty(id)).then(() => {
                dispatch(fetchProperties({ page, query: searchQuery, filters })); // Refresh the list after deletion
            });
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-property/${id}`); // Navigate to edit page
    };

    const handleDetails = (id) => {
        navigate(`/property/${id}`); // Navigate to details page
    };

    return (
        <Container sx={{ mt: 4 }}>
            {/* 🔎 Search Bar */}
            <TextField
                label="ابحث عن عقار..."
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
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
            />

            {/* 🛠️ Filter Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <IconButton onClick={handleFilterClick}>
                    <FilterListIcon />
                </IconButton>
                <Menu
                    anchorEl={filterAnchorEl}
                    open={Boolean(filterAnchorEl)}
                    onClose={handleFilterClose}
                >
                    <MenuItem onClick={() => handleFilterChange('location', 'الرياض')}>الرياض</MenuItem>
                    <MenuItem onClick={() => handleFilterChange('location', 'جدة')}>جدة</MenuItem>
                    <MenuItem onClick={() => handleFilterChange('location', 'الدمام')}>الدمام</MenuItem>
                </Menu>
            </Box>

            {/* ⏳ Loading State */}
            {status === 'loading' && <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />}

            {/* 📋 Property Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>الصورة</TableCell>
                            <TableCell>العنوان</TableCell>
                            <TableCell>السعر</TableCell>
                            <TableCell>الموقع</TableCell>
                            <TableCell>الإجراءات</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {properties.map((property) => (
                            <TableRow key={property.id}>
                                <TableCell>
                                    <img src={property.cover_image_url} alt={property.title} width="80" height="50" />
                                </TableCell>
                                <TableCell>{property.name}</TableCell>
                                <TableCell>{property.price} ريال</TableCell>
                                <TableCell>{property.location}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleDetails(property.id)}>
                                        <VisibilityIcon color="primary" />
                                    </IconButton>
                                    <IconButton onClick={() => handleEdit(property.id)}>
                                        <EditIcon color="secondary" />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(property.id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 📑 Pagination */}
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, value) => setPage(value)}
                sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
            />
        </Container>
    );
};

export default PropertyList;