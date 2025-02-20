import { Box, Button, Paper, Typography } from "@mui/material";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import api from "../../api/axios";
import {setCredentials} from "../../features/authSlice";
import {useState} from "react";

const SocialLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSocialLogin = async (provider) => {


        try {
            const response = await api.get(`/api/login/${provider}`);

            dispatch(setCredentials({
                user: response.data.data.user,
                token: response.data.data.token,
            }));

            navigate("/");
        } catch (error) {
            setError(error.response?.data?.message || "فشل تسجيل الدخول");
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    padding: 4,
                    width: 350,
                    textAlign: "center",
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    borderRadius: 2,
                }}

            >
                <Typography variant="h5" sx={{ mb: 2 }}>
                    تسجيل الدخول بواسطة وسائل التواصل الاجتماعي
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mb: 1 }}
                    onClick={() => handleSocialLogin("google")}
                >
                    تسجيل الدخول باستخدام Google
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={() => handleSocialLogin("github")}
                >
                    تسجيل الدخول باستخدام GitHub
                </Button>
            </Paper>
        </Box>
    );
};

export default SocialLogin;
