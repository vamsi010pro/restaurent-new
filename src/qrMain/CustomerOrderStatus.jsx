import { Box, TableContainer, Table, TableHead, TableRow, TableCell, Switch, TableBody, Paper, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from "firebase/firestore";
import { db } from "../services/firebase";

const headCellStyle = {
    color: "white",
    fontWeight: 'bold',
}

const CustomerOrderStatus = ({ id }) => {
    const [tablesList, setTablesList] = useState({
        order_details: [],
        bill_details: []
    });
    const [timer, setTimer] = useState(30); // 30 sec
    const [isButtonDisplay, setButtonDisplay] = useState(true);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        fetchTablesData();
    }, []);

    useEffect(() => {
        let interval;
        if (timer > 0 && isActive) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0 && isActive) {
            setIsActive(true);
        }
        return () => clearInterval(interval);
    }, [timer, isActive]);

    const checkStatus = () => {
        setButtonDisplay(false);
        setIsActive(true);
        setTimer(30);
        fetchTablesData();
        setTimeout(() => {
            setButtonDisplay(true);
        }, 30000); // 30 sec
    }

    const fetchTablesData = async () => {
        try {
            const tablesCollection = collection(db, "table");
            const q = query(tablesCollection, where("table_id", "==", id));
            const querySnapshot = await getDocs(q);

            const fetchedtable = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            // console.log(fetchedtable[0]);

            setTablesList(fetchedtable[0]);
            if (!fetchedtable[0].order_placed) {
                window.location.reload();
            }
            if (fetchedtable[0].order_declined) {
                alert("Order is Declined");
            }
        } catch (error) {
            console.error("Error fetching tables list:", error);
        }
    };

    return (
        <Box sx={{
            background: "black",
            minHeight: "calc(100vh - 59px)",
            width: { xs: "100vw", md: "98.93vw" },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "start",
            gap: "1rem",
            color: "white",
        }}
        >
            <TableContainer component={Paper} sx={{ maxWidth: { xs: "96%", md: "60%" }, p:2 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#3e8596" }}>
                        <TableRow>
                            <TableCell sx={headCellStyle}>Item Name</TableCell>
                            <TableCell sx={{ ...headCellStyle, textAlign: "right" }}>Price</TableCell>
                            <TableCell sx={{ ...headCellStyle, textAlign: "right" }}>Quantity</TableCell>
                            <TableCell sx={{ ...headCellStyle, textAlign: "right" }}>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tablesList?.order_details?.map((item, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    backgroundColor: index % 2 === 0 ? "white" : "lightgrey",
                                    "&:hover td": {
                                        color: "green",
                                    },
                                }}
                            >
                                <TableCell>{item.itemName}</TableCell>
                                <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>₹{item.unit}</TableCell>
                                <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>{item.qty}</TableCell>
                                <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>₹{item.price}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer component={Paper} sx={{ maxWidth: { xs: "100%", md: "60%" } }}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#3e8596" }}>
                        <TableRow>
                            <TableCell sx={{ ...headCellStyle, textAlign: "right" }}>Amount</TableCell>
                            <TableCell sx={{ ...headCellStyle, textAlign: "right" }}>Tax</TableCell>
                            <TableCell sx={{ ...headCellStyle, textAlign: "right" }}>Total Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tablesList?.bill_details?.length > 0 && (
                            <TableRow
                                sx={{
                                    "&:hover td": {
                                        color: "green",
                                        fontWeight: "bold"
                                    },
                                }}
                            >
                                <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>₹{tablesList.bill_details[0]?.invoiceSubtotal || 0}</TableCell>
                                <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>₹{tablesList.bill_details[1]?.invoiceTaxes || 0}</TableCell>
                                <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>₹{tablesList.bill_details[2]?.invoiceTotal || 0}</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box>
                <Typography>Did Waiter Saw the order ?  {' '}
                    <Typography
                        component="span"
                        sx={{
                            color: tablesList.waiter_confirm ? "success.main" : "error.main",
                            fontWeight: "bold"
                        }}
                    >
                        {tablesList.waiter_confirm ? "Yes" : "No, Pending"}
                    </Typography>
                </Typography>
                {
                    tablesList.waiter_confirm &&
                    <Typography>Order Confirmation: {' '}
                        <Typography
                            component="span"
                            sx={{
                                color: tablesList.order_confirmed ? "success.main" : "error.main",
                                fontWeight: "bold"
                            }}
                        >
                            {tablesList.order_confirmed ? "Confirmed" : "Pending"}
                        </Typography>
                    </Typography>
                }

                {
                    tablesList.order_confirmed &&
                    <Typography>Food is being Prepared & Served...!
                    </Typography>
                }
            </Box>
            {
                isButtonDisplay ?
                    <Button sx={{ minWidth: "110px", height: "60%", marginRight: "4%", border: "2px solid", fontWeight: "bold" }}
                        variant="contained"
                        color="info"
                        onClick={() => checkStatus()}
                    >Check Status</Button>
                    :
                    <Typography sx={{ minWidth: "110px", marginRight: "4%", color: "yellow", textAlign: "center", fontWeight: "bold" }}>Check Again in {timer}s</Typography>
            }
        </Box>
    )
}
export default CustomerOrderStatus;