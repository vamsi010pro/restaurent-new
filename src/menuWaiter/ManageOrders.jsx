import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, Button, Typography, CircularProgress } from "@mui/material";
import WaiterHeaderComponent from "../components/mainComponents/WaiterHeaderComponent";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

const headCellStyle = {
    color: "white",
    fontWeight: 'bold',
}

const ManageOrders = () => {
    const [tablesList, setTablesList] = useState([]);
    const [isVerify, setIsVerify] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTablesData();
    }, []);

    const fetchTablesData = async () => {
        try {
            const tablesCollection = collection(db, "table");
            const q = query(tablesCollection);
            const querySnapshot = await getDocs(q);

            const fetchedtables = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
            }));

            setTablesList(fetchedtables);
        } catch (error) {
            console.error("Error fetching tables list:", error);
        }
    };

    const onVerifyClick = async (tableId) => {
        try {
            setIsVerify(true);
            const tableRef = doc(db, "table", tableId);
            await updateDoc(tableRef, {
                waiter_confirm: true,
                OrderId:""
            });
            fetchTablesData();
            navigate(`/view-update-order/${tableId}`)
        } catch (error) {
            console.error("Error confirming waiter status:", error);
            alert("An error occurred while confirming.");
        } finally {
            setIsVerify(false);
        }
    }

    return (
        <Box sx={{
            background: "black",
            minHeight: "100vh",
        }}>
            <WaiterHeaderComponent />
            <Box sx={{ height: "10vh" }} ></Box>
            <Box sx={{
                width: { xs: "100vw", md: "98.93vw" },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: { md: "center", xs: "start" },
                color: "white",
                py: 2,
            }}
            >
                <TableContainer component={Paper} sx={{ maxWidth: { xs: "100%", md: "60%" } }}>
                    <Table>
                        <TableHead sx={{ backgroundColor: "#3e8596" }}>
                            <TableRow>
                                <TableCell sx={headCellStyle}>Table Name</TableCell>
                                <TableCell sx={headCellStyle}>Order Placed</TableCell>
                                <TableCell sx={headCellStyle}>Waiter Confirmed</TableCell>
                                <TableCell sx={headCellStyle}>Order Confirmed</TableCell>
                                <TableCell sx={headCellStyle}>Verify Orders</TableCell>
                                <TableCell sx={headCellStyle}>Place New-Order</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tablesList.map((table, index) => (
                                <TableRow
                                    key={index}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "white" : "lightgrey",
                                        "&:hover td": {
                                            color: "green",
                                        },
                                    }}
                                >
                                    <TableCell>{table.table_name}</TableCell>
                                    <TableCell>
                                        <Typography
                                            component="span"
                                            sx={{
                                                color: table.order_placed ? "success.main" : "error.main",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {table.order_placed ? "Yes" : "No"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            component="span"
                                            sx={{
                                                color: table.waiter_confirm ? "success.main" : "error.main",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {table.order_placed ? (table.waiter_confirm ? "Confirmed" : "Pending") : "- -"}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography
                                            component="span"
                                            sx={{
                                                color: table.order_confirmed ? "success.main" : "error.main",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {table.order_placed ? (table.order_confirmed ? "Confirmed" : "Pending") : "- -"}
                                        </Typography>
                                    </TableCell>

                                    <TableCell>
                                        {
                                            table.order_placed ?
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    disabled={isVerify}
                                                    onClick={() => onVerifyClick(table.table_id)}
                                                >{isVerify ? <CircularProgress size={24} sx={{ color: "white", fontWeight: "bold" }} /> : "Verify Order"}</Button>
                                                : "- -"
                                        }
                                    </TableCell>

                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="success"
                                            onClick={() => window.open(`https://anjaliravi2304.github.io/QR-Restaurant-Menu/#/customermenu/${table.table_id}`)}
                                            // onClick={() => window.open(`http://localhost:3000/customermenu/${table.table_id}`)}
                                            disabled={table.order_placed ? true : false}
                                        >Place Order</Button>
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
export default ManageOrders;