import React from "react";
import withRouter from "../components/withRouter";
import BaseComponent from "../components/BaseComponent";
import CustomerMenuHeader from "./CustomerMenuHeader";
import CustomizedAccordions from "./CustomizedAccordions";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import CustomerOrderStatus from "./CustomerOrderStatus";
import FooterComponent from "./FooterComponent";
import { Typography } from "@mui/material";

class CustomerMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOrderNCallWaiterDisabled: false,
        };
    }

    onOrderNCallWaiter = async (rows, orderData) => {
        // console.log(orderData);
        // console.log(this.props.params);

        this.setState({ isOrderNCallWaiterDisabled: true });

        try {
            const menuRef = doc(db, "table", this.props.params.id);
            await updateDoc(menuRef, {
                order_details: rows,
                bill_details: orderData,
                order_placed: true,
                order_confirmed: false,
                order_declined: false,
            });

        } catch (error) {
            console.error("Error creating table:", error);
            this.setState({ isOrderNCallWaiterDisabled: false });
            alert("An error occurred while creating the table.");
        }
    }

    renderTable = (data) => {
        // console.log(data.table_id);
        // console.log(data.table_name);
        // console.log(data.order_placed);

        return (
            <main className="customer-menu-page" ref={this.mainRef} style={{background:"black", minHeight:"100vh"}}>
                {/* {data.table_name} */}
                {
                    data.active ?
                        <>
                            <CustomerMenuHeader tableName={data.table_name} />
                            {
                                (this.state.isOrderNCallWaiterDisabled || data.order_placed) ?
                                    <CustomerOrderStatus id={data.table_id} /> :
                                    <CustomizedAccordions isOrderNCallWaiterDisabled={this.state.isOrderNCallWaiterDisabled} onOrderNCallWaiter={this.onOrderNCallWaiter} />
                            }
                        </>
                        :
                        <Typography sx={{color:"red", textAlign:"center", pt:"2rem", fontWeight:"bold", fontSize:"1.5rem"}}>The table you are looking for is not in use</Typography>
                }

                {/* <FooterComponent /> */}
            </main >

        );
    }

    render() {
        // console.log(this.props.params.id);
        return (
            <BaseComponent collectionName="table" render={this.renderTable} params={this.props.params.id} navigate={this.props.navigate} />
        );
    }
}

export default withRouter(CustomerMenu);