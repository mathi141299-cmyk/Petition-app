// import React, { useState } from "react";
// import Autocomplete from "@mui/material/Autocomplete";
// import TextField from "@mui/material/TextField";
// import Grid from "@mui/material/Grid";
// import {
//   InputLabel,
//   FormControl,
//   MenuItem,
//   FormHelperText,
//   Box,
//   ListItem,
// } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import useInfiniteScroll from "react-infinite-scroll-hook";

// type AutoSelectProps = {
//   value?: any;
//   name?: any;
//   onChange?: any;
//   onClick?: () => void;
//   placeholder?: string;
//   placeholderIcon?:
//     | React.ReactElement<any, string | React.JSXElementConstructor<any>>
//     | undefined;
//   options?: string[] | any;
//   onInputChange?: (e: any, newInputValue: any) => void;
//   label?: any;
//   inputValue?: string;
//   width?: string;
//   sx?: {};
//   error?: boolean;
//   helperText?: string;
//   onBlur?: any;
//   InputAdornmentIcon?: any;
//   customButton?: { enabled?: boolean; text?: string };
//   inputRef?: any;
//   key?: any;
//   freeSolo?: any;
//   type?: string;
//   items?: any;
//   hasNextPage?: any;
//   loadMore?: any;
//   loading?: any;
// };

// export default function MuiAutoComplete({
//   value,
//   onChange,
//   placeholder,
//   inputValue,
//   onInputChange,
//   name,
//   placeholderIcon,
//   options,
//   label,
//   sx,
//   onClick,
//   error,
//   onBlur,
//   helperText,
//   InputAdornmentIcon,
//   customButton = { enabled: false },
//   inputRef,
//   key,
//   freeSolo = false,
//   type,
//   items,
//   hasNextPage,
//   loadMore,
//   loading,
// }: AutoSelectProps) {
//   const [isFocused, setIsFocused] = useState(false);
//   const [infiniteRef, { rootRef }] = useInfiniteScroll({
//     loading,
//     hasNextPage,
//     onLoadMore: loadMore,
//     disabled: !!error,
//     rootMargin: "0px 0px 400px 0px",
//   });
//   const renderSentry = () => {
//     return hasNextPage || loading ? (
//       <ListItem ref={infiniteRef} key="sentry">
//         Loading...
//       </ListItem>
//     ) : null;
//   };

//   const handleRenderOption = (optionProps?: any, option?: any) => {
//     const { id, mobileNumber, name } = option;

//     if (id === "sentry") {
//       return renderSentry();
//     }
//     return (
//       <MenuItem
//         {...optionProps}
//         key={id}
//         ref={infiniteRef}
//         sx={{
//           "&:hover, &.Mui-focused:hover": {
//             color: "backgroundPrimary.main",
//             backgroundColor: "primary.main",
//           },

//           borderRadius: "5px",

//           p: "15px",
//           m: "0 5px",
//           gap: 10,
//         }}
//       >
//         <Box> {mobileNumber}</Box>
//         <Box
//           sx={{
//             width: "100%",
//             display: "flex",
//             justifyContent: "flex-end",
//           }}
//         >
//           ({name})
//         </Box>
//       </MenuItem>
//     );
//   };

//   const sentryOption = { id: "sentry", name: "" };
//   return (
//     <Grid>
//       {label && (
//         <InputLabel
//           htmlFor="merchant-autocomplete"
//           focused={isFocused}
//           sx={{ fontSize: "12px" }}
//         >
//           {label}
//         </InputLabel>
//       )}
//       <FormControl fullWidth sx={{ mt: label ? "5px" : "0px" }}>
//         <Autocomplete
//           freeSolo={freeSolo}
//           onFocus={() => setIsFocused(true)}
//           onChange={onChange}
//           id="merchant-autocomplete"
//           options={items}
//           inputValue={inputValue}
//           ListboxProps={{ ref: rootRef }}
//           onInputChange={onInputChange}
//           ref={inputRef}
//           key={key}
//           popupIcon={<ExpandMoreIcon />}
//           sx={{
//             fontFamily: ["Inter", "sans-serif"].join(","),

