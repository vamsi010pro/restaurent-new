import { Box, TableContainer, Table, TableHead, TableRow, TableCell, Switch, TableBody, Paper, Typography } from "@mui/material";
import AdminHeaderComponent from "../components/mainComponents/AdminHeaderComponent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LsService from "../services/localstorage";
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

const headCellStyle = {
    color: "white",
    fontWeight: 'bold',
}

const ManageMenu = () => {
    const [menuList, setMenuList] = useState([]);
    const navigate = useNavigate();

    const user = LsService.getItem("user");

    useEffect(() => {
        // console.log(user);

        if (user.type !== "admin") {
            // console.log("not loggedin");
            LsService.removeItem("user");
            navigate("/");
        }
        fetchMenuData();
    }, []);

    const fetchMenuData = async () => {
        try {
            const menuCollection = collection(db, "menu");
            const q = query(menuCollection, orderBy("createdAt", "desc") 
        );
            const querySnapshot = await getDocs(q);

            const fetchedmenu = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // console.log(fetchedmenu);
            
            setMenuList(fetchedmenu);
        } catch (error) {
            console.error("Error fetching menu list:", error);
        }
    };

    const toggleUsageStatus = async (id, currentStatus) => {
        try {
            const menuRef = doc(db, "menu", id);
            await updateDoc(menuRef, { active: !currentStatus });
            fetchMenuData(); // Refresh data after update
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <Box sx={{
            background: "black",
            minHeight: "100vh",
        }}>
            <AdminHeaderComponent />
            <Box sx={{ height: "10vh" }} ></Box>
            <Box sx={{
                width: { xs: "100vw", md: "98.93vw" },
                display: "flex",
                alignItems: "start",
                justifyContent: "center",
                color: "white",
                py:2,
            }}
            >
                <TableContainer component={Paper} sx={{ maxWidth: { xs: "100%", md: "60%" } }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#3e8596" }}>
                            <TableRow>
                                <TableCell sx={headCellStyle}>Created At</TableCell>
                                <TableCell sx={headCellStyle}>Category</TableCell>
                                <TableCell sx={headCellStyle}>Item Name</TableCell>
                                <TableCell sx={headCellStyle}>Price</TableCell>
                                <TableCell sx={headCellStyle}>isVeg</TableCell>
                                <TableCell sx={headCellStyle}>Image</TableCell>
                                <TableCell sx={headCellStyle}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {menuList.map((menu, index) => (
                                <TableRow
                                    key={menu.id}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "white" : "lightgrey",
                                        "&:hover td": {
                                            color: "green",
                                        },
                                    }}
                                >
                                    <TableCell>{menu.createdAt}</TableCell>
                                    <TableCell>{menu.categoryType}</TableCell>
                                    <TableCell>{menu.itemName}</TableCell>
                                    <TableCell>{menu.itemPrice}</TableCell>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                color: menu.isVeg ? 'green' : 'red',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {menu.isVeg ? 'Veg' : 'Non-Veg'}
                                        </Typography>
                                    </TableCell>
                                    {/* <TableCell>{menu.itemUrl}</TableCell> */}
                                    <TableCell>
                                        {menu.itemUrl ? (
                                            <Box
                                                component="img"
                                                src={menu.itemUrl}
                                                alt={menu.itemName}
                                                sx={{
                                                    width: '3rem',
                                                    height: '3rem',
                                                    objectFit: 'cover',
                                                    borderRadius: '4px'
                                                }}
                                            />
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                No image
                                            </Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={menu.active}
                                            onChange={() => toggleUsageStatus(menu.id, menu.active)}
                                            color="primary"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    )
}
export default ManageMenu;