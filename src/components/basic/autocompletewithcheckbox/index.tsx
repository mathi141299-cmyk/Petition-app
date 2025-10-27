import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  Paper,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import React, { useEffect, useMemo, useRef } from "react";
import moment from "moment";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
type AutoCompleteWithCheckBoxesProps = {
  label?: any;
  sx?: any;
  placeholder?: string;
  options?: [] | any;
  onChange?: any;
  defaultValue?: [] | any;
  value?: any;
  disabled?: boolean;
  tableFormat?: boolean;
  helperText?: any;
  error?: any;
  inputRef?: any;
  PopperWidth?: any;
  disableCloseOnSelect?: any;
  name?: any;
  optionName?: string;
  isCheckBoxEnabled?: boolean;
  onInputChange?: any;
  inputValue?: any;
  noOptionsText?: any;
  loading?: any;
};

const AutoCompleteWithCheckBoxes = ({
  label,
  sx,
  placeholder,
  options,
  onChange,
  defaultValue,
  value,
  disabled,
  tableFormat = false,
  helperText,
  error,
  inputRef,
  PopperWidth = "700px",
  disableCloseOnSelect = true,
  name,
  optionName = "name",
  isCheckBoxEnabled = true,
  onInputChange,
  inputValue,
  noOptionsText,
  loading,
}: AutoCompleteWithCheckBoxesProps) => {
  const PopperMy: any = useMemo(() => {
    return function (props: any) {
      const { children, ...rest } = props;
      return (
        <Popper
          {...rest}
          placement="bottom-start"
          // inputRef={inputRef}
          className="auto-complete-popper"
          sx={{
            // overflow: "auto",
            width: "800px",

            minHeight: "300px", // Set max height for vertical scrolling
            "& .MuiPaper-root": {
              width: "800px",
              minHeight: "300px", // Set max height for Popper
              overflow: "hidden", // Enable vertical scroll
            },
          }}
        >
          <Box
            sx={{
              // width: PopperWidth ? PopperWidth : "700px",
              width: "800px",

              // width: "800px",
              display: "flex",
              // justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#f8f8f8",
              height: "43px",
              // overflow: "scroll",
              // overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                width: "100px",
                height: "40px",
                fontSize: "13px",
                fontWeight: "600",
                color: "textPrimary.main",
                textAlign: "center",
                pl: "5%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              Petition No
            </Typography>
            <Typography
              sx={{
                width: "70px",
                height: "40px",
                fontSize: "13px",
                fontWeight: "600",
                color: "textPrimary.main",
                textAlign: "center",
                pl: "5%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              Name
            </Typography>
            <Typography
              sx={{
                width: "75px",
                height: "40px",
                fontSize: "13px",
                fontWeight: "600",
                color: "textPrimary.main",
                textAlign: "center",
                pl: "5%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              Mobile
            </Typography>
            <Typography
              sx={{
                width: "100px",
                height: "40px",
                fontSize: "13px",
                fontWeight: "600",
                color: "textPrimary.main",
                textAlign: "center",
                pl: "5%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              Habitation
            </Typography>
            <Typography
              sx={{
                width: "110px",
                height: "40px",
                fontSize: "13px",
                fontWeight: "600",
                color: "textPrimary.main",
                textAlign: "center",
                pl: "5%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              Department
            </Typography>
            <Typography
              sx={{
                width: "80px",
                height: "40px",
                fontSize: "13px",
                fontWeight: "600",
                color: "textPrimary.main",
                textAlign: "center",
                pl: "5%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              Date
            </Typography>
          </Box>
          {props.children}
        </Popper>
      );
    };
  }, []);

  return (
    <Grid>
      <InputLabel sx={{ fontSize: "12px" }} htmlFor="autocomplete-input">
        {label}
      </InputLabel>
      <FormControl fullWidth sx={{ mt: label ? "5px" : "0px" }}>
        <Autocomplete
          multiple
          // open={true}
          value={value || []}
          options={options}
          defaultValue={defaultValue}
          onChange={onChange}
          onInputChange={onInputChange}
          inputValue={inputValue}
          getOptionLabel={(option: any) =>
            tableFormat ? option?.petitionNo : option?.name
          }
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          disabled={disabled}
          disableCloseOnSelect={true}
          loading={loading}
          popupIcon={<KeyboardArrowDownIcon />}
          renderOption={(props: any, option: any, { selected }: any) => (
            <>
              {tableFormat ? (
                // <Grid
                //   container
                //   // alignItems="center"
                //   {...props}
                //   sx={{
                //     display: "flex",
                //     flexDirection: "row",
                //     alignItems: "center",
                //     borderBottom: "1px solid #ddd",
                //     // width: "800px",
                //     width: "750px",
                //     overflow: "hidden",
                //   }}
                // >
                <Grid
                  item
                  {...props}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottom: "1px solid #ddd",
                    // width: "800px",
                    width: "780px",
                    overflow: "hidden",
                  }}
                >
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    checked={selected}
                    sx={{ marginRight: 2 }}
                  />
                  {/* </Grid> */}
                  <Typography
                    sx={{
                      width: "15%",
                      display: "flex",
                      // justifyContent: "center",
                      alignItems: "flex-start",
                      fontSize: "12px",
                    }}
                  >
                    {option?.petitionNo}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      width: "14%",
                    }}
                  >
                    {option?.petitionerName}
                  </Typography>
                  <Typography sx={{ width: "14%", fontSize: "12px" }}>
                    {option?.mobile}
                  </Typography>
                  <Typography
                    sx={{
                      width: "19%",
                      display: "flex",
                      justifyContent: "flex-start",
                      // alignItems: "center",
                      p: "0 8px",
                      // flexWrap:"wrap"
                      fontSize: "12px",
                    }}
                  >
                    {option?.habitation?.name}
                  </Typography>
                  <Typography
                    sx={{
                      width: "19%",
                      display: "flex",
                      // justifyContent: "center",
                      // alignItems: "center",
                      fontSize: "12px",
                    }}
                  >
                    {option?.petitionDepartment
                      .map((item: any) => item.department.name)
                      .join(", ")}
                  </Typography>
                  <Typography sx={{ width: "8%", fontSize: "12px" }}>
                    {moment(option?.dateAndTime).format("DD/MM/YYYY")}
                  </Typography>
                </Grid>
              ) : (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.name}
                </li>
              )}
            </>
          )}
          renderInput={(params) => (
            <TextField {...params} placeholder={placeholder} name={name} />
          )}
          PopperComponent={tableFormat ? PopperMy : undefined}
          sx={{
            width: 500,
            "& .MuiChip-filled": {
              backgroundColor: "#F4F4F4",
              borderRadius: "5px",
            },
            "& .MuiOutlinedInput-root .MuiAutocomplete-input": {
              p: "5px",
            },
            "& .MuiAutocomplete-input": {
              fontSize: "12px",
              fontFamily: "inter",
            },
            "& .MuiInputBase-input.Mui-disabled": {
              borderColor: "#E5E7EB",
              backgroundColor: "#F4F4F5",
              pl: "5px",
              borderRadius: "8px",
            },
            "& .MuiOutlinedInput-root.Mui-disabled": {
              borderColor: "#E5E7EB",
              backgroundColor: "#F4F4F5",
              // pl: "15px",
              borderRadius: "8px",
            },
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
    </Grid>
  );
};
export default AutoCompleteWithCheckBoxes;