//             "& .MuiInputBase-input": {
//               padding: "14px 0",
//             },
//             "& .MuiOutlinedInput-root.Mui-focused": {
//               borderColor: "primary.main",
//               boxShadow: " 0px 1px 2px 0px rgba(176, 188, 165, 0.2)",
//             },
//             "& .MuiOutlinedInput-root": {
//               borderRadius: "8px",
//               padding: "6.5px 11.5px",
//               boxShadow: " 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
//             },

//             "& input::placeholder": {
//               fontSize: "12px", // Change the font size as needed
//             },

//             "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
//               borderColor: "#E5E7EB",
//             },
//             "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
//               borderColor: "#E5E7EB",
//             },
//             "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
//               {
//                 borderColor: "primary.main",
//               },
//             "& .MuiOutlinedInput-input": {
//               color: "textPrimary.main",
//             },
//             "&:hover .MuiOutlinedInput-input": {
//               color: "textPrimary.main",
//             },
//             "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
//               color: "textPrimary.main",
//             },
//             "& .MuiInputLabel-outlined": {
//               color: "greyScale.lighter",
//             },
//             "&:hover .MuiInputLabel-outlined": {
//               color: "greyScale.lighter",
//             },
//             "& .MuiInputLabel-outlined.Mui-focused": {
//               color: "primary.main",
//               boxShadow: " 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
//             },

//             ...sx,
//           }}
//           getOptionLabel={(option: any) => `${option.mobileNumber}`}
//           renderOption={(props, option: any) => {
//             return handleRenderOption(props, option);
//           }}
//           renderInput={(params) => {
//             return (
//               <>
//                 <TextField
//                   name={name}
//                   value={value}
//                   onBlur={(e) => {
//                     setIsFocused(false);
//                     onBlur && onBlur(e);
//                   }}
//                   type={type}
//                   {...params}
//                   placeholder={placeholder}
//                   sx={{
//                     "& input::placeholder": {
//                       fontSize: "12px",
//                       color: "black",
//                     },
//                   }}
//                 />
//               </>
//             );
//           }}
//           filterOptions={(filterOptions) => {
//             const shouldRenderSentry = hasNextPage;
//             if (shouldRenderSentry) {
//               filterOptions.push({ ...sentryOption });
//             }
//             return filterOptions;
//           }}
//         />
//       </FormControl>
//       {helperText && (
//         <FormHelperText error={error} sx={{ ml: 2 }}>
//           {helperText}
//         </FormHelperText>
//       )}
//     </Grid>
//   );
// }

// -------------------------------------end-------------------------------

