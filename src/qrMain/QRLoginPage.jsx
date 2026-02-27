import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, IconButton, InputAdornment, } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { collection, query, where, getDocs, } from "firebase/firestore";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import companyLogo from "../data/images/QRMenuPic.png";
import sendOtpimg from "../data/Loginicon.png";
import "./QrHomePage.css";
import LsService from "../services/localstorage";

const QRLoginPage = () => {
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const user = LsService.getItem("user");

    useEffect(() => {
        if (user) {
            // console.log(user);
            if (user.type === "admin") {
                // console.log("admin");
                navigate("/admindashboard");
            } else if (user.type === "waiter") {
                // console.log("waiter");
                navigate("/waiter-dashboard");
                // navigate("/waiter");
            }
        }
    }, [user, navigate]);

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleLogin = async () => {
        try {
            const q = query(collection(db, "admin"), where("login_id", "==", loginId), where("password", "==", password));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setErrorMsg("Invalid credentials.");
            } else {
                const userData = querySnapshot.docs[0].data();
                // Store user data in local storage
                LsService.setItem("user", {
                    login_id: userData.login_id,
                    type: userData.type,
                });
                if (userData.type === "admin") {
                    // console.log("admin");
                    navigate("/admindashboard");
                } else if (userData.type === "waiter") {
                    // console.log("waiter");
                    if (userData.active) {
                        navigate("/waiter-dashboard");
                    } else {
                        alert("Waiter job fired, You can't login, contact admin");
                        // Optionally clear any stored user data
                        LsService.removeItem("user");
                    }
                }
            }
        } catch (error) {
            setErrorMsg("Error logging in. Please try again.");
        }
    };

    return (
        <Box sx={{
            height: "100vh",
        }}>
            <Box component="img"
                alt="Company Logo"
                src={companyLogo}
                sx={{
                    width: "65px",
                    cursor: "pointer",
                    display: { md: "none", xs: "block" },
                    pl: 2, paddingTop: "10px"
                }}
                onClick={() => navigate("/")} />

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", md: "row" },
                    justifyContent: "start",
                    height: { md: "100vh", xs: "calc(100vh - 68px)" },
                }}
            >
                <Box
                    sx={{
                        width: { xs: "100%", md: "50%" },
                        display: { xs: "none", md: "block" },
                    }}
                >
                    {/* left */}
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                        <Box component="img"
                            alt="Company Logo"
                            src={companyLogo}
                            sx={{
                                width: "250px",
                                // ml: 2,
                                cursor: "pointer",
                            }}
                            onClick={() => navigate("/")}
                        />
                    </Box>
                </Box>
                {/* right */}
                <Box
                    sx={{
                        width: { md: "50%" },
                        p: { xs: 2, md: 0 },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: { md: "#577fd8d9" },
                        height: "100%",
                    }}
                >
                    <Box sx={{ width: { md: "50%", } }}>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                            <Box component="img"
                                alt="otp page"
                                src={sendOtpimg}
                                sx={{
                                    width: "130px",
                                    height: "140px",
                                    cursor: "pointer",
                                }}
                            />
                        </Box>
                        <Typography
                            gutterBottom
                            sx={{ fontSize: { xs: "1.5rem", md: "2.5rem" }, fontWeight: "bold", textAlign: "center", color: { md: "white" } }}
                        >
                            Login Now !
                        </Typography>

                        <TextField
                            label="Login ID"
                            variant="outlined"
                            fullWidth
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            sx={{ mb: 2 }}
                            inputProps={{
                                maxLength: 15,
                                style: { textAlign: "center", fontWeight: "bold" },
                                sx: { color: { md: "white" }, }
                            }}
                        />

                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Password"
                            // type="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mb: 2 }}
                            inputProps={{
                                maxLength: 15,
                                style: { textAlign: "center", fontWeight: "bold" },
                                sx: { color: { md: "white" }, },
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end"
                                    >
                                        <IconButton
                                            onClick={handleTogglePasswordVisibility}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        {errorMsg && <Typography color="error" sx={{ mb: 2 }}>{errorMsg}</Typography>}
                        {!errorMsg && <Box p={2.5} />}

                        <Button variant="contained"
                            sx={{ fontWeight: "bold" }}
                            type="submit"
                            color="primary" fullWidth onClick={() => handleLogin()}>
                            Login
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default QRLoginPage;