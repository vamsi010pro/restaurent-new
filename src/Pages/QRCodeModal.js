import React, { useEffect, useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import QRCode from 'react-qr-code';

const QRCodeModal = ({ open, onClose, qrid }) => {
  const [qrData, setQrData] = useState('');

 useEffect(() => {
  if (qrid) {
    setQrData(`https://anjaliravi2304.github.io/QR-Restaurant-Menu/#/customermenu/${qrid}`);
  }
}, [qrid]);

  const onImageDownload = () => {
    const svg = document.getElementById("QRCode");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    // Calculate the size based on the SVG dimensions
    const svgBounds = svg.getBoundingClientRect();
    canvas.width = svgBounds.width;
    canvas.height = svgBounds.height;
    const img = new Image();
    img.onload = () => {

      // Clear any background (transparent by default)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "QRCode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "end" }}>
          <IconButton sx={{ color: "red", width: '2.5rem' }} onClick={onClose}>x</IconButton>
        </Box>
        <Typography sx={{ color: "green", textAlign: "center" }}>Scan or Download QR Code</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "auto" }}>
          <QRCode id="QRCode" value={qrData} bgColor="none" />
        </Box>
      </DialogContent>
      <DialogActions sx={{ display: "flex", justifyContent: "center", }}>
        <Button variant="outlined" onClick={onImageDownload}>Download QR</Button>
        <Button variant="outlined" onClick={() => window.open(qrData)}>Veiw Link</Button>
      </DialogActions>
      <Box p={1} />
    </Dialog>
  );
};

export default QRCodeModal;
