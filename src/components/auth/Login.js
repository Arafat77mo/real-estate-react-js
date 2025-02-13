import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import api from "../../api/axios";
import { setCredentials } from "../../features/authSlice";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/api/login", { email, password });

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
                backgroundImage: "url('https://your-image-url.com')",
                backgroundSize: "cover",
                backgroundPosition: "center",
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
                    تسجيل الدخول
                </Typography>

                {error && <Typography color="error">{error}</Typography>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="البريد الإلكتروني"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <TextField
                        label="كلمة المرور"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                    >
                        تسجيل الدخول
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;
