import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemText,
  ListItemIcon,
  Grid,
} from "@mui/material";
import MainListItems from "../navLinks/ListItem";
import { useDispatch, useSelector } from "react-redux";
import { setMobileOpen } from "../../../redux/slices/layout";
import { NavLogIcon, NavLogoIcon } from "../../../assets/icons";

const Nav = () => {
  const drawerWidth = 266;

  const dispatch = useDispatch<any>();

  const mobileOpen = useSelector((state: any) => state.layout.mobileOpen);

  const handleDrawerClose = () => {
    dispatch(setMobileOpen(!mobileOpen));
  };

  const drawer = (
    <Grid>
      <List
        sx={{
          height: "32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // m: "9px 25px 0px 10px",
          // p: "0px 0 15px 0",
          // m: "9px 25px 0px 10px",
          // p: "0px 0 15px 0",
          // m: "20px 0",
          mt: "10px",
        }}
      >
        <ListItemIcon>
          {/* <NavLogIcon width="150px" height="100px" /> */}
          <NavLogoIcon />
        </ListItemIcon>
      </List>
      <List
        sx={{
          mt: 1,
        }}
        className="layout-list"
      >
        <MainListItems />
      </List>
    </Grid>
  );
  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
        backgroundColor: "primary.main",
      }}
      aria-label="mailbox folders"
    >
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            backgroundColor: "#F9FBF9",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            borderRight: "1px solid #E5E7EB",
            p: 0,
            m: 0,
            // backgroundColor: "#F9FBF9",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Nav;
