import { Box, Card, Typography } from "@mui/material";
import AdminHeaderComponent from "../components/mainComponents/AdminHeaderComponent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LsService from "../services/localstorage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import waiterIcon from "../data/images/waiterIcon.png";
import tableIcon from "../data/images/tableIcon.png";
import menuIcon from "../data/images/menuIcon.png";
import billIcon from "../data/images/billIcon.png";
import { fontStyleB } from "../data/contents/QRStyles";

const AdminDashboard = () => {
    const [waitersCount, setWaitersCount] = useState(0);
    const [tablesCount, setTablesCount] = useState(0);
    const [menuCount, setMenuCount] = useState(0);
    const [billsCount, setBillsCount] = useState(0);
    const navigate = useNavigate();

    const user = LsService.getItem("user");

    useEffect(() => {
        // console.log(user);

        if (user.type !== "admin") {
            // console.log("not loggedin");
            LsService.removeItem("user");
            navigate("/");
        }
        fetchWaitersData();
        fetchTablesData();
        fetchMenuData();
        fetchBillsData();
    }, []);

    const fetchWaitersData = async () => {
        try {
            const waitersCollection = collection(db, "admin");
            const w = query(waitersCollection, where("type", "==", "waiter"),
            );
            const querySnapshot = await getDocs(w);
            // console.log(querySnapshot.size);
            setWaitersCount(querySnapshot.size);
        } catch (error) {
            console.error("Error fetching waiters length:", error);
        }
    };

    const fetchTablesData = async () => {
        try {
            const tablesCollection = collection(db, "table");
            const t = query(tablesCollection);
            const querySnapshot = await getDocs(t);
            // console.log(querySnapshot.size); 
            setTablesCount(querySnapshot.size);
        } catch (error) {
            console.error("Error fetching tables length:", error);
        }
    };

    const fetchMenuData = async () => {
        try {
            const menuCollection = collection(db, "menu");
            const m = query(menuCollection);
            const querySnapshot = await getDocs(m);
            // console.log(querySnapshot.size); 
            setMenuCount(querySnapshot.size);
        } catch (error) {
            console.error("Error fetching menu length:", error);
        }
    };

    const fetchBillsData = async () => {
        try {
            const billsCollection = collection(db, "bills");
            const b = query(billsCollection);
            const querySnapshot = await getDocs(b);
            // console.log(querySnapshot.size); 
            setBillsCount(querySnapshot.size);
        } catch (error) {
            console.error("Error fetching bills length:", error);
        }
    };

    return (
        <Box sx={{
            width: "100vw",
            minHeight: "100vh",
            background: "black",
            color: "white"
        }}>
            <AdminHeaderComponent />
            <Box sx={{ height: "10vh" }} ></Box>
            <Box p={1} />
            {/*  body starts here  */}
            <Box sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: 'center',
                alignItems: "center",
                gap: "1rem"
            }}>
                <Card sx={{ p: 3.5, cursor: "pointer" }} onClick={() => navigate("/manage-waiter")}>
                    <Typography sx={{ ...fontStyleB }}>
                        Total Waiters
                    </Typography>
                    <Box sx={{ display: "flex", gap: "2rem", mx: "1rem" }}>
                        <Box component="img"
                            alt="icon"
                            src={waiterIcon}
                            sx={{
                                width: "80px",
                                ml: 3,
                            }}
                        />
                        <Typography sx={{ fontWeight: "bold", fontSize: "3rem" }}>{waitersCount}</Typography>
                    </Box>
                </Card>
                <Card sx={{ p: 3.5, cursor: "pointer" }} onClick={() => navigate("/manage-table")}>
                    <Typography sx={{ ...fontStyleB }}>
                        Total Tables
                    </Typography>
                    <Box sx={{ display: "flex", gap: "2rem", mx: "1rem" }}>
                        <Box component="img"
                            alt="icon"
                            src={tableIcon}
                            sx={{
                                width: "80px",
                                ml: 3,
                            }}
                        />
                        <Typography sx={{ fontWeight: "bold", fontSize: "3rem" }}>{tablesCount}</Typography>
                    </Box>
                </Card>
                <Card sx={{ p: 3, cursor: "pointer" }} onClick={() => navigate("/manage-menu")}>
                    <Typography sx={{ ...fontStyleB }}>
                        Total Menu Items
                    </Typography>
                    <Box sx={{ display: "flex", gap: "2rem", mx: "1rem" }}>
                        <Box component="img"
                            alt="icon"
                            src={menuIcon}
                            sx={{
                                width: "70px",
                                ml: 3,
                            }}
                        />
                        <Typography sx={{ fontWeight: "bold", fontSize: "3rem" }}>{menuCount}</Typography>
                    </Box>
                </Card>
                <Card sx={{ p: 3.5, cursor: "pointer" }} onClick={() => navigate("/track-bills")}>
                    <Typography sx={{ ...fontStyleB }}>
                        Total Bills
                    </Typography>
                    <Box sx={{ display: "flex", gap: "2rem", mx: "1rem" }}>
                        <Box component="img"
                            alt="icon"
                            src={billIcon}
                            sx={{
                                width: "80px",
                                ml: 3,
                            }}
                        />
                        <Typography sx={{ fontWeight: "bold", fontSize: "3rem" }}>{billsCount}</Typography>
                    </Box>
                </Card>
            </Box>
        </Box>
    )
}
export default AdminDashboard;