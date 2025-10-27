import { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Typography,
  MenuItem,
  Divider,
  Menu,
  MenuProps,
  styled,
  alpha,
} from "@mui/material";
import { AdminPicIcon, AvatarIcon } from "../../../assets/icons";
import { Logout } from "@mui/icons-material";
import { logout } from "../../../services/AuthService";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    // elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: "8px",
    marginTop: theme.spacing(1),
    minWidth: "200px",
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    border: "1px solid #DFE3E8",
    Transition: "none",
    boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.07)",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

const Avatar = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userName, setUserName] = useState<any>("Admin");
  const { authUser } = useSelector((state: RootState) => state.auth) as any;

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = (e: any) => {
    logout();
  };
  // useEffect(() => {
  //   if (localStorage.getItem("userDetails")) {
  //     const userName = JSON.parse(localStorage?.getItem("userDetails") as any);
  //     setUserName(userName.name);
  //   }
  // }, [userName]);
  return (
    <>
      <IconButton
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        disableRipple
      >
        <AvatarIcon />
        {/* <img src="/AvatarIcon.png" alt="" /> */}
      </IconButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple sx={{ gap: 2 }}>
          <AdminPicIcon />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" fontWeight={600} color="#000000">
              {/* {userName !== null ? userName.name : "Admin"} */}
              {authUser?.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box
                sx={{
                  width: "6px",
                  height: "6px",
                  background: "#00B548",
                  borderRadius: "10px",
                }}
              ></Box>
              <Typography variant="p" color="#6B7280">
                Active
              </Typography>
            </Box>
          </Box>
        </MenuItem>
        <Divider sx={{ my: 0.5, background: "rgba(241, 241, 241, 1)" }} />
        {/* <MenuItem onClick={handleClose} disableRipple sx={{ gap: 1.5 }}>
          <PasswordResetIcon />
          <Typography variant="h6" color="#6B7280">
            Reset Password
          </Typography>
        </MenuItem> */}
        <MenuItem onClick={handleLogout} disableRipple sx={{ gap: 1.5 }}>
          <Logout style={{ margin: 0 }} />
          <Typography variant="h6" color="#6B7280">
            Log out
          </Typography>
        </MenuItem>
      </StyledMenu>
    </>
  );
};
export default Avatar;
