import React, { useRef, useState } from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box, InputAdornment, Grid } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { InputLabel } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
type SelectProps = {
  value?: string | string[] | any;
  name?: string;
  error?: boolean;
  onBlur?: any;
  helperText?: string;
  onChange?: (event: SelectChangeEvent<string>) => void;
  placeholder?: string | any;
  placeholderIcon?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | undefined;
  options?: string[] | any | undefined;
  label?: string | undefined | any;
  width?: string;
  inputRef?: any;
  focused?: boolean;
  sx?: {};
  formControlStyle?: {};
  menuStyle?: {};
  isMultiSelect?: boolean;
  onFocus?: () => void;
  defaultValue?: string | undefined | string[] | any;
  disabled?: boolean;
  // setScrollCount: any;
  selectedType?: any;
};

const MuiSelect = ({
  value,
  onChange,
  error,
  helperText,
  onBlur,
  placeholder,
  name,
  placeholderIcon,
  options,
  label,
  width = "427px",
  inputRef,
  focused,
  sx,
  formControlStyle,
  isMultiSelect = false,
  menuStyle,
  onFocus,
  defaultValue,
  disabled,
  selectedType = "number",
}: SelectProps) => {
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;

  const selectRef: any = useRef();

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: width
          ? (width as string | number)
          : selectRef?.current?.offsetWidth,
        ...menuStyle,
      },
    },
  };

  const styles = {
    formControl: {
      ...formControlStyle,
      mt: label ? "5px" : "0px",
    },
    select: {
      width: { width },
      pl: "8px",
      boxShadow: "none",
      borderRadius: "5px",
      "& .MuiOutlinedInput-input": {
        padding: "14px 2px",
      },
      color: "textPrimary.main",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E5E7EB",
      },
      "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E5E7EB",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "primary.main",
      },
      "& .Mui-focused": {
        visibility: "hidden",
      },
      "& .MuiInputBase-root:has(.MuiSelect-iconOpen) .MuiInputBase-root.Mui-focused":
        {
          visibility: "visible",
        },
      "& .MuiTableCell-body:has(.Mui-focused)": {
        borderColor: "primary.main",
        borderWidth: "2px",
        p: "0px",
        height: "31px",
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
    },
  };

  const [isFocused, setIsFocused] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <Grid sx={{ display: "flex", flexDirection: "column" }}>
      {label && (
        <InputLabel
          focused={isFocused || focused}
          sx={{ color: "greyScale.main", fontSize: "12px" }}
        >
          {label}
        </InputLabel>
      )}
      <FormControl sx={{ ...styles.formControl }}>
        <Select
          ref={selectRef}
          defaultValue={defaultValue}
          displayEmpty
          autoWidth
          open={isFocused}
          onClose={() => {
            setIsFocused(false);
            setOpen(false);
          }}
          onOpen={() => {
            setIsFocused(true);
            setOpen(true);
          }}
          onFocus={onFocus}
          value={value}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          IconComponent={ExpandMoreIcon}
          inputRef={inputRef}
          multiple={isMultiSelect}
          disabled={disabled}
          input={
            <OutlinedInput
              startAdornment={
                placeholderIcon && (
                  <InputAdornment position="start">
                    {placeholderIcon}
                  </InputAdornment>
                )
              }
            />
          }
          renderValue={(selected: any) => {
            if (!selected) {
              return (
                <Box
                  sx={{
                    color: "textPrimary.main",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                  }}
                >
                  {placeholder}
                </Box>
              );
            }

            const selectedOption = options?.find((option: any) => {
              return selectedType === "object"
                ? option?.name === selected.name
                : selectedType === "number"
                ? option?.id === selected
                : option?.name === selected;
            });

            if (isMultiSelect) {
              const selectOptions = options
                .filter((option: any) => selected?.includes(option.id))
                .map((option: any) => option.name)
                .join(", ");

              return (
                <Box
                  sx={{
                    color: "textPrimary.main",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {selectOptions}
                </Box>
              );
            }

            if (!selectedOption) {
              return (
                <Box
                  sx={{
                    color: "textPrimary.main",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "12px",
                  }}
                >
                  {placeholder}
                </Box>
              );
            }

            return (
              <Box
                sx={{
                  color: "textPrimary.main",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "12px",
                }}
              >
                {selectedOption.name ? selectedOption.name : selectedOption.id}
              </Box>
            );
          }}
          MenuProps={MenuProps}
          inputProps={{ "aria-label": "Without label" }}
          sx={{
            ...styles.select,
            ...sx,
          }}
        >
          {options?.map((option: any, index: number) => (
            <MenuItem
              key={index}
              value={
                selectedType === "object"
                  ? option
                  : selectedType === "number"
                  ? option.id
                  : option.name
              }
              sx={{
                "&:hover:not(.Mui-focused)": {
                  backgroundColor: "#ededed", // Change to the desired color on hover
                },
                "&.Mui-selected": {
                  backgroundColor: "#F97D09 !important", // Change to the desired color on hover
                  color: "#fff !important",

                  "&:hover": {
                    color: "textPrimary.main",
                  },
                },
                "&:first-of-type": {
                  backgroundColor: "white",
                  color: "textPrimary.main",
                },
                borderRadius: "5px",
                p: "8px 10px",
                m: "3px 5px",
              }}
            >
              {option.name || option.value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {helperText !== undefined && (
        <FormHelperText
          error={error}
          sx={{ ml: 2, fontSize: "11px", minHeight: "20px", height: "auto" }}
        >
          {helperText}
        </FormHelperText>
      )}
    </Grid>
  );
};
export default MuiSelect;
