import * as React from 'react';
import { Box, Typography, styled } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WaiterPriceTable from './WaiterPriceTable';
import MenuDetails from '../qrMain/MenuDetails';
import { useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from "../services/firebase";

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid #ffffff4f`,
    borderRadius: "5px",
    marginBottom: "5px",
    '&::before': {
        display: 'none',
    },
    backgroundColor: 'transparent',
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ExpandMoreIcon sx={{
            fontSize: '1.5rem',
            color: "white"
        }} />}
        {...props}
    />
))(({ theme, expanded }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'transparent',
    flexDirection: 'row',
    color: theme.palette.common.white,
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(180deg)',
    },
    borderBottom: expanded ? '1px dashed #ffffff4f' : 'none',
}));

export default function WaiterMenuAccordions({ tableName, tableId}) {
    const [expanded, setExpanded] = React.useState('panel1');
    const [addedItems, setAddedItems] = React.useState([]);
    const [foodList, setFoodList] = React.useState([]);

    useEffect(() => {
        fetchMenuData();
    }, []);

    const fetchMenuData = async () => {
        try {
            const menuCollection = collection(db, "menu");
            const q = query(menuCollection);
            const querySnapshot = await getDocs(q);

            const fetchedMenu = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })).filter(item => item.active === true); // Only keep active items

            // console.log(fetchedMenu);

            setFoodList(fetchedMenu);
        } catch (error) {
            console.error("Error fetching menu list:", error);
        }
    };


    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const getFilteredItemsByType = (type, isVeg) => {
        return foodList.filter((item) => item.categoryType === type && item.isVeg === isVeg);
    };

    const onAddClicked = (item) => {
        // console.log(item);

        const existingItemIndex = addedItems.findIndex((addedItem) => addedItem.itemName === item.itemName);
        if (existingItemIndex !== -1) {
            const updatedItems = [...addedItems];
            updatedItems[existingItemIndex].quantity += 1;
            setAddedItems(updatedItems);
        } else {
            setAddedItems([...addedItems, { ...item, quantity: 1 }]);
        }
    }

    const onRemoveClicked = (item) => {
        const existingItemIndex = addedItems.findIndex((addedItem) => addedItem.itemName === item.itemName);
        if (existingItemIndex !== -1) {
            const updatedItems = [...addedItems];
            if (updatedItems[existingItemIndex].quantity > 1) {
                updatedItems[existingItemIndex].quantity -= 1;
            } else {
                updatedItems.splice(existingItemIndex, 1);
            }
            setAddedItems(updatedItems);
        }
    };

    const handleRemoveItem = (itemToRemove) => {
        // console.log('Item to remove:', itemToRemove);
        // console.log('Current added items:', addedItems);
        
        const existingItemIndex = addedItems.findIndex(
            (item) => item.itemName === itemToRemove.itemName && 
                     item.itemPrice === itemToRemove.unit
        );

        if (existingItemIndex !== -1) {
            const updatedItems = [...addedItems];
            if (updatedItems[existingItemIndex].quantity > 1) {
                updatedItems[existingItemIndex].quantity -= 1;
            } else {
                updatedItems.splice(existingItemIndex, 1);
            }
            setAddedItems(updatedItems);
        }
    };

    return (
        <Box sx={{
            paddingLeft: 3, paddingRight: 3, paddingBottom: 1,
            backgroundColor: "black",
            minHeight: "90vh", color: "white",
            display: { xs: "block", md: "flex" }, justifyContent: "space-between"
        }}>
            <Box sx={{ width: { xs: "100%", md: "49%" } }}>
                <Typography sx={{ textAlign: "center", border: "1px dashed #ffffff4f", padding: "5px", borderRadius: "5px", mt: 2 }}>{tableName}</Typography>
                {Array.from(new Set(foodList.map((item) => item.categoryType))).map((type, index) => (
                    <Box key={type} >
                        <Typography sx={{ fontWeight: "bold", fontSize: "15px", pl: 2, pt: 1, textAlign: "center" }}>{type}</Typography>
                        {/* Veg Section */}
                        <Accordion expanded={expanded === `panel${index + 1}`} onChange={handleChange(`panel${index + 1}`)}>
                            <AccordionSummary expanded={expanded === `panel${index + 1}`} aria-controls={`panel${index + 1}-veg-content`} id={`panel${index + 1}-veg-header`}>
                                <Typography>{type} - Veg ({getFilteredItemsByType(type, true).length})</Typography>
                            </AccordionSummary>
                            {getFilteredItemsByType(type, true).map((item) => (
                                <MenuDetails key={item.itemName} item={item} addedItems={addedItems} onAddClicked={onAddClicked} onRemoveClicked={onRemoveClicked} />
                            ))}
                        </Accordion>

                        {/* Non-Veg Section */}
                        <Accordion expanded={expanded === `panel${index + 2}-non-veg`} onChange={handleChange(`panel${index + 2}-non-veg`)}>
                            <AccordionSummary expanded={expanded === `panel${index + 2}-non-veg`} aria-controls={`panel${index + 2}-non-veg-content`} id={`panel${index + 2}-non-veg-header`}>
                                <Typography>{type} - Non Veg ({getFilteredItemsByType(type, false).length})</Typography>
                            </AccordionSummary>
                            {getFilteredItemsByType(type, false).map((item) => (
                                <MenuDetails key={item.itemName} item={item} addedItems={addedItems} onAddClicked={onAddClicked} onRemoveClicked={onRemoveClicked} />
                            ))}
                        </Accordion>
                    </Box>
                ))}

            </Box>

            <Box sx={{ width: { xs: "100%", md: "49%" } }}>
                {/* { */}
                {/* addedItems.length > 0 && */}
                <WaiterPriceTable addedItems={addedItems} tableName={tableName} tableId={tableId} onRemoveItem={handleRemoveItem} />
                {/* } */}
            </Box>
        </Box>
    );
}
