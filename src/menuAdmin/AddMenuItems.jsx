import { Box, Typography, TextField, Button, CircularProgress, IconButton, InputAdornment, Paper, FormControl, MenuItem, InputLabel, Select } from "@mui/material";
import { useCallback, useState } from "react";
import { collection, query, where, getDocs, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useDropzone } from "react-dropzone";
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AdminHeaderComponent from "../components/mainComponents/AdminHeaderComponent";

const AddMenuItems = () => {
    const [categoryType, setCategoryType] = useState("");
    const [itemName, setItemName] = useState("");
    const [isVeg, setIsVeg] = useState(true);
    const [itemPrice, setItemPrice] = useState(1);
    const [errors, setErrors] = useState({
        categoryType: "",
        itemName: "",
        itemPrice: ""
    });

    const [newItemUrlImage, setNewItemUrlImage] = useState(null);

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const storage = getStorage();

    const onDropItemUrlImage = useCallback((acceptedFiles) => {
        setNewItemUrlImage(acceptedFiles[0]);
    }, []);

    const {
        getRootProps: getRootPropsItemUrl,
        getInputProps: getInputPropsItemUrl,
    } = useDropzone({
        onDrop: onDropItemUrlImage,
        accept: "image/*",
    });

    const uploadImage = async (file, path) => {
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    };

    const validateCategoryType = (value) => {
        if (!value || value.trim() === "") {
            return "Category name cannot be empty";
        }
        return "";
    };

    const validateItemName = (value) => {
        if (!value || value.trim() === "") {
            return "Item name cannot be empty";
        }
        return "";
    };

    const validateItemPrice = (value) => {
        if (value === 0) {
            return "Price cannot be zero";
        }
        return "";
    };

    const handleCategoryTypeChange = (e) => {
        const value = e.target.value;
        setCategoryType(value);
        setErrors(prev => ({...prev, categoryType: validateCategoryType(value)}));
    };

    const handleItemNameChange = (e) => {
        const value = e.target.value;
        setItemName(value);
        setErrors(prev => ({...prev, itemName: validateItemName(value)}));
    };

    const handleItemPriceChange = (e) => {
        const value = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10) || 0;
        setItemPrice(value);
        setErrors(prev => ({...prev, itemPrice: validateItemPrice(value)}));
    };

    const onAddItems = async () => {
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            const itemQuery = query(collection(db, "menu"), where("itemName", "==", itemName));
            const querySnapshot = await getDocs(itemQuery);

            if (!querySnapshot.empty) {
                setErrorMsg("Item Name already exists.");
                setLoading(false);
                return;
            }

            // Handle image upload if image is selected
            let itemImageUrl = "";

            // Upload image if provided
            if (newItemUrlImage) {
                // itemImageUrl = await uploadImage(newItemUrlImage, `itemImage/${Date.now()}`);
                itemImageUrl = await uploadImage(newItemUrlImage, `itemImage/${itemName}`);
            }

            // Add a new food item document
            const menuItem = {
                createdAt: new Date().toISOString().split('T')[0],
                categoryType,
                itemName,
                isVeg,
                itemPrice,
                itemUrl: itemImageUrl,
                active: true,
            };

            await addDoc(collection(db, "menu"), menuItem);

            // Reset form
            setCategoryType("");
            setItemName("");
            setItemPrice(1);
            setIsVeg(true);
            setNewItemUrlImage(null);

            setSuccessMsg("Item added successfully.");

        } catch (error) {
            console.error("Error creating Item:", error);
            alert("An error occurred while creating the Item.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            minHeight: "100vh",
            background: "black",
        }}>
            <AdminHeaderComponent />
            <Box sx={{ height: "10vh" }} ></Box>
            <Box sx={{
                width: { xs: "100vw", md: "98.93vw" },
                display: "flex",
                justifyContent: "center",
                alignItems: { xs: "start", md: "center" },
                py: 2
            }}>
                <Box component={Paper} sx={{
                    width: { xs: "95%", md: "25%" },
                    p: 2,
                }}>
                    <Typography sx={{
                        textAlign: "center", fontSize: { xs: "2rem", md: "2rem" }, fontWeight: "bold"
                    }}>Add Menu Items</Typography>

                    {/* Form Inputs */}
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Category Name"
                        value={categoryType}
                        onChange={handleCategoryTypeChange}
                        error={!!errors.categoryType}
                        helperText={errors.categoryType}
                        sx={{ mt: 2 }}
                        inputProps={{
                            style: { textAlign: "center", fontWeight: "bold" },
                        }}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Item Name"
                        value={itemName}
                        onChange={handleItemNameChange}
                        error={!!errors.itemName}
                        helperText={errors.itemName}
                        sx={{ mt: 2 }}
                        inputProps={{
                            maxLength: 20,
                            style: { textAlign: "center", fontWeight: "bold" },
                        }}
                    />
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Veg or Non-Veg</InputLabel>
                        <Select
                            value={isVeg}
                            label="Veg or Non-Veg"
                            onChange={(e) => setIsVeg(e.target.value)}
                            sx={{
                                textAlign: "center",
                                fontWeight: "bold"
                            }}
                        >
                            <MenuItem value={true}>Veg</MenuItem>
                            <MenuItem value={false}>Non-Veg</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        label="Price"
                        variant="outlined"
                        sx={{ mt: 2 }}
                        value={itemPrice}
                        onChange={handleItemPriceChange}
                        error={!!errors.itemPrice}
                        helperText={errors.itemPrice}
                        inputProps={{
                            maxLength: 4,
                            inputMode: "numeric",
                            style: { textAlign: "center", fontWeight: "bold" },
                        }}
                    />

                    {/* Image Upload Field */}
                    <Typography sx={{ fontWeight: "bold", display: "flex", alignItems: "center", gap: 1, my: 1 }}>
                        <UploadFileIcon sx={{ color: "#1976d2", ml: "10px" }} /> Upload Item Image
                    </Typography>
                    <Box
                        {...getRootPropsItemUrl()}
                        sx={{
                            border: "2px dashed #d3d3d3",
                            padding: "20px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100px",
                            cursor: "pointer",
                        }}
                    >
                        <input {...getInputPropsItemUrl()} />
                        {newItemUrlImage ? (
                            <img
                                src={URL.createObjectURL(newItemUrlImage)}
                                alt="Item Image Preview"
                                style={{
                                    width: "50%",
                                    maxHeight: "120px",
                                    objectFit: "cover",
                                }}
                            />
                        ) : (
                            <Box>
                                <Typography sx={{ display: { xs: "flex", md: "none" } }}>Click & Browse to Upload</Typography>
                                <Typography sx={{ display: { md: "flex", xs: "none" } }}>Click & Browse Or Drag & Drop to Upload</Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Error Message */}
                    {errorMsg && <Typography color="error" sx={{ textAlign: "center", mt: 1, mb: 1 }}>{errorMsg}</Typography>}
                    {!errorMsg && <Box p={2.5} />}

                    {/* Submit Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        onClick={(e) => {
                            e.preventDefault();
                            onAddItems();
                        }
                        }
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Add Item"}
                    </Button>

                    {/* success Message */}
                    {successMsg && <Typography sx={{ textAlign: "center", mt: 1, mb: 1, color: "green" }}>{successMsg}</Typography>}
                    {!successMsg && <Box p={2.5} />}
                </Box>
            </Box>
        </Box>
    )
}
export default AddMenuItems;