import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FormControl, FormHelperText, Grid, InputLabel } from "@mui/material";
import { useState } from "react";
import dayjs from "dayjs";

type DateTimePickerProps = {
  value?: any;
  name?: string;
  label?: string | any;
  error?: boolean;
  helperText?: string;
  onChange?: any;
  disabled?: any;
  sx?: {};
  formControlStyle?: {};
  disableFuture?: boolean;
  placeholder?: string;
  format?: any;
};

const MuiDateTimePicker = ({
  value,
  name,
  error,
  helperText,
  onChange,
  label,
  sx,
  formControlStyle,
  disabled,
  disableFuture = false,
  placeholder,
  format,
}: DateTimePickerProps) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const currentDate = dayjs();
  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <InputLabel sx={{ color: "greyScale.main", fontSize: "12px" }}>
          {label}
        </InputLabel>
        <FormControl sx={{ mt: label ? "5px" : "0px", ...formControlStyle }}>
          <DateTimePicker
            format={format}
            onChange={onChange}
            value={value}
            disabled={disabled}
            disableFuture={disableFuture}
            // minDate={currentDate}
            // maxDate={currentDate}
            sx={{
              "& .MuiButtonBase-root .MuiPickersDay-root .Mui-selected": {
                backgroundColor: "primary.main !important",
              },
              "& .MuiInputBase-input": {
                padding: "15.3px 0",
                fontSize: "12px",
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
                pl: "0px",
                borderRadius: "8px",
              },
              "& .MuiOutlinedInput-root.Mui-disabled": {
                borderColor: "#E5E7EB",
                backgroundColor: "#F4F4F5",
                // pl: "15px",
                borderRadius: "8px",
              },
              "& input::placeholder": {
                fontSize: "12px", // Change the font size as needed
              },

              "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                borderColor: "#E5E7EB",
              },
              "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: "#E5E7EB",
                },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
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

              "& .MuiFormHelperText-root": {},
              ...sx,
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
      </LocalizationProvider>
    </Grid>
  );
};
export default MuiDateTimePicker;
