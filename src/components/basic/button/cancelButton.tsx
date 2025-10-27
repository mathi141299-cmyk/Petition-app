import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { displayText } from "../../../constants/displayText";

type ButtonProps = {
  variant?: "text" | "outlined" | "contained";
  buttonText?: string;
  handleClick?: () => void;
  sx?: {};
  children?: string;
  isDisabled?: boolean;
};

const CancelButton = ({
  variant = "outlined",
  buttonText = "Cancel",
  handleClick,
  sx,
  isDisabled,
}: ButtonProps) => {
  const navigate = useNavigate();
  const styles = {
    boxShadow: "none",
    borderRadius: "5px",
    width: "130px",
    height: "49px",
    fontWeight: 400,
    fontSize: 14,
    textTransform: "none",
    borderColor: "greyScale.light",
    color: "greyScale.light",
    backgroundColor: "backgroundPrimary",
    "&:hover": {
      backgroundColor: "initial",
      color: "primary.main",
      borderColor: "primary.main",
    },
  };
  return (
    <>
      <Button
        disabled={isDisabled}
        variant={variant}
        onClick={handleClick ? handleClick : () => navigate(-1)}
        disableRipple
        sx={{ ...styles, ...sx }}
      >
        {buttonText}
      </Button>
    </>
  );
};

export default CancelButton;
