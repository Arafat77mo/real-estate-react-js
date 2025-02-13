import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet, useNavigate } from 'react-router-dom';
import {Chat} from "@mui/icons-material";

const drawerWidth = 240;

// إنشاء AppBar مُخصص
const MyAppBar = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

// إنشاء موضوع مخصص
const mdTheme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#ff4081' },
        background: { default: '#f4f6f8' },
    },
    typography: {
        fontFamily: '"Roboto", sans-serif',
    },
});

export default function DashboardLayout() {
    const [open, setOpen] = React.useState(true);
    const navigate = useNavigate();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const menuItems = [
        { text: 'الرئيسية', icon: <HomeIcon />, path: '/' },
        { text: 'العقارات', icon: <ApartmentIcon />, path: '/properties' },
        { text: 'المستأجرين', icon: <PeopleIcon />, path: '/tenants' },
        { text: "المحادثات", icon: <Chat />, path: "/chat" },
        { text: 'التقارير', icon: <BarChartIcon />, path: '/reports' },
        { text: 'الإعدادات', icon: <SettingsIcon />, path: '/settings' },
        { text: 'تسجيل الخروج', icon: <LogoutIcon />, path: '/logout' },
    ];

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <MyAppBar position="fixed" open={open}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={toggleDrawer}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                            إدارة العقارات
                        </Typography>
                    </Toolbar>
                </MyAppBar>
                <Drawer
                    variant="permanent"
                    open={open}
                    sx={{
                        width: open ? drawerWidth : 60,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: open ? drawerWidth : 60,
                            boxSizing: 'border-box',
                            backgroundColor: '#263238',
                            color: '#fff',
                            transition: mdTheme.transitions.create('width', {
                                easing: mdTheme.transitions.easing.sharp,
                                duration: mdTheme.transitions.duration.enteringScreen,
                            }),
                        },
                    }}
                >
                    <Toolbar />
                    <Divider />
                    <List>
                        {menuItems.map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    sx={{
                                        minHeight: 48,
                                        justifyContent: open ? 'initial' : 'center',
                                        px: 2.5,
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            minWidth: 0,
                                            mr: open ? 3 : 'auto',
                                            justifyContent: 'center',
                                            color: '#fff',
                                        }}
                                    >
                                        {item.icon}
                                    </ListItemIcon>
                                    {open && (
                                        <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        backgroundColor: mdTheme.palette.background.default,
                        minHeight: '100vh',
                    }}
                >
                    <Toolbar />
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider>
    );
}
