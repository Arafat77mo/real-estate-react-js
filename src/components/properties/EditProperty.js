import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Container, TextField, Button, Typography, Box, MenuItem, Select, FormControl, InputLabel, Grid, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPropertyById, updateProperty } from '../../features/propertySlice';
import { useNavigate, useParams } from 'react-router-dom';

const EditProperty = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const { property, status } = useSelector((state) => state.properties);

    // Fetch property details on component mount
    useEffect(() => {
        dispatch(fetchPropertyById(id));
    }, [dispatch, id]);

    // Validation Schema using Yup
    const validationSchema = Yup.object({
        name: Yup.object({
            en: Yup.string().required('English name is required').max(255, 'Name must be less than 255 characters'),
            ar: Yup.string().required('Arabic name is required').max(255, 'Name must be less than 255 characters'),
        }),
        description: Yup.object({
            en: Yup.string().required('English description is required'),
            ar: Yup.string().required('Arabic description is required'),
        }),
        location: Yup.string().required('Location is required').max(255, 'Location must be less than 255 characters'),
        price: Yup.number().required('Price is required').positive('Price must be positive'),
        status: Yup.string().required('Status is required').oneOf(['active', 'inactive'], 'Invalid status'),
        rooms: Yup.number().required('Rooms are required').integer('Rooms must be an integer').min(0, 'Rooms cannot be negative'),
        bathrooms: Yup.number().required('Bathrooms are required').integer('Bathrooms must be an integer').min(0, 'Bathrooms cannot be negative'),
        living_room_size: Yup.number().required('Living room size is required').min(0, 'Living room size cannot be negative'),
        additional_features: Yup.string().nullable(),
        type: Yup.string().required('Type is required').oneOf(['apartment', 'villa', 'land', 'office', 'commercial'], 'Invalid type'),
        latitude: Yup.number().nullable().min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
        longitude: Yup.number().nullable().min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
        property_images: Yup.array()
            .nullable()
            .test('fileType', 'Only JPEG and PNG images are allowed', (value) => {
                if (!value) return true; // If no files are uploaded, skip validation
                return value.every((file) => file.type === 'image/jpeg' || file.type === 'image/png');
            })
            .test('fileSize', 'File size must be less than 3MB', (value) => {
                if (!value) return true; // If no files are uploaded, skip validation
                return value.every((file) => file.size <= 3 * 1024 * 1024); // 3MB in bytes
            }),
    });
    const statusOptions = {
        "غير نشط": "inactive",
        "نشط": "active",
    };

    const typeOptions = {
        "شقة": "apartment",
        "فيلا": "villa",
        "أرض": "land",
        "مكتب": "office",
        "تجاري": "commercial",
    };
    // Formik Form
    const formik = useFormik({
        enableReinitialize: true, // Allow reinitialization when property data changes
        initialValues: {
            name: { en: property?.name_en, ar: property?.name_ar},
            description: { en: property?.description_en, ar: property?.description_ar},
            location: property?.location || '',
            price: property?.price || '',
            status: property ? (statusOptions[property.status] || property.status) : 'active',
            rooms: property?.rooms || '',
            bathrooms: property?.bathrooms || '',
            living_room_size: property?.living_room_size || '',
            additional_features: property?.additional_features || '',
            type: property ? (typeOptions[property.type] || property.type) : 'apartment',
            latitude: property?.latitude || '',
            longitude: property?.longitude || '',
            property_images: [], // Initialize as an empty array
        },
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();

            // Append all form fields to FormData
            Object.keys(values).forEach((key) => {
                if (key === 'property_images') {
                    values.property_images.forEach((file) => {
                        formData.append('property_images', file);
                    });
                } else if (typeof values[key] === 'object') {
                    Object.keys(values[key]).forEach((subKey) => {
                        formData.append(`${key}[${subKey}]`, values[key][subKey]);
                    });
                } else {
                    formData.append(key, values[key]);
                }
            });

            dispatch(updateProperty({ id, data: formData })).then(() => {
                navigate('/properties'); // Redirect to properties list after update
            });
        },
    });

    // Handle file input change
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // Convert FileList to Array
        formik.setFieldValue('property_images', files); // Update Formik state
    };

    if (status === 'loading') {
        return <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />;
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                تعديل العقار
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={3}>
                    {/* Name (English) */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="اسم العقار (الإنجليزية)"
                            name="name.en"
                            value={formik.values.name.en}
                            onChange={formik.handleChange}
                            error={formik.touched.name?.en && Boolean(formik.errors.name?.en)}
                            helperText={formik.touched.name?.en && formik.errors.name?.en}
                        />
                    </Grid>

                    {/* Name (Arabic) */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="اسم العقار (العربية)"
                            name="name.ar"
                            value={formik.values.name.ar}
                            onChange={formik.handleChange}
                            error={formik.touched.name?.ar && Boolean(formik.errors.name?.ar)}
                            helperText={formik.touched.name?.ar && formik.errors.name?.ar}
                        />
                    </Grid>

                    {/* Description (English) */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="الوصف (الإنجليزية)"
                            name="description.en"
                            value={formik.values.description.en}
                            onChange={formik.handleChange}
                            error={formik.touched.description?.en && Boolean(formik.errors.description?.en)}
                            helperText={formik.touched.description?.en && formik.errors.description?.en}
                            multiline
                            rows={4}
                        />
                    </Grid>

                    {/* Description (Arabic) */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="الوصف (العربية)"
                            name="description.ar"
                            value={formik.values.description.ar}
                            onChange={formik.handleChange}
                            error={formik.touched.description?.ar && Boolean(formik.errors.description?.ar)}
                            helperText={formik.touched.description?.ar && formik.errors.description?.ar}
                            multiline
                            rows={4}
                        />
                    </Grid>

                    {/* Location */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="الموقع"
                            name="location"
                            value={formik.values.location}
                            onChange={formik.handleChange}
                            error={formik.touched.location && Boolean(formik.errors.location)}
                            helperText={formik.touched.location && formik.errors.location}
                        />
                    </Grid>

                    {/* Price */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="السعر"
                            name="price"
                            type="number"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            error={formik.touched.price && Boolean(formik.errors.price)}
                            helperText={formik.touched.price && formik.errors.price}
                        />
                    </Grid>

                    {/* Status */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>الحالة</InputLabel>
                            <Select
                                name="status"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                error={formik.touched.status && Boolean(formik.errors.status)}
                            >
                                <MenuItem value="active">نشط</MenuItem>
                                <MenuItem value="inactive">غير نشط</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Type */}
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                            <InputLabel>النوع</InputLabel>
                            <Select
                                name="type"
                                value={formik.values.type}
                                onChange={formik.handleChange}
                                error={formik.touched.type && Boolean(formik.errors.type)}
                            >
                                <MenuItem value="apartment">شقة</MenuItem>
                                <MenuItem value="villa">فيلا</MenuItem>
                                <MenuItem value="land">أرض</MenuItem>
                                <MenuItem value="office">مكتب</MenuItem>
                                <MenuItem value="commercial">تجاري</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Rooms */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="عدد الغرف"
                            name="rooms"
                            type="number"
                            value={formik.values.rooms}
                            onChange={formik.handleChange}
                            error={formik.touched.rooms && Boolean(formik.errors.rooms)}
                            helperText={formik.touched.rooms && formik.errors.rooms}
                        />
                    </Grid>

                    {/* Bathrooms */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="عدد الحمامات"
                            name="bathrooms"
                            type="number"
                            value={formik.values.bathrooms}
                            onChange={formik.handleChange}
                            error={formik.touched.bathrooms && Boolean(formik.errors.bathrooms)}
                            helperText={formik.touched.bathrooms && formik.errors.bathrooms}
                        />
                    </Grid>

                    {/* Living Room Size */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="مساحة غرفة المعيشة"
                            name="living_room_size"
                            type="number"
                            value={formik.values.living_room_size}
                            onChange={formik.handleChange}
                            error={formik.touched.living_room_size && Boolean(formik.errors.living_room_size)}
                            helperText={formik.touched.living_room_size && formik.errors.living_room_size}
                        />
                    </Grid>

                    {/* Additional Features */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="ميزات إضافية"
                            name="additional_features"
                            value={formik.values.additional_features}
                            onChange={formik.handleChange}
                            error={formik.touched.additional_features && Boolean(formik.errors.additional_features)}
                            helperText={formik.touched.additional_features && formik.errors.additional_features}
                            multiline
                            rows={4}
                        />
                    </Grid>

                    {/* Latitude */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="خط العرض"
                            name="latitude"
                            type="number"
                            value={formik.values.latitude}
                            onChange={formik.handleChange}
                            error={formik.touched.latitude && Boolean(formik.errors.latitude)}
                            helperText={formik.touched.latitude && formik.errors.latitude}
                        />
                    </Grid>

                    {/* Longitude */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="خط الطول"
                            name="longitude"
                            type="number"
                            value={formik.values.longitude}
                            onChange={formik.handleChange}
                            error={formik.touched.longitude && Boolean(formik.errors.longitude)}
                            helperText={formik.touched.longitude && formik.errors.longitude}
                        />
                    </Grid>

                    {/* Property Images */}
                    <Grid item xs={12}>
                        <input
                            type="file"
                            name="property_images[]"                            multiple
                            onChange={handleFileChange}
                            accept="image/jpeg, image/png"
                        />
                        {formik.touched.property_images && formik.errors.property_images && (
                            <Typography color="error">{formik.errors.property_images}</Typography>
                        )}
                    </Grid>

                    {/* Submit Button */}
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            حفظ التعديلات
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default EditProperty;