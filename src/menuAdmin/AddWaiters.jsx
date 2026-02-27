import { Box, Typography, TextField, Button, CircularProgress, IconButton, InputAdornment, Paper } from "@mui/material";
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from "react";
import { collection, query, where, getDocs, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

const AddWaiters = ({fetchWaitersData}) => {
    const [waiterName, setWaiterName] = useState("");
    const [loginId, setLoginId] = useState("");
    const [passwordCreation, setPasswordCreation] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({
        waiterName: "",
        loginId: "",
        password: ""
    });

    const handleTogglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const validateWaiterName = (name) => {
        if (name.length < 4) {
            return "Name must be at least 4 characters long";
        }
        const spaceCount = (name.match(/ /g) || []).length;
        if (spaceCount > 4) {
            return "Name cannot have more than 4 spaces";
        }
        return "";
    };

    const validateLoginId = (id) => {
        if (id.length < 4) {
            return "Login ID must be at least 4 characters long";
        }
        const spaceCount = (id.match(/ /g) || []).length;
        if (spaceCount > 4) {
            return "Login ID cannot have more than 4 spaces";
        }
        return "";
    };

    const validatePassword = (password) => {
        if (password.length < 6) {
            return "Password must be at least 6 characters long";
        }
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        if (!hasLetter || !hasNumber || !hasSpecial) {
            return "Password must contain letters, numbers, and special characters";
        }
        return "";
    };

    const handleWaiterNameChange = (e) => {
        const value = e.target.value;
        setWaiterName(value);
        setErrors(prev => ({...prev, waiterName: validateWaiterName(value)}));
    };

    const handleLoginIdChange = (e) => {
        const value = e.target.value;
        setLoginId(value);
        setErrors(prev => ({...prev, loginId: validateLoginId(value)}));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPasswordCreation(value);
        setErrors(prev => ({...prev, password: validatePassword(value)}));
    };

    const onCreateWaiter = async () => {
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            // Check if a waiter with the same login_id already exists
            const q = query(collection(db, "admin"), where("login_id", "==", loginId));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setErrorMsg("Login ID already exists.");
                setLoading(false);
                return;
            }

            // Add a new waiter document
            const waiterRef = await addDoc(collection(db, "admin"), {
                createdAt: new Date().toISOString().split('T')[0],
                name: waiterName,
                login_id: loginId,
                password: passwordCreation,
                type: "waiter",
                active: true,
            });

            // Update the same document with its UID
            await setDoc(doc(db, "admin", waiterRef.id), { uid: waiterRef.id }, { merge: true });
            fetchWaitersData();
            setSuccessMsg("Waiter added successfully.");
            setWaiterName("");
            setLoginId("");
            setPasswordCreation("");
        } catch (error) {
            console.error("Error creating waiter:", error);
            alert("An error occurred while creating the waiter.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            width: { xs: "95%", md: "25%" },
            display: "flex",
            justifyContent: "center",
            alignItems: { xs: "start", md: "center" },
        }}>
            <Box component={Paper} sx={{
                p:2,
            }}>
                <Typography sx={{
                    textAlign: "center", fontSize: { xs: "2rem", md: "3rem" }, fontWeight: "bold"
                }}>Add Waiter</Typography>

                {/* Form Inputs */}
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Waiter Name"
                    value={waiterName}
                    onChange={handleWaiterNameChange}
                    error={!!errors.waiterName}
                    helperText={errors.waiterName}
                    sx={{ mt: 2 }}
                    inputProps={{
                        style: { textAlign: "center", fontWeight: "bold" },
                    }}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Login ID"
                    value={loginId}
                    onChange={handleLoginIdChange}
                    error={!!errors.loginId}
                    helperText={errors.loginId}
                    sx={{ mt: 2 }}
                    inputProps={{
                        maxLength: 15,
                        style: { textAlign: "center", fontWeight: "bold" },
                    }}
                />
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    value={passwordCreation}
                    onChange={handlePasswordChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    sx={{ mt: 2 }}
                    inputProps={{
                        maxLength: 15,
                        style: { textAlign: "center", fontWeight: "bold" },
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
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

                {/* Error Message */}
                {errorMsg && <Typography color="error" sx={{ textAlign: "center", mt: 1, mb: 1 }}>{errorMsg}</Typography>}
                {!errorMsg && <Box p={2.5} />}

                {/* Submit Button */}
                <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={()=> onCreateWaiter()}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Create Waiter"}
                </Button>

                {/* success Message */}
                {successMsg && <Typography sx={{ textAlign: "center", mt: 1, mb: 1, color: "green" }}>{successMsg}</Typography>}
                {!successMsg && <Box p={2.5} />}
            </Box>
        </Box>
    )
}
export default AddWaiters;