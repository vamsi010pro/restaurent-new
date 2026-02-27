import { Box } from "@mui/material";
import WaiterHeaderComponent from "../components/mainComponents/WaiterHeaderComponent";
import ManageBills from "../components/ManageBills";

const WaiterViewBills = () => {

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
                <ManageBills />
            </Box>
        </Box>
    )
}
export default WaiterViewBills;