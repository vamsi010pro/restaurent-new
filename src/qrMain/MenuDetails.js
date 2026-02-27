import { Box, Button, Typography, styled } from "@mui/material";
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
    // backgroundImage: 'linear-gradient(to top, yellow, black)',
    // color:"black",
    backgroundColor: 'transparent',
    color: theme.palette.common.white,
}));

const MenuDetails = ({ item, addedItems, onAddClicked, onRemoveClicked }) => {
    // console.log(item);
    
    const existingItem = addedItems.find((addedItem) => addedItem.itemName === item.itemName);
    return (
        <AccordionDetails key={item.itemName}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap:"5px"}}>
                    <StopCircleOutlinedIcon color={item.isVeg ? "success" : "error"} />
                    {
                        item.itemUrl !== "" ?
                        <Box component="img"
                        sx={{
                            width: "4rem", height: "4rem",
                        }}
                        alt=""
                        src={item.itemUrl} /> : ""
                    }
                    <Typography>{item.itemName}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap:"5px"}}>
                    <Typography> Rs.{item.itemPrice}/- </Typography>
                    {existingItem ? (
                        <Box sx={{ padding: "5px", display: "flex", gap: "5px", border: "1px solid lightgray", borderRadius: "20px" }}>
                            <RemoveIcon sx={{cursor:"pointer"}} onClick={() => onRemoveClicked(item)} color='error' />
                            <Typography>{existingItem.quantity}</Typography>
                            <AddIcon sx={{cursor:"pointer"}} onClick={() => onAddClicked(item)} color='success' />
                        </Box>
                    ) : (
                        <Button variant='contained' onClick={() => onAddClicked(item)}>Add</Button>
                    )}
                </Box>
            </Box>
        </AccordionDetails>
    )
}
export default MenuDetails;