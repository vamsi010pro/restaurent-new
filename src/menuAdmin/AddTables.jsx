import { Box, Typography, TextField, Button, CircularProgress, Paper } from "@mui/material";
import { useState } from "react";
import { collection, query, where, getDocs, addDoc, setDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

const AddTables = ({fetchTablesData}) => {
    const [tableName, setTableName] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [tableNameError, setTableNameError] = useState("");

    const validateTableName = (name) => {
        if (!name || name.trim() === "") {
            return "Table name cannot be empty";
        }
        if (!/[a-zA-Z0-9]/.test(name)) {
            return "Table name must contain at least one letter or number";
        }
        return "";
    };

    const handleTableNameChange = (e) => {
        const value = e.target.value;
        setTableName(value);
        setTableNameError(validateTableName(value));
    };

    const onCreateTable = async () => {
        setLoading(true);
        setErrorMsg("");
        setSuccessMsg("");

        try {
            // Check if a table with the same table_name already exists
            const q = query(collection(db, "table"), where("table_name", "==", tableName));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setErrorMsg("Table Name already exists.");
                setLoading(false);
                return;
            }

            // Add a new table document
            const tableRef = await addDoc(collection(db, "table"), {
                createdAt: new Date().toISOString().split('T')[0],
                table_name: tableName,
                active: true,
            });

            // Update the same document with its UID
            await setDoc(doc(db, "table", tableRef.id), { table_id: tableRef.id }, { merge: true });
            fetchTablesData();
            setSuccessMsg("Table added successfully.");
            setTableName("");
        } catch (error) {
            console.error("Error creating table:", error);
            alert("An error occurred while creating the table.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            width: { xs: "95%", md: "25%" },
            display: "flex",
            justifyContent: "center",
            alignItems: { xs: "start", md: "center" },
        }}>
            <Box component={Paper} sx={{
                p: 2,
            }}>
                <Typography sx={{
                    textAlign: "center", fontSize: { xs: "2rem", md: "3rem" }, fontWeight: "bold"
                }}>Add Table</Typography>

                {/* Form Inputs */}
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Table Name"
                    value={tableName}
                    onChange={handleTableNameChange}
                    error={!!tableNameError}
                    helperText={tableNameError}
                    sx={{ mt: 2 }}
                    inputProps={{
                        style: { textAlign: "center", fontWeight: "bold" },
                    }}
                />

                {/* Error Message */}
                {errorMsg && <Typography color="error" sx={{ textAlign: "center", mt: 1, mb: 1 }}>{errorMsg}</Typography>}
                {!errorMsg && <Box p={2.5} />}

                {/* Submit Button */}
                <Button
                    fullWidth
                    variant="contained"
                    color="success"
                    onClick={()=>onCreateTable()}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Create Table"}
                </Button>

                {/* success Message */}
                {successMsg && <Typography sx={{ textAlign: "center", mt: 1, mb: 1, color: "green" }}>{successMsg}</Typography>}
                {!successMsg && <Box p={2.5} />}
            </Box>
        </Box>
    )
}
export default AddTables;