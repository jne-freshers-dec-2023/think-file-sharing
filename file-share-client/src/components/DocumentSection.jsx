import {useState} from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputFileUpload from "./InputFileUpload";
import DocumentList from "./DocumentList";

const DocumentSection = (props) => {
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUploadSuccess = () => {
    setUploadSuccess(!uploadSuccess);
  };

  console.log("From DocumentSection ", props.searchOn);
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <InputFileUpload onUploadSuccess={handleUploadSuccess} />

      <DocumentList key={uploadSuccess} searchOn={props.searchOn} />
    </Box>
  );
};

export default DocumentSection;
