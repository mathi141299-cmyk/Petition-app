import React from "react";
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Typography,
  Box,
} from "@mui/material";

type CheckBoxProps = {
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  label?: string;
  name?: string;
  error?: boolean;
  helperText?: string;
  formFlexDirection?: string;
  rightAlign?: boolean;
  rightAlignText?: string;
  color?: string | any;
  sx?: {};
  value?: boolean;
  formControlStyle?: {};
  disabled?: boolean;
};

const CustomCheckbox = ({
  checked,
  label,
  error,
  value,
  name,
  onChange,
  helperText,
  formFlexDirection = "rowReverse",
  rightAlign,
  rightAlignText,
  color = "primary.main",
  sx,
  formControlStyle,
  disabled,
}: CheckBoxProps) => {
  const styles = {
    box: {
      display: "flex",
      flexDirection: "rowReverse",
      alignItems: "center",
      marginRight: "0 !important",
      "& .MuiFormControlLabel-root": {
        marginRight: "0",
      },
    },
    typography: { fontSize: "12px", fontWeight: "400" },
    rightAlignTypho: {
      fontSize: "12px",
      fontWeight: "300",
    },
  };

  return (
    <>
      <FormControl error={error}>
        <Box sx={{ ...styles.box }}>
          <FormControlLabel
            label={label}
            sx={{
              color: "#939393",
              "& .MuiTypography-root": {
                fontSize: "13px",
                fontWeight: 400,
              },
            }}
            control={
              <Checkbox
                checked={checked}
                name={name}
                onChange={onChange}
                inputProps={{ "aria-label": "controlled" }}
                disabled={disabled}
                disableRipple
                sx={{
                  color: "#D9D9D9",
                  "&.Mui-checked": {
                    color: color,
                  },
                  "&:hover": {
                    backgroundColor: "transparent", // Remove hover effect
                  },
                  m: 0,
                  p: "0px 8px",
                  ...sx,
                }}
              />
            }
          />

          {rightAlign && (
            <Typography sx={{ ...styles.rightAlignTypho }}>
              {rightAlignText}
            </Typography>
          )}
        </Box>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </>
  );
};

export default CustomCheckbox;
