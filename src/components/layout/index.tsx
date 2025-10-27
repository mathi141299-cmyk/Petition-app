import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import Header from "./header";
import Nav from "./nav";
import { Outlet } from "react-router-dom";
import { useState } from "react";

export default function ResponsiveDrawer() {
  // const [isKeyPress, setIsKeyPress] = useState<boolean>(false);
  // const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
  //   if (event.key === "F3") {
  //     setIsKeyPress(true);
  //     event.preventDefault();
  //   }
  // };
  const currentYear = new Date()?.getFullYear();
  return (
    <Grid
      className="App"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ display: "flex" }}>
        <Header />
        <Nav />
        <Box
          sx={{
            flexGrow: 1,
            p: 1,
            position: "absolute",
          }}
        >
          <Toolbar />
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, pt: 12, m: { sm: "0 10px 0 295px", xs: "8px" } }}>
        <Outlet />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          padding: 2,
          mt: "auto", // This ensures the footer is pushed to the bottom
        }}
      >
        <Typography variant="h3" color="#8A8A8A" fontWeight={400}>
          &copy; {currentYear}{" "}
          <a
            href="https://www.techbumbles.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#F97D09" }}
          >
            Techbumbles
          </a>
        </Typography>
      </Box>
    </Grid>
  );
}