import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import {
  Divider,
  Typography,
  InputLabel,
  FormControl,
  InputAdornment,
  MenuItem,
  FormHelperText,
  Box,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { PatientIcon } from "../../../assets/icons";

interface Choice {
  name: string;
}

type AutoSelectProps = {
  value?: any;
  name?: any;
  onChange?: any;
  onClick?: () => void;
  placeholder?: string;
  placeholderIcon?:
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | undefined;
  options: string[] | any;
  onInputChange?: (e: any, newInputValue: any) => void;
  label?: any;
  inputValue?: string;
  width?: string;
  sx?: {};
  error?: boolean;
  helperText?: string;
  onBlur?: any;
  InputAdornmentIcon?: any;
  customButton?: { enabled?: boolean; text?: string };
  inputRef?: any;
  key?: any;
  freeSolo?: any;
  getOptionLabel?: any;
  renderOption?: any;
  optionName?: any;
  disabled?: any;
  filterOptions?: any;
  clearOnEscape?: any;
  disableClearable?: any;
  PopperComponent?: any;
};

export default function MuiAutoComplete({
  value,
  onChange,
  placeholder,
  inputValue,
  onInputChange,
  name,
  placeholderIcon,
  options,
  label,
  sx,
  onClick,
  error,
  onBlur,
  helperText,
  InputAdornmentIcon,
  customButton = { enabled: false },
  inputRef,
  key,
  freeSolo = false,
  getOptionLabel,
  renderOption,
  optionName = "name",
  disabled = false,
  filterOptions,
  clearOnEscape = false,
  disableClearable = false,
  PopperComponent,
}: AutoSelectProps) {
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
          clearOnEscape={clearOnEscape}
          disableClearable={disableClearable}
          // onFocus={() => setIsFocused(true)}
          onChange={onChange}
          id="merchant-autocomplete"
          options={options}
          inputValue={inputValue || ""}
          disabled={disabled}
          onInputChange={onInputChange}
          // ref={inputRef}
          key={key}
          filterOptions={filterOptions}
          popupIcon={<ExpandMoreIcon />}
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
              borderRadius: "5px",
            },
            "& .MuiOutlinedInput-root.Mui-disabled": {
              borderColor: "#E5E7EB",
              backgroundColor: "#F4F4F5",
              // pl: "15px",
              borderRadius: "5px",
              boxShadow: "none",
            },
            "&.Mui-disabled.MuiOutlinedInput-root": {
              borderColor: "#E5E7EB",
              backgroundColor: "#F4F4F5",
              pl: "15px",
              borderRadius: "5px",
              boxShadow: "none",
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

            // "& .MuiOutlinedInput-notchedOutline": {
            //   borderColor: "greyScale.lighter", // Default border color
            // },
            // "&:hover .MuiOutlinedInput-notchedOutline": {
            //   borderColor: "greyScale.light", // Change the border color on hover
            // },
            // "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            //   borderColor: "primary.main",
            // },
            // "&:hover:not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
            //   borderColor: "greyScale.lighter", // Change the border color on hover
            // },
            // "&.MuiAutocomplete-root .MuiOutlinedInput-root": {
            //   padding: "6.5px",
            //   boxShadow: " 0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
            //   borderRadius: "8px",
            // },

            ...sx,
          }}
          getOptionLabel={
            getOptionLabel
              ? getOptionLabel
              : (option: any) => option[optionName]
          }
          // getOptionLabel={(option: any) => option?.name}
          // renderOption={(props, option: any) => {
          //   return (
          //     <MenuItem
          //       key={option.id}
          //       sx={{
          //         "&:hover, &.Mui-focused:hover": {
          //           color: "backgroundPrimary.main",
          //           backgroundColor: "primary.main", // Change to the desired color on hover
          //         },

          //         borderRadius: "5px",

          //         p: "15px",
          //         m: "0 5px",
          //         // display: "flex",
          //         // justifyContent: "space-between",
          //         gap: 10,
          //       }}
          //       {...props}
          //     >
          //       <Box>{option?.name}</Box>
          //       <Box
          //         sx={{
          //           width: "100%",
          //           display: "flex",
          //           justifyContent: "flex-end",
          //         }}
          //       >
          //         ( {option?.mobileNumber})
          //       </Box>
          //     </MenuItem>
          //   );
          // }}
          renderOption={
            renderOption
              ? renderOption
              : (props, option: any, index: any) => {
                  return (
                    <>
                      <MenuItem
                        sx={{
                          "&:hover, &.Mui-focused:hover": {
                            color: "backgroundPrimary.main",
                            backgroundColor: "primary.main", // Change to the desired color on hover
                          },

                          borderRadius: "5px",

                          p: "15px",
                          m: "0 5px",
                        }}
                        {...props}
                      >
                        {option[optionName]}
                      </MenuItem>
                    </>
                  );
                }
          }
          renderInput={(params) => {
            return (
              <>
                <TextField
                  name={name}
                  value={value}
                  inputRef={inputRef}
                  // inputValue={inputValue}
                  // onBlur={(e) => {
                  //   setIsFocused(false);
                  //   onBlur && onBlur(e);
                  // }}
                  {...params}
                  //   InputProps={{
                  //     ...params.InputProps,
                  //     startAdornment: InputAdornment ? (
                  //       <InputAdornment position="start" sx={{ pl: 1 }}>
                  //         {InputAdornmentIcon}
                  //       </InputAdornment>
                  //     ) : null,
                  //   }}
                  placeholder={placeholder}
                  sx={{
                    "& input::placeholder": {
                      fontSize: "12px",
                      color: "black",
                    },
                  }}
                />
              </>
            );
          }}
          PopperComponent={PopperComponent}
          PaperComponent={({ children }) => {
            return (
              <Paper>
                {children}
                {customButton?.enabled === true ? (
                  <>
                    <Divider />
                    <Button
                      color="primary"
                      fullWidth
                      sx={{
                        justifyContent: "flex-start",
                        p: 2,
                        pl: 2,
                        color: "primary.main",
                      }}
                      onMouseDown={onClick}
                    >
                      <Typography
                        variant="h4"
                        sx={{ textTransform: "none", color: "primary.main" }}
                      >
                        {customButton.text}
                      </Typography>
                    </Button>
                  </>
                ) : null}
              </Paper>
            );
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
}
