import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Drawer, Divider } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useMediaQuery } from '@mui/material';
import companyLogo from "../../data/images/QRMenuPic.png";
import LogoutButtonComp from '../LogoutButtonComp';
import LsService from "../../services/localstorage";

const WaiterHeaderComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

    const user = LsService.getItem("user");

    useEffect(() => {
        if (user.type !== "waiter") {
            // console.log("not loggedin");
            LsService.removeItem("user");
            navigate("/");
        }
    }, []);

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    // Function to check if the current path matches the given route
    const isActiveRoute = (route) => location.pathname === route;

    const navItems = [
        { label: "Waiter Dashboard", route: "/waiter-dashboard" },
        { label: "Manage Orders", route: "/manage-orders" },
        { label: "View Bills", route: "/waiter-view-bills" },
        { isComponent: true, component: <LogoutButtonComp /> },
    ];

    return (
        <Box sx={{
            width: "100%",
            height: "10vh",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "fixed",
            zIndex: "10",
            background: "white"
        }}>
            <Box component="img"
                alt="Company Logo"
                src={companyLogo}
                sx={{
                    width: "70px",
                    ml: 3,
                    cursor: "pointer",
                }}
                onClick={() => navigate("/")}
            />

            {isMobile ? (
                <>
                    <IconButton onClick={toggleDrawer(true)} sx={{ mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                        <Box
                            role="presentation"
                            onClick={toggleDrawer(false)}
                            onKeyDown={toggleDrawer(false)}
                            sx={{ width: "250px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", mt: 2 }}
                        >
                            <IconButton onClick={toggleDrawer(false)} sx={{ alignSelf: "flex-start", ml: 2 }}>
                                <ArrowForwardIosIcon color="info" />
                            </IconButton>
                            <Box width="100%"><Divider /></Box>
                            {navItems.map((item, index) =>
                                item.isComponent ? (
                                    <Box key={index} sx={{ display: "flex", alignItems: "center", }}>
                                        {item.component}
                                    </Box>
                                ) : (
                                    <Typography
                                        key={item.route}
                                        sx={{
                                            fontWeight: 'bold',
                                            cursor: "pointer",
                                            color: isActiveRoute(item.route) ? "gray" : "black",
                                            "&:hover": {
                                                color: "gray"
                                            }
                                        }}
                                        onClick={() => navigate(item.route)}
                                    >
                                        {item.label}
                                    </Typography>
                                )
                            )}
                        </Box>
                    </Drawer>
                </>
            ) : (
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    mr: 10,
                    gap: "20px"
                }}>
                    {navItems.map((item, index) =>
                        item.isComponent ? (
                            <Box key={index} sx={{ display: "flex", alignItems: "center", }}>
                                {item.component}
                            </Box>
                        ) : (
                            <Typography
                                key={item.route}
                                sx={{
                                    fontWeight: 'bold',
                                    cursor: "pointer",
                                    color: isActiveRoute(item.route) ? "gray" : "black",
                                    "&:hover": {
                                        color: "gray"
                                    }
                                }}
                                onClick={() => navigate(item.route)}
                            >
                                {item.label}
                            </Typography>
                        )
                    )}
                </Box>
            )}
        </Box>
    );
};

export default WaiterHeaderComponent;
