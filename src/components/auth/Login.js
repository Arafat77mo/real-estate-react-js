import {useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    Box, TextField, Button, Paper, Typography,
    Divider, Stack
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import Github from "@mui/icons-material/GitHub";
import api from "../../api/axios";
import { setCredentials } from "../../features/authSlice";
const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [provider, setProvider] = useState(null);
    const [loginUrl, setLoginUrl] = useState(null);

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

    // In your root component (App.jsx)


    useEffect(() => {
        if (provider) {
            window.location.href = `http://127.0.0.1:8000/api/login/${provider}`;
        }
    }, [provider]);

    function handleSocialLogin(provider) {
        setProvider(provider);
    }

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');
        if (token) {
            // تخزين التوكن (يمكنك أيضًا جلب بيانات المستخدم في هذه المرحلة)
            dispatch(setCredentials({ token }));
            // إعادة التوجيه للصفحة الرئيسية أو أي صفحة أخرى
            navigate("/");
        }
    }, [dispatch, navigate]);


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

                <Divider sx={{ my: 3 }}>أو</Divider>

                <Stack spacing={2}>
                    <Button
                        onClick={() => handleSocialLogin("google")}

                        variant="outlined"
                        fullWidth
                        startIcon={<GoogleIcon />}
                        href={loginUrl}  // Laravel social route
                        sx={{ textTransform: 'none' }}
                    >
                        تسجيل الدخول باستخدام Google
                    </Button>
                    <Button
                        onClick={() => handleSocialLogin("facebook")}

                        variant="outlined"
                        fullWidth
                        startIcon={<FacebookIcon />}
                        href={loginUrl}  // Laravel social route
                        sx={{ textTransform: 'none' }}
                    >
                        تسجيل الدخول باستخدام Facebook
                    </Button>
                    <Button
                        onClick={() => handleSocialLogin("github")}

                        variant="outlined"
                        fullWidth
                        startIcon={<Github />}
                        href={loginUrl}  // Laravel social route
                        sx={{ textTransform: 'none' }}
                    >
                        تسجيل الدخول باستخدام GitHub
                    </Button>
                </Stack>
            </Paper>
        </Box>
    );
};

export default Login;
