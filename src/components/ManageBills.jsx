import { Box, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper} from "@mui/material";
import { useEffect, useState } from "react";
import { collection, query,getDocs,orderBy } from "firebase/firestore";
import { db } from "../services/firebase";
import { Cell } from "../menuWaiter/WaiterPriceTable";

const headCellStyle = {
    color: "white",
    fontWeight: 'bold',
}

const ManageBills = () => {
    const [billsList, setBillsList] = useState([]);
    const [billData, setBillData] = useState({});
    const [isBill, setIsBill] = useState(false);

    // const navigate = useNavigate();

   useEffect(() => {
  fetchTablesData();
}, [fetchTablesData]);

    const fetchBillsData = async () => {
        try {
            const billsCollection = collection(db, "bills");
            const q = query(billsCollection, orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);

            const fetchedbills = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
            }));

            setBillsList(fetchedbills);
        } catch (error) {
            console.error("Error fetching bills list:", error);
        }
    };

    const onViewBillClick = (bill) => {
        // console.log(bill.type);
        // console.log(bill);
        setBillData(bill);
        setIsBill(!isBill);
    }

    const onCloseClick = () => {
        setIsBill(!isBill);
    }

    return (
        <Box sx={{
            width: { xs: "100vw", md: "98.93vw" },
            display: "flex",
            justifyContent: "center",
            color: "white",
            py: 2,
        }}
        >
            {
                !isBill ?
                    <TableContainer component={Paper} sx={{ maxWidth: { xs: "98%", md: "60%" } }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: "#3e8596" }}>
                                <TableRow>
                                    <TableCell sx={headCellStyle}>Created At</TableCell>
                                    <TableCell sx={headCellStyle}>Table Name</TableCell>
                                    <TableCell sx={headCellStyle}>Total Amount</TableCell>
                                    <TableCell sx={headCellStyle}>View Bill</TableCell>
                                </TableRow>

                            </TableHead>
                            <TableBody>
                                {billsList.map((bill, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? "white" : "lightgrey",
                                            "&:hover td": {
                                                color: "green",
                                            },
                                        }}
                                    >
                                        <TableCell>{bill.createdAt}</TableCell>
                                        <TableCell>{bill.tableName}</TableCell>
                                        <TableCell>{bill.bill_details[2].invoiceTotal}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => onViewBillClick(bill)}
                                            > View Bill
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    :
                    <TableContainer component={Paper} sx={{ mt: 1, backgroundColor: "transparent", border: "1px solid #ffffff4f", maxWidth: { xs: "98%", md: "60%" } }}>
                        <Table sx={{ minWidth: "272px", }} aria-label="spanning table">
                            <TableHead>
                                <TableRow>
                                    <Cell align="left" colSpan={2}>Date : {billData.createdAt}</Cell>
                                    <Cell align="right" colSpan={2} sx={{ color: "red", cursor: "pointer" }} onClick={() => onCloseClick()}>Close</Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell align="left" colSpan={2}>Table Served : {billData.tableName}</Cell>
                                    <Cell align="right" colSpan={2}>Order ID : {billData.orderId}</Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell >Item Name</Cell>
                                    <Cell align="right">Price</Cell>
                                    <Cell align="right">Qty.</Cell>
                                    <Cell align="right">Amount</Cell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {billData.order_details.map((row, index) => (
                                    <TableRow key={index}>
                                        <Cell >{row.itemName}</Cell>
                                        <Cell align="right">₹{row.unit}</Cell>
                                        <Cell align="right">{row.qty}</Cell>
                                        <Cell align="right">₹{row.price}</Cell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <Cell rowSpan={3} colSpan={2}/>
                                    <Cell >Subtotal</Cell>
                                    <Cell align="right">₹{billData.bill_details[0].invoiceSubtotal}</Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell >Tax (18 %)</Cell>
                                    <Cell align="right">₹{billData.bill_details[1].invoiceTaxes}</Cell>
                                </TableRow>
                                <TableRow>
                                    <Cell  >Bill Total</Cell>
                                    <Cell align="right">₹{billData.bill_details[2].invoiceTotal}</Cell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
            }
        </Box>
    )
}
export default ManageBills;