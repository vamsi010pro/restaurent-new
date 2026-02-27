import * as React from 'react';
import { Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button, styled, CircularProgress } from '@mui/material';
import { useEffect } from 'react';
import { addDoc, collection, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from "../services/firebase";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const TAX_RATE = 0.18; // tax 18% change as per ur requirement

export const Cell = styled(TableCell)({
    color: 'white',
    borderBottom: "1px solid #ffffff4f",
});

function ccyFormat(num) {
    return `${num.toFixed(2)}`;
}

function priceRow(qty, unit) {
    return qty * unit;
}

function createRow(itemName, qty, unit) {
    const price = priceRow(qty, unit);
    return { itemName, qty, unit, price };
}

function subtotal(items) {
    return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}


export default function WaiterPriceTable({ addedItems, tableName, tableId, onRemoveItem }) {
    // console.log(tableName);
    const [tablesList, setTablesList] = useState([]);
    const [isOrderDecline, setIsOrderDecline] = useState(false);
    const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);
    const [isOrderCheckOut, setIsOrderCheckOut] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        fetchTablesData();
    }, []);

    const fetchTablesData = async () => {
        try {
            const q = query(collection(db, "table"), where("table_name", "==", tableName));
            const querySnapshot = await getDocs(q);

            const fetchedtables = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
            }));
            // console.log(fetchedtables[0]);

            setTablesList(fetchedtables[0]);
        } catch (error) {
            console.error("Error fetching tables list:", error);
        }
    };

    const rows = [
        ...(tablesList?.order_details || []).map((item) => createRow(item.itemName, item.qty, item.unit)),
        ...addedItems.map((item) => createRow(item.itemName, item.quantity, item.itemPrice))
    ];

    // console.log(rows);

    const invoiceSubtotal = subtotal(rows);
    const invoiceTaxes = TAX_RATE * invoiceSubtotal;
    const invoiceTotal = invoiceTaxes + invoiceSubtotal;

    const billData = [{ invoiceSubtotal: invoiceSubtotal }, { invoiceTaxes: invoiceTaxes }, { invoiceTotal: invoiceTotal }]

    // console.log(billData);

    const onRemoveClick = (rowToRemove) => {
        // console.log(rowToRemove);

        if (addedItems.some(item =>
            item.itemName === rowToRemove.itemName &&
            item.quantity === rowToRemove.qty &&
            item.itemPrice === rowToRemove.unit)) {
            onRemoveItem(rowToRemove);
        }
        // If it's from order_details
        else if (tablesList.order_details) {
            const updatedOrderDetails = tablesList.order_details.filter(item =>
                !(item.itemName === rowToRemove.itemName &&
                    item.qty === rowToRemove.qty &&
                    item.price === rowToRemove.price)
            );
            setTablesList({
                ...tablesList,
                order_details: updatedOrderDetails
            });
        }
    }

    const generateRandomId = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    };

    const onDeclineOrder = async () => {
        try {
            setIsOrderDecline(true);
            const menuRef = doc(db, "table", tableId);
            await updateDoc(menuRef, {
                order_details: [],
                order_confirmed: false,
                bill_details: [],
                order_placed: false,
                waiter_confirm: false,
                OrderId: "",
                order_declined: true,
            });
            navigate("/manage-orders");
        } catch (error) {
            console.error("Error confirming order:", error);
            alert("An error occurred while confirming order.");
        } finally {
            setIsOrderDecline(false);
        }
    }

    const onConfirmOrder = async (rows, billData) => {
        // console.log(billData);
        // console.log(this.props.params);
        const randomId = generateRandomId();

        try {
            setIsOrderConfirmed(true);
            const menuRef = doc(db, "table", tableId);
            await updateDoc(menuRef, {
                order_details: rows,
                bill_details: billData,
                order_confirmed: true,
                OrderId: randomId
            });
            fetchTablesData();
        } catch (error) {
            console.error("Error confirming order:", error);
            alert("An error occurred while confirming order.");
        } finally {
            setIsOrderConfirmed(false);
        }
    }

    const onCheckOut = async (rows, billData) => {
        // console.log(billData);
        setIsOrderCheckOut(true);
        try {
            // First check if this order is already billed
            const billQuery = query(collection(db, "bills"), where("orderId", "==", tablesList.OrderId));
            const billSnapshot = await getDocs(billQuery);

            const menuRef = doc(db, "table", tableId);

            if (!billSnapshot.empty) {
                // Bill already exists, just update order_placed and navigate
                await updateDoc(menuRef, {
                    order_placed: false
                });
                navigate("/manage-orders");
                return;
            }

            // If no existing bill, create new one
            try {
                // Add a new bill document
                const billRef = await addDoc(collection(db, "bills"), {
                    createdAt: new Date().toISOString().split('T')[0],
                    orderId: tablesList.OrderId,
                    order_details: rows,
                    bill_details: billData,
                    tableId: tableId,
                    tableName: tableName
                });

                // Update the bill with its ID
                await setDoc(doc(db, "bills", billRef.id), { bill_id: billRef.id }, { merge: true });

                // Update table status
                await updateDoc(menuRef, {
                    order_placed: false
                });

                navigate("/manage-orders");

            } catch (error) {
                console.error("Error creating bill:", error);
                alert("An error occurred while creating the bill.");
            }

        } catch (error) {
            console.error("Error during checkout:", error);
            alert("An error occurred during checkout.");
        } finally {
            setIsOrderCheckOut(false);
        }
    }

    return (

        <TableContainer component={Paper} sx={{ mt: 1, backgroundColor: "transparent", border: "1px solid #ffffff4f", }}>
            <Table sx={{ minWidth: "272px", }} aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <Cell align="center" colSpan={2}>
                            Details
                        </Cell>
                        <Cell align="right" colSpan={3}>Price</Cell>
                    </TableRow>
                    <TableRow>
                        <Cell >Name</Cell>
                        <Cell align="right">Qty.</Cell>
                        <Cell align="right">Unit</Cell>
                        <Cell align="right">Remove</Cell>
                        <Cell align="right">Sum</Cell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row, index) => (
                        <TableRow key={index}>
                            <Cell >{row.itemName}</Cell>
                            <Cell align="right">{row.qty}</Cell>
                            <Cell align="right">{row.unit}</Cell>
                            <Cell align="right">
                                <Button variant="contained"
                                    color="error"
                                    onClick={() => onRemoveClick(row)}
                                >
                                    <DeleteForeverIcon />
                                </Button>
                            </Cell>
                            <Cell align="right">{ccyFormat(row.price)}</Cell>
                        </TableRow>
                    ))}
                    <TableRow>
                        <Cell rowSpan={3} />
                        <Cell rowSpan={3} />
                        <Cell colSpan={2}>Subtotal</Cell>
                        <Cell align="right">{ccyFormat(invoiceSubtotal)}</Cell>
                    </TableRow>
                    <TableRow>
                        <Cell >Tax</Cell>
                        <Cell align="right">{`${(TAX_RATE * 100).toFixed(0)} %`}</Cell>
                        <Cell align="right">{ccyFormat(invoiceTaxes)}</Cell>
                    </TableRow>
                    <TableRow>
                        <Cell colSpan={2}>Total</Cell>
                        <Cell colSpan={2} align="right">{ccyFormat(invoiceTotal)}</Cell>
                    </TableRow>
                    <TableRow sx={{ background: "gray" }}>
                        <Cell align="left">
                            <Button
                                variant="contained"
                                color="error"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onDeclineOrder();
                                }
                                }
                                disabled={tablesList.order_confirmed}
                            >
                                {isOrderDecline ? <CircularProgress size={24} sx={{ color: "white", fontWeight: "bold" }} /> : "Decline"}
                            </Button>
                        </Cell>
                        <Cell colSpan={3} align="center">
                            <Button
                                variant="contained"
                                color="info"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onConfirmOrder(rows, billData);
                                }
                                }
                                disabled={tablesList.order_confirmed}
                            >
                                {isOrderConfirmed ? <CircularProgress size={24} sx={{ color: "white", fontWeight: "bold" }} /> : "confirm Order"}
                            </Button>
                        </Cell>
                        <Cell align="right">
                            <Button
                                variant="contained"
                                color="success"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onCheckOut(rows, billData);
                                }
                                }
                                disabled={!tablesList.order_confirmed}
                            >
                                {isOrderCheckOut ? <CircularProgress size={24} sx={{ color: "white", fontWeight: "bold" }} /> : "Check out"}
                            </Button>
                        </Cell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}