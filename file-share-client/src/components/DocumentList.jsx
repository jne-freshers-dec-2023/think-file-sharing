import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import axios from "axios";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import LinkIcon from "@mui/icons-material/Link";
import ShareLinkModal from "./ShareLinkModal";
import VisibilityIcon from "@mui/icons-material/Visibility";

const DocumentList = (props) => {
  const [files, setFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sharedLink, setSharedLink] = useState(""); // Assuming you have the shared link available

  const Demo = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const docName = props.searchOn;
      const url = `http://localhost:3200/api/feed/docs${
        docName ? `?docName=${docName}` : ""
      }`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data.docs;
      setFiles(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token ", token);

    fetchData();

    if (props.uploadSuccess) {
      fetchData();
    }
  }, [props.searchOn, props.uploadSuccess]);

  const handleView = async (fileId, fileName) => {
    console.log("File Id ", fileId);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3200/api/feed/download/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Specify responseType as "blob" for binary data
        }
      );

      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      console.log(blob);

      const newWindow = window.open(URL.createObjectURL(blob), "_blank");
      if (newWindow) {
        newWindow.document.title = fileName;
      } else {
        console.error("Failed to open new window.");
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleDelete = async (fileId) => {
    console.log("In delete document ", fileId);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:3200/api/feed/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);

      fetchData();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  const handleOpenModal = async (fileId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3200/api/feed/generate-link/?docId=${fileId}`, // Adjust the API endpoint
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const link = responseData.data.link;
        setSharedLink(link);

        // Open the modal
        setIsModalOpen(true);
      } else {
        console.error("Failed to fetch shared link");
      }
    } catch (error) {
      console.error("Error fetching shared link:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDownload = async (docId, docName) => {
    console.log("In handle download method");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:3200/api/feed/download/${docId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        // Create a link element and trigger a download
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = docName; // You can use a different filename if needed
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 5 }}>
      <Typography variant="h4">Document List</Typography>
      <Divider />
      <Grid item xs={12} md={6}>
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          Document Name
        </Typography>
        <Demo>
          <List>
            {files.map((file) => (
              <ListItem
                key={file.docId}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      aria-label="downoad"
                      sx={{ margin: 2 }}
                      onClick={() => handleDownload(file.docId, file.docName)}
                    >
                      <FileDownloadIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="downoad"
                      sx={{ margin: 2 }}
                      onClick={() => handleView(file.docId, file.docName)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="open-link"
                      sx={{ margin: 2 }}
                      onClick={() => {
                        handleOpenModal(file.docId);
                      }}
                    >
                      <LinkIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(file.docId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <InsertDriveFileIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={file.docName} />
              </ListItem>
            ))}
          </List>
        </Demo>

        <ShareLinkModal
          open={isModalOpen}
          handleClose={handleCloseModal}
          sharedLink={sharedLink}
        />
      </Grid>
    </Box>
  );
};

export default DocumentList;
