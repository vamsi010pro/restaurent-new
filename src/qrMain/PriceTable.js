import * as React from 'react';
import { Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Button, styled, CircularProgress } from '@mui/material';

const TAX_RATE = 0.18; // tax 18% change as per ur requirement

const Cell = styled(TableCell)({
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

export default function PriceTable({ addedItems, isOrderNCallWaiterDisabled, onOrderNCallWaiter }) {
    // console.log(addedItems);

    const rows = addedItems.map((item) => createRow(item.itemName, item.quantity, item.itemPrice));
    // console.log(rows);

    const invoiceSubtotal = subtotal(rows);
    const invoiceTaxes = TAX_RATE * invoiceSubtotal;
    const invoiceTotal = invoiceTaxes + invoiceSubtotal;

    const billData = [ { invoiceSubtotal: invoiceSubtotal }, { invoiceTaxes: invoiceTaxes }, { invoiceTotal: invoiceTotal }]

    // console.log(billData);

    return (
        <TableContainer component={Paper} sx={{ mt: 1, backgroundColor: "transparent", border: "1px solid #ffffff4f", }}>
            <Table sx={{ minWidth: "272px", }} aria-label="spanning table">
                <TableHead>
                    <TableRow>
                        <Cell align="center" colSpan={3}>
                            Details
                        </Cell>
                        <Cell align="right">Price</Cell>
                    </TableRow>
                    <TableRow>
                        <Cell >Name</Cell>
                        <Cell align="right">Qty.</Cell>
                        <Cell align="right">Unit</Cell>
                        <Cell align="right">Sum</Cell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.itemName}>
                            <Cell >{row.itemName}</Cell>
                            <Cell align="right">{row.qty}</Cell>
                            <Cell align="right">{row.unit}</Cell>
                            <Cell align="right">{ccyFormat(row.price)}</Cell>
                        </TableRow>
                    ))}
                    <TableRow>
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
                        <Cell align="right">{ccyFormat(invoiceTotal)}</Cell>
                    </TableRow>
                    <TableRow>
                        <Cell colSpan={4} 
                        align={isOrderNCallWaiterDisabled ? "center":"right"}
                        >
                            <Button
                                variant="contained"
                                color="success"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onOrderNCallWaiter(rows, billData);
                                }
                                }
                                disabled={isOrderNCallWaiterDisabled}
                            >
                                {isOrderNCallWaiterDisabled ? <CircularProgress size={24} sx={{ color: "white", fontWeight: "bold" }} /> : "Confirm & Call Waiter"}
                            </Button>
                        </Cell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}