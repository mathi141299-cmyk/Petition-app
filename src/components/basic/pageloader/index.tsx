import { Box, CircularProgress, Typography } from "@mui/material";

const PageLoader = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="h2" color="initial">
        Loading
      </Typography>
    </Box>
  );
};

export default PageLoader;
