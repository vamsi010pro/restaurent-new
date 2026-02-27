import React from "react";
import withRouter from "../components/withRouter";
import BaseComponent from "../components/BaseComponent";
import WaiterHeaderComponent from "../components/mainComponents/WaiterHeaderComponent";
import WaiterMenuAccordions from "./WaiterMenuAccordians";
import { Box } from "@mui/material";

class ViewUpdateOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // isOrderNCallWaiterDisabled: false,
        };
    }


    renderTable = (data) => {

        return (
            <main className="customer-menu-page" ref={this.mainRef}>
                <WaiterHeaderComponent />
                <Box sx={{ height: "10vh" }} ></Box>
                <WaiterMenuAccordions tableName={data.table_name} tableId={data.table_id}/>
            </main >

        );
    }

    render() {
        return (
            <BaseComponent collectionName="table" render={this.renderTable} params={this.props.params} navigate={this.props.navigate} />
        );
    }
}

export default withRouter(ViewUpdateOrder);