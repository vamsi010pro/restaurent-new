import { Box } from "@mui/material";
import AdminHeaderComponent from "../components/mainComponents/AdminHeaderComponent";
import ManageBills from "../components/ManageBills";
import { useNavigate } from "react-router-dom";
import LsService from "../services/localstorage";
import { useEffect } from "react";

const TrackBills = () => {
const navigate = useNavigate();

    const user = LsService.getItem("user");

    useEffect(() => {
        // console.log(user);

        if (user.type !== "admin") {
            // console.log("not loggedin");
            LsService.removeItem("user");
            navigate("/");
        }
    }, []);

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
export default TrackBills;