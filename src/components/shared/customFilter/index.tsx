import {
  Badge,
  Box,
  useTheme,
  Typography,
  Grid,
  useMediaQuery,
} from "@mui/material";
import { useState, type ChangeEvent } from "react";
// import { FilterIcon, SearchIcon, ClearFilterIcon } from "../../../assets/icons";
import { Button } from "../../basic";
// import { MultipleIcon } from "../../../assets/icons";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { Link } from "react-router-dom";

interface Props {
  title?: string;
  subtitle?: string;
  addButtonTitle?: string;
  addButtonTitle2?: string;
  editButtonTitle?: string;
  isShowExport?: boolean;
  searchEnabled?: boolean;
  onAddButtonClick?: any;
  onAddButtonClick2?: () => void;
  onUploadButtonClick?: (e: ChangeEvent<HTMLInputElement>) => void;
  onUpdateButtonClick?: () => void;
  onExportClick?: () => void;
  handleSearch?: (event: ChangeEvent<HTMLInputElement>) => Promise<void>;
  flag?: boolean;
  isFilterEnabled?: boolean;
  handleFilterClick?: () => void;
  handleSearchClick?: () => void;
  isSearchClicked?: boolean;
  FilterElement?: any;
  isFilterOpen?: boolean;
  data?: [] | any;
  isSearchEnabled?: boolean;
  clearFilter?: any;
  searchOnChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  searchName?: string;
  searchValue?: any;
  appliedFilterCount?: number | string;
  customComponent?: any;
  filterComponentWidth?: any;
  clearFilterDivWidth?: any;
}

const CustomFilterElement = ({
  title,
  addButtonTitle,
  addButtonTitle2,
  editButtonTitle,
  isShowExport = false,
  onAddButtonClick,
  onAddButtonClick2,
  onUpdateButtonClick,
  onUploadButtonClick,
  onExportClick,
  flag = false,
  isFilterEnabled = false,
  data,
  isSearchEnabled = false,
  clearFilter,
  searchOnChange,
  searchName,
  searchValue,
  appliedFilterCount,
  customComponent,
  filterComponentWidth,
  clearFilterDivWidth,
}: Props): JSX.Element => {
  const currentTheme = useTheme();
  const colors = currentTheme.palette;

  const [filterClicked, setFilterClicked] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);

  // console.log("customComponent from CustomFilterElement", customComponent);

  const styles = {
    mainBox: {
      width: "100%",
      // height: "auto",
      display: "flex",
      flexDirection: { xs: "column", lg: "row" },
      justifyContent: "space-between",
      alignItems: { xs: "flex-start", lg: "flex-end" },
    },
    buttonGroupBox: {
      display: "flex",
      justifyContent: "flex-end",
      alignItem: "flex-end",
      width: "auto",
      textAlign: "center",
      mt: { xs: "20px", lg: "0px" },
    },
    addButton: {
      textTransform: "none",
      minHeight: "40px",
      height: "auto",
      width: "auto",
      backgroundColor: "primary.main",
      color: "#FFFFFF",
      border: "none",
      fontSize: "14px",
      fontWeight: 400,
    },
    filterStyles: {
      textAlign: "center",
      alignItems: "center",
      cursor: "pointer !important",
      paddingBottom: "10px",
      margin: 1,
      marginRight: 2,
    },
    searchStyles: {
      textAlign: "center",
      alignItems: "center",
      cursor: "pointer",
      padding: "1rem",
    },
    filterIconBadge: { padding: "2px" },
  };

  return (
    <>
      <Box sx={{ ...styles.mainBox }}>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            width: filterComponentWidth ? filterComponentWidth : "auto",
            flexWrap: "wrap",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "flex-start",
            alignItems: {
              xs: "flex-start",
              sm: "flex-end",
            },
          }}
        >
          {data.map((ele: any) => (
            <Grid item x={9} {...ele.gridProps}>
              {ele.children}
            </Grid>
          ))}
          <Grid
            item
            sx={{
              width: clearFilterDivWidth ? clearFilterDivWidth : "auto",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                mt: {
                  xl: 2.7,
                  sm: 2.7,
                  xs: 2,
                },
                width: "30px",
                height: "30px",
                cursor: "pointer",
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "5px",
                backgroundColor: "rgba(249, 251, 249, 1)",
              }}
              onClick={clearFilter}
            >
              <FilterAltOffIcon />
            </Box>
          </Grid>
        </Box>

        {customComponent && customComponent}
        <Box sx={styles.buttonGroupBox}>
          {addButtonTitle && (
            <Link
              to={onAddButtonClick}
              style={{
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <Button
                variant="contained"
                buttonText={addButtonTitle}
                sx={styles.addButton}
              />
            </Link>
          )}
        </Box>
      </Box>
    </>
  );
};

export default CustomFilterElement;
