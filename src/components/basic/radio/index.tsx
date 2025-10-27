import * as React from "react";
import {
  Grid,
  Typography,
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormHelperText,
} from "@mui/material";

type RadioProps = {
  label?: string;
  value?: string | number;
  options: any;
  name?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: boolean;
  formFlexDirection?: string;
  isRadioFlexDirectionRow?: boolean;
  radioGroupDirection?: any;
  helperText?: string;
  onBlur?: any;
  sx?: any;
  disabled?: boolean;
};

function RadioButtonsGroup({
  label,
  value,
  options,
  onChange,
  error,
  name,
  formFlexDirection = "row",
  isRadioFlexDirectionRow = true,
  radioGroupDirection = "row",
  helperText,
  onBlur,
  sx,
  disabled,
}: RadioProps) {
  const styles = {
    box: {
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      justifyContent: "space-between",
      gap: 0.9,
    },
    formLabel: {
      fontWeight: "400",
      fontSize: "12px",
      color: "greyScale.main",
      display: "flex",
    },
    formControlLabel: {
      color: "textPrimary.main",
      fontSize: "14px",
      fontWeight: "400",
    },
  };
  return (
    <>
      <FormControl
        error={error}
        sx={{ display: "flex", flexDirection: { radioGroupDirection } }}
      >
        <Box
          sx={{
            ...styles.box,
            ...sx,
          }}
        >
          {label && (
            <Typography sx={{ ...styles.formLabel }}>{label}</Typography>
          )}
          <RadioGroup
            aria-labelledby=""
            name={name}
            value={value}
            onChange={onChange}
            row={isRadioFlexDirectionRow}
          >
            {options.map((option: any, index: number) => (
              <FormControlLabel
                disabled={disabled}
                key={index}
                value={option.id ? option.id : option}
                control={<Radio name={name} />}
                label={option.value ? option.value : option}
                sx={{ ...styles.formControlLabel }}
              />
            ))}
          </RadioGroup>
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
        </Box>
      </FormControl>
    </>
  );
}

export default RadioButtonsGroup;
