import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 3,
});

const CustomButton = styled(Button)({
  height: "70px",
  background: "#0C61FE",
});

export default function InputFileUpload({ onUploadSuccess }) {
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    console.log("Selected file:", file);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      console.log("Token fro InputFileUpload ", token);
      const response = await axios.post(
        "http://localhost:3200/api/feed/upload",

        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response ", response);
      const { data, status } = response;

      console.log("Data ", data);
      console.log("statusCode ", status);

      if (status === 201 && data && data.docId) {
        toast.success("File uploaded successfully");
        onUploadSuccess();
      } else {
        console.error("File upload failed:", response.data.message);

        toast.error("File upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during file upload:", error.message);

      toast.error(error.message);
    }
  };
  return (
    <CustomButton
      component="label"
      variant="contained"
      startIcon={<CloudUploadIcon />}
    >
      Upload file
      <VisuallyHiddenInput type="file" onChange={handleFileChange} />
    </CustomButton>
  );
}
