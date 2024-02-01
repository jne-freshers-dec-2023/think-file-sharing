// ShareLinkModal.js

import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import FileCopyIcon from "@mui/icons-material/FileCopy";

const ShareLinkModal = ({ open, handleClose, sharedLink }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sharedLink);
      setIsCopied(true);
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const handleModalClose = () => {
    setIsCopied(false); // Reset the copied state when the modal is closed
    handleClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%", // Adjust the width as per your design
          maxWidth: "600px", // Set a maximum width if needed
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
          textAlign: "center", // Center the content
        }}
      >
        <Typography variant="h6" component="div">
          Shared Link
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 2, wordWrap: "break-word", color: "blue" }}
        >
          {sharedLink}
        </Typography>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={handleCopy}>
          {isCopied ? "Copied!" : "Copy to Clipboard"}
          <FileCopyIcon sx={{ ml: 1 }} />
        </Button>
        <Button onClick={handleModalClose} sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default ShareLinkModal;
