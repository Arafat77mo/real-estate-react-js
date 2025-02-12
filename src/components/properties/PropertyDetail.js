import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchPropertyById } from '../../features/propertySlice'; // Assuming you have a slice for fetching a single property
import { Container, Typography, Card, CardMedia, CardContent, Box, CircularProgress } from '@mui/material';

const PropertyDetail = () => {
    const dispatch = useDispatch();
    const { id } = useParams(); // Get the property ID from the URL
    const { property, status, error } = useSelector((state) => state.properties); // Assuming your Redux state has a `property` object for details

    // Fetch property details when the component mounts or the ID changes
    useEffect(() => {
        dispatch(fetchPropertyById(id));
    }, [dispatch, id]);

    console.log(property);
    // Display loading state
    if (status === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    // Display error state
    if (status === 'failed') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Typography variant="h6" color="error">
                    Error: {error}
                </Typography>
            </Box>
        );
    }

    // Display property details
    return (
        <Container sx={{ mt: 4 }}>
            {property ? (
                <Card>
                    {property.image ? (
                        <CardMedia
                            component="img"
                            height="400"
                            image={property.image}
                            alt={property.title}
                        />
                    ) : (
                        <Box
                            sx={{
                                height: 400,
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Typography variant="subtitle1" color="text.secondary">
                                No Image Available
                            </Typography>
                        </Box>
                    )}
                    <CardContent>
                        <Typography variant="h4" component="div" gutterBottom>
                            {property.name.ar}
                        </Typography> <Typography variant="h4" component="div" gutterBottom>
                        {property.name.en}
                    </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            السعر: {property.price} ريال
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            الوصف: {property.description.ar}
                        </Typography>  <Typography variant="body1" color="text.secondary" gutterBottom>
                        الوصف: {property.description.en}
                    </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            الموقع: {property.location}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            عدد الغرف: {property.rooms}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            عدد الحمامات: {property.bathrooms}
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Typography variant="h6" color="text.secondary">
                    No property found.
                </Typography>
            )}
        </Container>
    );
};

export default PropertyDetail;