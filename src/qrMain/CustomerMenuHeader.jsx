import { Box, Button, Typography, styled } from "@mui/material";
import companyLogo from "../data/images/QRMenuPic.png";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from "../services/firebase";

const CustomerMenuHeader = ({ tableName }) => {
    const HeaderBox = styled(Box)({
        width: "100%",
        height: "50px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px dashed gray",
        // backgroundColor: "black",
        // color: "white",
    })

    const [isButtonDisplay, setButtonDisplay] = useState(true);
    const [timer, setTimer] = useState(30); // 30 sec
    const [isActive, setIsActive] = useState(false);

    const onCallWaiterHandle = async () => {
        try {
            setButtonDisplay(false);
            setIsActive(true);
            setTimer(30); // 30 sec

            // Check if table already exists
            const tableQuery = query(
                collection(db, "callWaiter"),
                where("tableName", "==", tableName)
            );
            const querySnapshot = await getDocs(tableQuery);

            if (querySnapshot.empty) {
                // Case 1.1: Table doesn't exist, add new entry
                const callingWaiter = {
                    tableName,
                    calling: true,
                };
                await addDoc(collection(db, "callWaiter"), callingWaiter);
            } else {
                // Case 1.2: Table exists, update calling status to true
                const docRef = doc(db, "callWaiter", querySnapshot.docs[0].id);
                await updateDoc(docRef, {
                    calling: true
                });
            }

            // Start timer to set calling to false after 30 seconds
            setTimeout(async () => {
                try {
                    const tableQuery = query(
                        collection(db, "callWaiter"),
                        where("tableName", "==", tableName)
                    );
                    const snapshot = await getDocs(tableQuery);

                    if (!snapshot.empty) {
                        const docRef = doc(db, "callWaiter", snapshot.docs[0].id);
                        await updateDoc(docRef, {
                            calling: false
                        });
                    }
                    setButtonDisplay(true);
                } catch (error) {
                    console.error("Error updating calling status:", error);
                }
            }, 30000); // 30 sec

        } catch (error) {
            console.error("Error in call waiter operation:", error);
            alert("An error occurred while calling waiter.");
        }
    }

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

    return (
        <HeaderBox>
            <Box component="img" sx={{ height: "80%", marginLeft: "2%" }} alt="Header Logo" src={companyLogo} />
            <Typography sx={{
                // border: "1px dashed #ffffff4f",
                border: "1px dashed black",

                padding: "5px", borderRadius: "5px"
            }}>{tableName}</Typography>
            {
                isButtonDisplay ?
                    <Button sx={{ minWidth: "110px", height: "60%", marginRight: "4%", border: "2px solid", fontWeight: "bold" }} variant="outlined" onClick={() => onCallWaiterHandle()}>Call Waiter</Button>
                    :
                    <Typography sx={{ minWidth: "110px", marginRight: "4%", color: "yellow", textAlign: "center", fontWeight:"bold" }}>{timer}s</Typography>
            }
        </HeaderBox>
    )
}
export default CustomerMenuHeader;