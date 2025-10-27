import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";

type LoadingButtonProps = {
  loading?: boolean;
  handleClick?: any;
  buttonText?: string;
  sx?: {};
};

function DeleteButton({
  loading = false,
  handleClick,
  buttonText = "Delete",
  sx,
}: LoadingButtonProps) {
  const styles = {
    boxShadow: "none",
    borderRadius: "5px",
    width: "130px",
    height: "49px",
    fontWeight: 400,
    fontSize: 14,
    textTransform: "none",
    backgroundColor: "#F7525A",
    color: "white",
    "&.MuiLoadingButton-loading": {
      backgroundColor: "#F7525A",
    },
    "&:hover": {
      backgroundColor: "#D9434E",
      color: "white",
      boxShadow: "none",
    },
  };

  return (
    <LoadingButton
      size="small"
      onClick={handleClick}
      loading={loading}
      loadingPosition={loading ? "start" : undefined}
      startIcon={null}
      variant="contained"
      type="submit"
      sx={{
        ...styles,
        ...sx,
      }}
    >
      {buttonText}
    </LoadingButton>
  );
}

export default DeleteButton;
