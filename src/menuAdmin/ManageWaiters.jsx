import { Box, TableContainer, Table, TableHead, TableRow, TableCell, Switch, TableBody, Paper } from "@mui/material";
import AdminHeaderComponent from "../components/mainComponents/AdminHeaderComponent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LsService from "../services/localstorage";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import AddWaiters from "./AddWaiters";

const headCellStyle = {
    color: "white",
    fontWeight: 'bold',
}

const ManageWaiters = () => {
    const [waitersList, setWaitersList] = useState([]);
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
    }, []);

    const fetchWaitersData = async () => {
        try {
            const waitersCollection = collection(db, "admin");
            const q = query(waitersCollection, where("type", "==", "waiter"), 
        );
            const querySnapshot = await getDocs(q);

            const fetchedwaiters = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setWaitersList(fetchedwaiters);
        } catch (error) {
            console.error("Error fetching waiters list:", error);
        }
    };

    const toggleUsageStatus = async (id, currentStatus) => {
        try {
            const waiterRef = doc(db, "admin", id);
            await updateDoc(waiterRef, { active: !currentStatus });
            fetchWaitersData(); // Refresh data after update
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
                flexDirection: "column",
                alignItems: "center",
                justifyContent: {md:"center", xs:"start"},
                color: "white",
                py:2,
            }}
            >
                <AddWaiters fetchWaitersData={fetchWaitersData}/>
                <Box p={1} />
                <TableContainer component={Paper} sx={{ maxWidth: { xs: "100%", md: "60%" } }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#3e8596" }}>
                            <TableRow>
                                <TableCell sx={headCellStyle}>Created At</TableCell>
                                <TableCell sx={headCellStyle}>Waiter Name</TableCell>
                                <TableCell sx={headCellStyle}>Login ID</TableCell>
                                <TableCell sx={headCellStyle}>Password</TableCell>
                                <TableCell sx={headCellStyle}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {waitersList.map((waiter, index) => (
                                <TableRow
                                    key={waiter.id}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "white" : "lightgrey",
                                        "&:hover td": {
                                            color: "green",
                                        },
                                    }}
                                >
                                    <TableCell>{waiter.createdAt}</TableCell>
                                    <TableCell>{waiter.name}</TableCell>
                                    <TableCell>{waiter.login_id}</TableCell>
                                    <TableCell>{waiter.password}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={waiter.active}
                                            onChange={() => toggleUsageStatus(waiter.id, waiter.active)}
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
export default ManageWaiters;