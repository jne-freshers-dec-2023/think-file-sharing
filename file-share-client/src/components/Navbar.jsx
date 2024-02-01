import React from "react";
import { AppBar, Box, InputBase, Toolbar, styled } from "@mui/material";
import { Mail, Notifications } from "@mui/icons-material";
import Badge from "@mui/material/Badge";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  backgroundColor: "#ffffff",
});

const Search = styled("div")(({ theme }) => ({
  backgroundColor: "#ffffff",
  padding: "0 10px",
  borderRadius: theme.shape.borderRadius,
  width: "40%",
  border: "1px solid #ccc",
}));

const Icons = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: "20px",
}));

const BlackMailIcon = styled(Mail)({
  color: "black",
});

const BlackNotificationsIcon = styled(Notifications)({
  color: "black",
});

const WhiteAccountCircleIcon = styled(AccountCircle)({
  color: "black",
});

const Navbar = ({ setSearchOn }) => {
  const [searchValue, setSearchValue] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      console.log("Search value from Navbar:", searchValue);
      setSearchOn(searchValue);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    console.log("Logout clicked");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/");

    toast.success("Logout successful", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <AppBar
      sx={{
        boxShadow: "none !important",
      }}
      position="sticky"
    >
      <StyledToolbar>
        <Search>
          <InputBase
            placeholder="Search..."
            value={searchValue}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
        </Search>
        <Icons>
          <Badge badgeContent={4} color="error">
            <BlackMailIcon />
          </Badge>
          <Badge badgeContent={2} color="error">
            <BlackNotificationsIcon />
          </Badge>
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
            <WhiteAccountCircleIcon />
          </IconButton>
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
          >
            <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Icons>
      </StyledToolbar>
    </AppBar>
  );
};

export default Navbar;
