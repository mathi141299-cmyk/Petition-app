import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { FormControl, FormHelperText, Grid, InputLabel } from "@mui/material";

type AutocompleteWithTableProps = {
  value?: string | null | any;
  name?: string | any;
  onChange?: any;
  placeholder?: string;
  options: any;
  sx?: {};
  renderOption?: any;
  getOptionLabel?: any;
  PopperComponent?: any;
  onFocus?: any;
  onBlur?: any;
  onInputChange?: any;
  freeSolo?: any;
  clearOnEscape?: any;
  key?: any;
  inputRef?: any;
  inputValue?: any;
  optionName?: any;
  label?: any;
  error?: boolean;
  helperText?: string;
  filterOptions?: any;
  defaultValue?: any;
};

const MuiAutocompleteWithTable = ({
  value,
  onChange,
  placeholder,
  name,
  options,
  sx,
  renderOption,
  PopperComponent,
  getOptionLabel,
  onFocus,
  onInputChange,
  clearOnEscape,
  freeSolo,
  key,
  inputRef,
  inputValue,
  optionName = "name",
  label,
  error,
  onBlur,
  helperText,
  defaultValue,
  filterOptions,
}: AutocompleteWithTableProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Grid>
      {label && (
        <InputLabel
          htmlFor="merchant-autocomplete"
          focused={isFocused}
          sx={{ fontSize: "12px" }}
        >
          {label}
        </InputLabel>
      )}
      <FormControl fullWidth sx={{ mt: label ? "5px" : "0px" }}>
        <Autocomplete
          freeSolo={freeSolo}
          openOnFocus={true}
          key={key}
          multiple
          value={value || []}
          options={options}
          defaultValue={defaultValue}
          onChange={onChange}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          disableCloseOnSelect
          popupIcon={<ExpandMoreIcon />}
          id="controllable-states-demo"
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          // sx={sx}
          onFocus={onFocus}
          onBlur={onBlur}
          onInputChange={onInputChange}
          inputValue={inputValue || ""}
          filterOptions={filterOptions}
          sx={{
            fontFamily: ["Inter", "sans-serif"].join(","),

            "& .MuiInputBase-input": {
              padding: "14px 0",
            },
            "& .MuiOutlinedInput-root.Mui-focused": {
              borderColor: "primary.main",
              boxShadow: " 0px 1px 2px 0px rgba(176, 188, 165, 0.2)",
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "5px",
              padding: "6.5px 3px",
              boxShadow: " 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
            },
            // "& .MuiOutlinedInput-root": {
            //   borderRadius: "8px",
            //   paddingLeft: "15px",
            //   boxShadow: " 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
            // },

            "& .MuiInputBase-input.Mui-disabled": {
              borderColor: "#E5E7EB",
              backgroundColor: "#F4F4F5",
              pl: "8px",
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
            "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
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

            ...sx,
          }}
          renderInput={(params) => {
            return (
              <>
                <TextField
                  {...params}
                  name={name}
                  inputRef={inputRef}
                  InputProps={{
                    ...params.InputProps,
                  }}
                  placeholder={placeholder}
                />
              </>
            );
          }}
          PopperComponent={PopperComponent}
          includeInputInList
        />
      </FormControl>
      {helperText && (
        <FormHelperText error={error} sx={{ ml: 2 }}>
          {helperText}
        </FormHelperText>
      )}
    </Grid>
  );
};

export default MuiAutocompleteWithTable;
