import React, { useState } from "react";
import { FormHelperText, TextField, TextFieldProps, Grid } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { InputLabel } from "@mui/material";

type TextBoxProps = TextFieldProps & {
  value?: string | number | null;
  name?: string;
  label?: string | any;
  error?: boolean;
  helperText?: string;
  variant?: "filled" | "outlined" | "standard";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void | any;
  onBlur?: any;
  rows?: number;
  placeholder?: string;
  startPlaceholderIcon?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | undefined;
  endPlaceholderIcon?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | undefined;
  type?: string;
  multiline?: boolean;
  fullWidth?: boolean;
  width?: string;
  onAdornmentClick?: () => void;
  sx?: {};
  height?: string;
  disabled?: boolean;
  inputRef?: any;
  inputAdornment?: string;
  formControlStyle?: {};
  onFocus?: () => void;
  focused?: boolean;
  defaultValue?: string | number;
  InputProps?: any;
  autoFocus?: boolean;
};

const TextBox = ({
  value,
  name,
  error,
  helperText,
  onChange,
  onBlur,
  variant = "outlined",
  fullWidth = true,
  width = "550px",
  rows,
  placeholder,
  startPlaceholderIcon,
  endPlaceholderIcon,
  type,
  multiline,
  label,
  sx,
  onAdornmentClick,
  InputProps,
  disabled = false,
  inputRef,
  inputAdornment,
  formControlStyle,
  onFocus,
  defaultValue,
  focused,
  autoFocus,
}: TextBoxProps) => {
  const styles = {
    typographyStyle: {
      mb: "4px",
      lineHeight: "20px",
      color: "greyScale.main",
    },
    textBoxStyles: {
      width: { width },
      color: "textPrimary.main",

      "& .MuiInputBase-input": {
        padding: "14px 0",
      },
      "& .MuiOutlinedInput-root.Mui-focused": {
        borderColor: "primary.main",
        boxShadow: "none",
      },
      "& .MuiOutlinedInput-root": {
        borderRadius: "8px",
        paddingLeft: "15px",
        boxShadow: " 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      },

      "& .MuiInputBase-input.Mui-disabled": {
        borderColor: "#E5E7EB",
        backgroundColor: "#F4F4F5",
        pl: "3px",
        borderRadius: "5px",
      },
      "& .MuiOutlinedInput-root.Mui-disabled": {
        borderColor: "#E5E7EB",
        backgroundColor: "#F4F4F5",
        // pl: "15px",
        borderRadius: "5px",
      },
      "&.Mui-disabled.MuiOutlinedInput-root": {
        borderColor: "#E5E7EB",
        backgroundColor: "#F4F4F5",
        pl: "15px",
        borderRadius: "5px",
      },
      "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E5E7EB !important",
      },
      "& input::placeholder": {
        fontSize: "12px", // Change the font size as needed
      },

      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E5E7EB",
      },
      "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E5E7EB",
      },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
      },
      "& .MuiOutlinedInput-input": {
        color: "textPrimary.main",
      },
      "&:hover .MuiOutlinedInput-input": {
        color: "textPrimary.main",
      },
      "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
        color: "textPrimary.main",
      },
      "& .MuiInputLabel-outlined": {
        color: "greyScale.lighter",
      },
      "&:hover .MuiInputLabel-outlined": {
        color: "greyScale.lighter",
      },
      "& .MuiInputLabel-outlined.Mui-focused": {
        color: "primary.main",
        boxShadow: " 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
      },
    },
  };
  const [isFocused, setIsFocused] = useState(false);
  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {label && (
        <InputLabel
          focused={isFocused || focused}
          sx={{ color: "greyScale.main", fontSize: "12px" }}
        >
          {label}
        </InputLabel>
      )}
      <FormControl sx={{ mt: label ? "5px" : "0px", ...formControlStyle }}>
        <TextField
          variant={variant}
          multiline={multiline}
          rows={rows}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          autoFocus={autoFocus}
          onFocus={() => {
            setIsFocused(true);
            if (onFocus) {
              onFocus();
            }
          }}
          onBlur={(e) => {
            setIsFocused(false);
            {
              onBlur && onBlur(e);
            }
          }}
          disabled={disabled}
          name={name}
          type={type}
          // error={error}
          onChange={onChange}
          inputRef={inputRef}
          sx={{
            ...styles.textBoxStyles,
            ...sx,
          }}
          InputProps={{
            endAdornment:
              endPlaceholderIcon ||
              (inputAdornment && (
                <InputAdornment
                  position="start"
                  onClick={onAdornmentClick}
                  sx={{ cursor: "pointer" }}
                >
                  {endPlaceholderIcon || inputAdornment}
                </InputAdornment>
              )),
            startAdornment: startPlaceholderIcon && (
              <InputAdornment
                position="start"
                onClick={onAdornmentClick}
                sx={{ cursor: "pointer" }}
              >
                {startPlaceholderIcon}
              </InputAdornment>
            ),

            ...InputProps,
          }}
        />
      </FormControl>
      {helperText !== undefined && (
        <FormHelperText
          error={error}
          sx={{
            ml: 2,
            fontSize: "11px",
            minHeight: "20px",
            height: "auto",
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </Grid>
  );
};

export default TextBox;
