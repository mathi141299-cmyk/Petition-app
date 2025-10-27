import { LoadingButton } from "@mui/lab";
import { CircularProgress } from "@mui/material";

type LoadingButtonProps = {
  loading?: boolean;
  handleClick?: any;
  buttonText?: string;
  sx?: {};
  variant?: any;
  onClick?: ((event: Event) => any) | any;
};

function CustomButton({
  loading = false,
  buttonText,
  sx,
  variant = "contained",
  onClick,
}: LoadingButtonProps) {
  const styles = {
    boxShadow: "none",
    borderRadius: "5px",
    width: "130px",
    height: "49px",
    fontWeight: 600,
    fontSize: 18,
    textTransform: "none",
    "&.MuiLoadingButton-loading": {
      backgroundColor: "primary.main",
      color: "white",
    },
    "&:hover": {
      backgroundColor: "primary.main",
      color: "backgroundPrimary",
      boxShadow: "none",
    },
  };
  return (
    <LoadingButton
      size="small"
      onClick={onClick}
      loading={loading}
      loadingPosition={loading ? "start" : undefined}
      startIcon={loading ? <CircularProgress size={20} /> : null} // Add a CircularProgress as startIcon when loading is true
      variant={variant}
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

export default CustomButton;
