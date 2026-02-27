import { Box, Button, IconButton, Tooltip, styled } from "@mui/material";
import CallIcon from '@mui/icons-material/Call';
import RateReviewIcon from '@mui/icons-material/RateReview';
import Zoom from '@mui/material/Zoom';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';

const FooterComponent = () => {
    const FooterBox = styled(Box)({
        width: "100%",
        height: "50px",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        borderTop: "1px dashed gray"
    })
    const handleCallUsClick = () => {
        const phoneNumber = "7207486526";
        window.location.href = `tel:${phoneNumber}`;
    };
    const handleRateUsClick=()=>{
        const googleMapsUrl = "https://maps.app.goo.gl/ZuS5XfTX5DYakDpV6";
        window.open(googleMapsUrl, '_blank');
    }
    const handleFBClick=()=>{
        const fburl ="https://www.facebook.com/panigrahi.kiranbabu?mibextid=ZbWKwL";
        window.open(fburl, '_blank');
    }
    const handleTXClick=()=>{
        const txurl ="https://twitter.com/PANIGRAHIKIRAN3";
        window.open(txurl, '_blank');
    }
    const handleIGClick=()=>{
        const igurl ="https://www.instagram.com/explore/locations/161221201159335/rk-bar-and-restaurant/";
        window.open(igurl, '_blank');
    }

    return (
        <FooterBox>
            <Tooltip title="Call Us" placement="top" arrow TransitionComponent={Zoom}>
                <CallIcon fontSize="large"  color="primary" onClick={()=>handleCallUsClick()}/>
            </Tooltip>
            <Tooltip title="Rate Us" placement="top" arrow TransitionComponent={Zoom}>
                <RateReviewIcon fontSize="large" color="primary" onClick={()=>handleRateUsClick()}/>
            </Tooltip>
            <Tooltip title="Visit our Facebook Page" placement="top" arrow TransitionComponent={Zoom}>
                <FacebookRoundedIcon fontSize="large" color="primary" onClick={()=>handleFBClick()}/>
            </Tooltip>
            <Tooltip title="Visit our Twitter Page" placement="top" arrow TransitionComponent={Zoom}>
                <XIcon fontSize="large" color="primary" onClick={()=>handleTXClick()}/>
            </Tooltip>
            <Tooltip title="Visit our Insta Page" placement="top" arrow TransitionComponent={Zoom}>
                <InstagramIcon fontSize="large" color="primary" onClick={()=>handleIGClick()}/>
            </Tooltip>
        </FooterBox>
    )
}
export default FooterComponent;